import {
  Shipment,
  TransportationOrder,
  Carrier,
  Vehicle,
  TransportLane,
  Customer,
  Facility,
  TrackingEvent,
  ShipmentException,
  FreightInvoice,
  Approval,
  FreightDocument,
  ActivityLog,
  KPIStats,
  ScoringWeights,
  TrackingEventType,
} from '@/types/tms';
import { generateSeedData, DEFAULT_SCORING_WEIGHTS } from '@/lib/data/mock-data';
import { calculateCarrierScores } from '@/lib/services/carrier-scoring';
import { calculateShipmentRisk } from '@/lib/ai/exception-engine';

// Singleton persistent state for local/interactive demo operations
class TMSRepository {
  private data = generateSeedData();
  private weights: ScoringWeights = { ...DEFAULT_SCORING_WEIGHTS };

  constructor() {
    // Repository initialized with fresh relative demo data
  }

  public getWeights(): ScoringWeights {
    return { ...this.weights };
  }

  public updateWeights(newWeights: Partial<ScoringWeights>) {
    this.weights = { ...this.weights, ...newWeights };
  }

  // --- KPI STATS ---
  public getKPIStats(): KPIStats {
    const shipments = this.data.shipments;
    const totalShipments = shipments.length;
    const activeShipments = shipments.filter((s) =>
      ['dispatched', 'in_transit', 'at_risk', 'delayed'].includes(s.status)
    ).length;
    const deliveredShipments = shipments.filter((s) => s.status === 'delivered').length;
    const delayedShipments = shipments.filter((s) => s.status === 'delayed').length;
    const atRiskShipments = shipments.filter((s) => s.status === 'at_risk').length;

    const onTimeDelivered = shipments.filter((s) => {
      if (s.status !== 'delivered' || !s.actual_delivery_at) return false;
      return new Date(s.actual_delivery_at).getTime() <= new Date(s.estimated_delivery_at).getTime();
    }).length;

    const onTimeDeliveryRate = deliveredShipments > 0
      ? Number(((onTimeDelivered / deliveredShipments) * 100).toFixed(1))
      : 94.2;

    const freightExpenditureTotalInr = shipments.reduce(
      (sum, s) => sum + (s.agreed_freight_rate_inr || 0),
      0
    );

    const openExceptionsCount = this.data.exceptions.filter(
      (e) => e.status === 'open' || e.status === 'action_recommended'
    ).length;

    const invoicesWithDiscrepancy = this.data.freightInvoices.filter(
      (i) => i.audit_status === 'discrepancy_flagged'
    ).length;
    const invoicesDiscrepancyRate = this.data.freightInvoices.length > 0
      ? Number(((invoicesWithDiscrepancy / this.data.freightInvoices.length) * 100).toFixed(1))
      : 15.0;

    return {
      totalShipments,
      activeShipments,
      deliveredShipments,
      delayedShipments,
      atRiskShipments,
      onTimeDeliveryRate,
      freightExpenditureTotalInr,
      averageDeliveryHours: 28.5,
      openExceptionsCount,
      averageResolutionHours: 2.4,
      invoicesDiscrepancyRate,
    };
  }

  // --- ORDERS ---
  public getOrders(filters?: { status?: string; search?: string }): TransportationOrder[] {
    let result = [...this.data.orders];
    if (filters?.status && filters.status !== 'all') {
      result = result.filter((o) => o.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (o) =>
          o.order_number.toLowerCase().includes(q) ||
          o.customer_name?.toLowerCase().includes(q) ||
          o.origin_city.toLowerCase().includes(q) ||
          o.destination_city.toLowerCase().includes(q) ||
          o.cargo_description.toLowerCase().includes(q)
      );
    }
    return result;
  }

  public getOrderById(id: string): TransportationOrder | undefined {
    return this.data.orders.find((o) => o.id === id);
  }

  public createOrder(orderData: Omit<TransportationOrder, 'id' | 'created_at' | 'updated_at'>): TransportationOrder {
    const id = `ord-${Date.now()}`;
    const newOrder: TransportationOrder = {
      ...orderData,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.orders.unshift(newOrder);

    this.logActivity('Order created from Transportation Operations Desk', 'order', newOrder.order_number, {
      customer: newOrder.customer_name,
      origin: newOrder.origin_city,
      destination: newOrder.destination_city,
      weight_kg: newOrder.cargo_weight_kg,
    });

    return newOrder;
  }

  // --- SHIPMENTS ---
  public getShipments(filters?: { status?: string; search?: string; carrierId?: string }): Shipment[] {
    let result = [...this.data.shipments];
    if (filters?.status && filters.status !== 'all') {
      result = result.filter((s) => s.status === filters.status);
    }
    if (filters?.carrierId && filters.carrierId !== 'all') {
      result = result.filter((s) => s.carrier_id === filters.carrierId);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.shipment_number.toLowerCase().includes(q) ||
          s.tracking_number.toLowerCase().includes(q) ||
          s.carrier_name?.toLowerCase().includes(q) ||
          s.origin_city.toLowerCase().includes(q) ||
          s.destination_city.toLowerCase().includes(q) ||
          s.vehicle_registration?.toLowerCase().includes(q)
      );
    }
    return result;
  }

  public getShipmentById(id: string): (Shipment & {
    orders: TransportationOrder[];
    trackingEvents: TrackingEvent[];
    exceptions: ShipmentException[];
    documents: FreightDocument[];
  }) | undefined {
    const shipment = this.data.shipments.find((s) => s.id === id || s.shipment_number === id);
    if (!shipment) return undefined;

    const orders = this.data.orders.filter((o) => shipment.order_ids.includes(o.id));
    const trackingEvents = this.data.trackingEvents
      .filter((e) => e.shipment_id === shipment.id)
      .sort((a, b) => new Date(a.event_timestamp).getTime() - new Date(b.event_timestamp).getTime());
    const exceptions = this.data.exceptions.filter((e) => e.shipment_id === shipment.id);
    const documents = this.data.documents.filter((d) => d.shipment_id === shipment.id);

    return {
      ...shipment,
      orders,
      trackingEvents,
      exceptions,
      documents,
    };
  }

  public planShipment(data: {
    orderIds: string[];
    carrierId?: string;
    vehicleId?: string;
    scheduledPickup: string;
    estimatedDelivery: string;
    agreedRateInr: number;
  }): Shipment {
    const selectedOrders = this.data.orders.filter((o) => data.orderIds.includes(o.id));
    if (selectedOrders.length === 0) throw new Error('No valid orders selected for shipment planning.');

    const totalWeight = selectedOrders.reduce((sum, o) => sum + o.cargo_weight_kg, 0);
    const totalVolume = selectedOrders.reduce((sum, o) => sum + o.cargo_volume_cbm, 0);

    const carrier = data.carrierId ? this.data.carriers.find((c) => c.id === data.carrierId) : undefined;
    const vehicle = data.vehicleId ? this.data.vehicles.find((v) => v.id === data.vehicleId) : undefined;

    const shipmentIndex = this.data.shipments.length + 1;
    const shipmentId = `shp-${Date.now()}`;
    const shipmentNumber = `TMS-${1000 + shipmentIndex}`;

    const newShipment: Shipment = {
      id: shipmentId,
      organisation_id: this.data.organisation.id,
      shipment_number: shipmentNumber,
      order_ids: data.orderIds,
      carrier_id: carrier?.id,
      carrier_name: carrier?.name,
      vehicle_id: vehicle?.id,
      vehicle_registration: vehicle?.registration_number,
      vehicle_type: vehicle?.vehicle_type || selectedOrders[0].required_vehicle_type,
      origin_facility_id: selectedOrders[0].origin_facility_id,
      origin_city: selectedOrders[0].origin_city,
      destination_facility_id: selectedOrders[0].destination_facility_id,
      destination_city: selectedOrders[0].destination_city,
      scheduled_pickup_at: data.scheduledPickup,
      estimated_delivery_at: data.estimatedDelivery,
      total_weight_kg: totalWeight,
      total_volume_cbm: totalVolume,
      agreed_freight_rate_inr: data.agreedRateInr,
      status: carrier ? 'carrier_assigned' : 'planned',
      risk_score: 12,
      risk_level: 'low',
      dispatcher_id: 'usr-ops-01',
      dispatcher_name: 'Priya Sharma',
      tracking_number: `TRK-IN-${88000 + shipmentIndex}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.data.shipments.unshift(newShipment);

    // Update order statuses
    selectedOrders.forEach((o) => {
      o.status = 'planned';
      o.shipment_id = newShipment.id;
    });

    this.logActivity(`Planned Shipment ${shipmentNumber} with ${selectedOrders.length} order(s)`, 'shipment', shipmentNumber, {
      carrier: carrier?.name,
      total_weight_kg: totalWeight,
      rate_inr: data.agreedRateInr,
    });

    return newShipment;
  }

  public assignCarrier(shipmentId: string, carrierId: string, quoteAmountInr: number, overrideReason?: string) {
    const shipment = this.data.shipments.find((s) => s.id === shipmentId);
    const carrier = this.data.carriers.find((c) => c.id === carrierId);
    if (!shipment || !carrier) throw new Error('Shipment or carrier not found.');

    shipment.carrier_id = carrier.id;
    shipment.carrier_name = carrier.name;
    shipment.agreed_freight_rate_inr = quoteAmountInr;
    shipment.status = 'carrier_assigned';
    shipment.updated_at = new Date().toISOString();

    if (overrideReason) {
      this.data.approvals.unshift({
        id: `appr-${Date.now()}`,
        organisation_id: this.data.organisation.id,
        entity_type: 'carrier_override',
        entity_id: shipment.id,
        requested_by: 'usr-ops-01',
        requested_by_name: 'Priya Sharma (Operations Manager)',
        requested_action: `Carrier Procurement Override: ${carrier.name}`,
        justification: overrideReason,
        impact_summary: `Assigned at agreed quote of ₹${quoteAmountInr.toLocaleString('en-IN')}`,
        status: 'approved',
        approved_by: 'usr-ops-01',
        reviewed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });
    }

    this.logActivity(`Assigned Carrier ${carrier.name} to ${shipment.shipment_number}`, 'shipment', shipment.shipment_number, {
      agreedRate: quoteAmountInr,
      overrideReason,
    });

    return shipment;
  }

  public dispatchShipment(shipmentId: string) {
    const shipment = this.data.shipments.find((s) => s.id === shipmentId);
    if (!shipment) throw new Error('Shipment not found.');

    shipment.status = 'dispatched';
    shipment.actual_pickup_at = new Date().toISOString();
    shipment.updated_at = new Date().toISOString();

    this.data.trackingEvents.push({
      id: `trk-ev-${Date.now()}`,
      organisation_id: this.data.organisation.id,
      shipment_id: shipment.id,
      event_type: 'departed_origin',
      location_name: `${shipment.origin_city} Central Loading Dock`,
      city: shipment.origin_city,
      event_timestamp: new Date().toISOString(),
      description: `Consignment cleared outbound gate check. Dispatched under E-Way Bill inspection.`,
      is_simulated: true,
      created_at: new Date().toISOString(),
    });

    this.logActivity(`Dispatched Shipment ${shipment.shipment_number}`, 'shipment', shipment.shipment_number, {
      pickupTime: shipment.actual_pickup_at,
    });

    return shipment;
  }

  // --- TRACKING SIMULATOR ---
  public simulateTrackingEvent(
    shipmentId: string,
    eventType: TrackingEventType,
    locationName: string,
    city: string,
    description: string
  ): TrackingEvent {
    const shipment = this.data.shipments.find((s) => s.id === shipmentId);
    if (!shipment) throw new Error('Shipment not found.');

    const newEvent: TrackingEvent = {
      id: `trk-sim-${Date.now()}`,
      organisation_id: this.data.organisation.id,
      shipment_id: shipment.id,
      event_type: eventType,
      location_name: locationName,
      city,
      event_timestamp: new Date().toISOString(),
      description,
      is_simulated: true,
      created_by: 'Senior Dispatcher (Simulator)',
      created_at: new Date().toISOString(),
    };

    this.data.trackingEvents.push(newEvent);

    // Update shipment status based on event
    if (eventType === 'delivered') {
      shipment.status = 'delivered';
      shipment.actual_delivery_at = new Date().toISOString();
      shipment.risk_score = 0;
      shipment.risk_level = 'low';
    } else if (eventType === 'breakdown_reported') {
      shipment.status = 'delayed';
      shipment.risk_score = 92;
      shipment.risk_level = 'critical';

      // Automatically trigger an AI exception
      this.data.exceptions.unshift({
        id: `exc-${Date.now()}`,
        organisation_id: this.data.organisation.id,
        shipment_id: shipment.id,
        shipment_number: shipment.shipment_number,
        exception_type: 'vehicle_breakdown',
        severity: 'critical',
        title: `Vehicle Breakdown Alert on ${city}`,
        description,
        evidence_data: { location: locationName, city, eventTime: new Date().toISOString() },
        status: 'action_recommended',
        recommended_action_type: 'reassign_carrier',
        ai_recommendation: {
          problem_identified: `Engine breakdown reported by driver at ${locationName}.`,
          evidence: `Telemetry alert from simulator: ${description}. Remaining SLA < 8 hours.`,
          recommended_action: 'Deploy emergency transshipment vehicle from nearest hub.',
          expected_outcome: 'Recovers SLA and avoids total customer shipment rejection.',
          confidence_level: 0.96,
          requires_approval: true,
        },
        created_at: new Date().toISOString(),
      });
    } else if (eventType === 'delay_reported') {
      shipment.status = 'at_risk';
      shipment.risk_score = 75;
      shipment.risk_level = 'high';
    } else if (eventType === 'checkpoint_reached' || eventType === 'in_transit_update') {
      if (shipment.status === 'dispatched' || shipment.status === 'created') {
        shipment.status = 'in_transit';
      }
    }

    shipment.updated_at = new Date().toISOString();

    this.logActivity(`Simulated Tracking Event (${eventType}) on ${shipment.shipment_number}`, 'tracking', shipment.shipment_number, {
      city,
      location: locationName,
      description,
    });

    return newEvent;
  }

  // --- EXCEPTIONS & AI RECOMMENDATIONS ---
  public getExceptions(filters?: { status?: string; severity?: string }): ShipmentException[] {
    let result = [...this.data.exceptions];
    if (filters?.status && filters.status !== 'all') {
      result = result.filter((e) => e.status === filters.status);
    }
    if (filters?.severity && filters.severity !== 'all') {
      result = result.filter((e) => e.severity === filters.severity);
    }
    return result;
  }

  public resolveException(
    exceptionId: string,
    action: 'approve_recommendation' | 'reject_recommendation' | 'manual_resolve',
    notes: string,
    userName: string = 'Operations Manager'
  ) {
    const exception = this.data.exceptions.find((e) => e.id === exceptionId);
    if (!exception) throw new Error('Exception not found.');

    const shipment = this.data.shipments.find((s) => s.id === exception.shipment_id);

    if (action === 'approve_recommendation') {
      exception.status = 'resolved';
      exception.resolution_notes = `Approved AI Action: ${exception.ai_recommendation?.recommended_action || notes}`;
      exception.resolved_at = new Date().toISOString();
      exception.resolved_by = userName;

      // If action was reassign carrier or contact carrier, reduce risk score
      if (shipment) {
        shipment.risk_score = Math.max(15, Math.round(shipment.risk_score / 2));
        if (shipment.risk_score < 40) shipment.risk_level = 'low';
        else if (shipment.risk_score < 60) shipment.risk_level = 'medium';
      }

      this.logActivity(`Approved AI Exception Action on ${exception.title}`, 'exception', exception.id, {
        resolution: exception.resolution_notes,
        approvedBy: userName,
      });
    } else if (action === 'reject_recommendation') {
      exception.status = 'investigating';
      exception.resolution_notes = `Rejected AI Recommendation. Manual audit notes: ${notes}`;
      this.logActivity(`Rejected AI Recommendation for ${exception.title}`, 'exception', exception.id, {
        reason: notes,
      });
    } else {
      exception.status = 'resolved';
      exception.resolution_notes = notes;
      exception.resolved_at = new Date().toISOString();
      exception.resolved_by = userName;
      this.logActivity(`Manually Resolved Exception ${exception.title}`, 'exception', exception.id, {
        resolution: notes,
      });
    }

    return exception;
  }

  // --- FREIGHT INVOICES & RECONCILIATION ---
  public getInvoices(filters?: { auditStatus?: string; search?: string }): FreightInvoice[] {
    let result = [...this.data.freightInvoices];
    if (filters?.auditStatus && filters.auditStatus !== 'all') {
      result = result.filter((i) => i.audit_status === filters.auditStatus);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (i) =>
          i.invoice_number.toLowerCase().includes(q) ||
          i.shipment_number?.toLowerCase().includes(q) ||
          i.carrier_name?.toLowerCase().includes(q)
      );
    }
    return result;
  }

  public reconcileInvoice(
    invoiceId: string,
    decision: 'passed' | 'approved' | 'rejected' | 'discrepancy_flagged',
    notes?: string
  ): FreightInvoice {
    const invoice = this.data.freightInvoices.find((i) => i.id === invoiceId);
    if (!invoice) throw new Error('Invoice not found.');

    invoice.audit_status = decision;
    if (decision === 'approved' || decision === 'passed') {
      invoice.payment_status = 'approved_for_payment';
    } else if (decision === 'rejected') {
      invoice.payment_status = 'unpaid';
    }

    this.logActivity(`Reconciled Freight Invoice ${invoice.invoice_number} as ${decision.toUpperCase()}`, 'invoice', invoice.invoice_number, {
      decision,
      variance: invoice.variance_amount_inr,
      notes,
    });

    return invoice;
  }

  // --- CARRIER QUOTES & SCORING ---
  public getCarrierScoresForShipment(shipmentId: string) {
    const shipment = this.data.shipments.find((s) => s.id === shipmentId);
    if (!shipment) throw new Error('Shipment not found.');

    // Find lane for origin and destination
    const lane = this.data.lanes.find(
      (l) => l.origin_city.toLowerCase() === shipment.origin_city.toLowerCase() &&
             l.destination_city.toLowerCase() === shipment.destination_city.toLowerCase()
    ) || this.data.lanes[0];

    return calculateCarrierScores(
      this.data.carriers,
      lane,
      shipment.total_weight_kg,
      shipment.total_volume_cbm,
      shipment.vehicle_type || '19ft Container',
      this.weights
    );
  }

  // --- APPROVALS ---
  public getApprovals(): Approval[] {
    return [...this.data.approvals];
  }

  public handleApproval(approvalId: string, status: 'approved' | 'rejected', notes?: string, userName: string = 'Rajesh Verma (Org Admin)') {
    const appr = this.data.approvals.find((a) => a.id === approvalId);
    if (!appr) throw new Error('Approval request not found.');

    appr.status = status;
    appr.approved_by_name = userName;
    appr.reviewed_at = new Date().toISOString();
    appr.review_notes = notes || (status === 'approved' ? 'Approved by Organization Administrator' : 'Rejected by Organization Administrator');

    this.logActivity(`${status.toUpperCase()} Approval Request: ${appr.requested_action}`, 'approval', appr.id, {
      status,
      notes,
    });

    return appr;
  }

  // --- DOCUMENTS ---
  public getDocuments(shipmentId?: string): FreightDocument[] {
    if (shipmentId) {
      return this.data.documents.filter((d) => d.shipment_id === shipmentId);
    }
    return [...this.data.documents];
  }

  public uploadDocument(doc: Omit<FreightDocument, 'id' | 'created_at'>): FreightDocument {
    const newDoc: FreightDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.data.documents.unshift(newDoc);
    this.logActivity(`Uploaded document ${newDoc.file_name} for ${newDoc.shipment_number || 'General Document Vault'}`, 'document', newDoc.id);
    return newDoc;
  }

  // --- MASTER DATA GETTERS ---
  public getCarriers(): Carrier[] {
    return [...this.data.carriers];
  }

  public getVehicles(): Vehicle[] {
    return [...this.data.vehicles];
  }

  public getLanes(): TransportLane[] {
    return [...this.data.lanes];
  }

  public getFacilities(): Facility[] {
    return [...this.data.facilities];
  }

  public getCustomers(): Customer[] {
    return [...this.data.customers];
  }

  public getActivityLogs(): ActivityLog[] {
    return [...this.data.activityLogs];
  }

  private logActivity(action: string, entity_type: string, entity_id: string, details?: Record<string, any>) {
    this.data.activityLogs.unshift({
      id: `act-${Date.now()}`,
      organisation_id: this.data.organisation.id,
      user_id: 'usr-current',
      user_name: 'Priya Sharma (Operations Manager)',
      action,
      entity_type,
      entity_id,
      details,
      ip_address: '103.21.124.45',
      created_at: new Date().toISOString(),
    });
  }

  // --- AI COPILOT GROUNDED QUERY SERVICE ---
  public answerCopilotQuery(query: string): {
    answer: string;
    supportingShipmentIds: string[];
    dataPoints: Record<string, any>;
    suggestedFollowups: string[];
  } {
    const q = query.toLowerCase();
    const shipments = this.data.shipments;

    if (q.includes('at risk') || q.includes('risk') || q.includes('critical')) {
      const atRisk = shipments.filter((s) => s.status === 'at_risk' || s.risk_score >= 60);
      const ids = atRisk.slice(0, 5).map((s) => s.shipment_number);
      return {
        answer: `There are currently **${atRisk.length} shipments at risk** across your active freight corridors. The top critical shipments are **${ids.join(', ')}** primarily due to highway unscheduled stoppages, engine radiator faults on NH-48, and missed FASTag toll checkpoints. We recommend initiating carrier outreach or approving pending transshipment rescue actions.`,
        supportingShipmentIds: ids,
        dataPoints: {
          totalAtRisk: atRisk.length,
          avgRiskScore: Math.round(atRisk.reduce((acc, s) => acc + s.risk_score, 0) / (atRisk.length || 1)),
          topLanesAffected: ['Gurgaon → Mumbai', 'Pune → Indore', 'Bengaluru → Chennai'],
        },
        suggestedFollowups: [
          'Why is shipment TMS-1039 delayed?',
          'Show pending AI actions for at-risk loads',
          'Which carriers have the lowest on-time percentage?',
        ],
      };
    }

    if (q.includes('carrier') && (q.includes('poor') || q.includes('performance') || q.includes('lowest'))) {
      const sortedCarriers = [...this.data.carriers].sort((a, b) => a.on_time_percentage - b.on_time_percentage);
      const bottomCarriers = sortedCarriers.slice(0, 3);
      return {
        answer: `Based on 12-month audited trip metrics, the lowest-performing carriers are **${bottomCarriers.map((c) => `${c.name} (${c.on_time_percentage}% OTP, avg delay ${c.avg_delay_hours}h)`).join('; ')}**. ARC and Om Logistics show elevated cancellation rates exceeding 3.5%. We recommend adjusting their tender allocation weights downwards.`,
        supportingShipmentIds: [],
        dataPoints: {
          bottomCarriers: bottomCarriers.map((c) => ({ name: c.name, otp: c.on_time_percentage, delayHours: c.avg_delay_hours })),
        },
        suggestedFollowups: [
          'Compare TCI Freight vs VRL Logistics',
          'Adjust carrier procurement scoring weights',
          'View carrier performance leaderboard',
        ],
      };
    }

    if (q.includes('spend') || q.includes('spending') || q.includes('freight cost') || q.includes('expenditure')) {
      const totalSpend = shipments.reduce((sum, s) => sum + s.agreed_freight_rate_inr, 0);
      return {
        answer: `Total freight expenditure recorded across the fleet is **₹${totalSpend.toLocaleString('en-IN')}**. The highest expenditure lane is **Gurgaon → Mumbai (NH-48 corridor)** accounting for ~32% of total freight volume, followed by **Mumbai → Bengaluru** and **Delhi → Ahmedabad**.`,
        supportingShipmentIds: ['TMS-1001', 'TMS-1011', 'TMS-1021'],
        dataPoints: {
          totalSpendInr: totalSpend,
          topLane: 'Gurgaon → Mumbai',
          averageCostPerKm: '₹43.80 / km',
        },
        suggestedFollowups: [
          'Show freight invoices with rate discrepancies',
          'Which lane has the highest cost per km?',
          'Export monthly transportation cost report',
        ],
      };
    }

    if (q.includes('missing pod') || q.includes('proof of delivery') || q.includes('pod')) {
      const missingPodShipments = shipments.filter(
        (s) => s.status === 'delivered' && !this.data.documents.some((d) => d.shipment_id === s.id && d.document_type === 'proof_of_delivery')
      );
      const ids = missingPodShipments.slice(0, 4).map((s) => s.shipment_number);
      return {
        answer: `Found **${missingPodShipments.length} delivered shipments without signed Proof of Delivery (POD)** in the document vault, including **${ids.join(', ')}**. This blocks billing reconciliation and extends customer credit cycles.`,
        supportingShipmentIds: ids,
        dataPoints: {
          missingCount: missingPodShipments.length,
          estimatedUnbilledValue: `₹${(missingPodShipments.length * 48000).toLocaleString('en-IN')}`,
        },
        suggestedFollowups: [
          'Send automated POD reminder to carriers',
          'View unverified freight documents',
          'Filter invoices pending proof of delivery',
        ],
      };
    }

    // Default intelligent response grounded in current data
    const kpis = this.getKPIStats();
    return {
      answer: `Currently tracking **${kpis.totalShipments} total shipments** with **${kpis.activeShipments} live vehicles in transit**. Fleet On-Time Delivery is **${kpis.onTimeDeliveryRate}%**. There are **${kpis.openExceptionsCount} open operational exceptions** requiring review, and **${kpis.atRiskShipments} shipments flagged at risk**. What specific corridor, carrier, or shipment would you like to inspect?`,
      supportingShipmentIds: ['TMS-1039', 'TMS-1042', 'TMS-1045'],
      dataPoints: {
        activeShipments: kpis.activeShipments,
        onTimeRate: `${kpis.onTimeDeliveryRate}%`,
        openExceptions: kpis.openExceptionsCount,
      },
      suggestedFollowups: [
        'Which shipments are at risk today?',
        'Where are we spending the most on transportation?',
        'Which carriers are performing poorly?',
      ],
    };
  }
}

// Global singleton instance so mutations in client/server components reflect across all pages in demo mode
export const tmsRepository = new TMSRepository();
