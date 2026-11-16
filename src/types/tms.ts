export type UserRole =
  | 'org_admin'
  | 'operations_manager'
  | 'dispatcher'
  | 'finance_manager'
  | 'carrier_user';

export type OrderStatus =
  | 'draft'
  | 'confirmed'
  | 'planned'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export type ShipmentStatus =
  | 'created'
  | 'planned'
  | 'carrier_assigned'
  | 'dispatched'
  | 'in_transit'
  | 'at_risk'
  | 'delayed'
  | 'delivered'
  | 'cancelled';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type ExceptionType =
  | 'vehicle_breakdown'
  | 'delayed_pickup'
  | 'missed_checkpoint'
  | 'route_deviation'
  | 'capacity_issue'
  | 'delivery_rejection'
  | 'missing_pod'
  | 'invoice_mismatch';

export type ExceptionStatus =
  | 'open'
  | 'investigating'
  | 'action_recommended'
  | 'resolved'
  | 'closed';

export type RecommendedActionType =
  | 'contact_carrier'
  | 'notify_customer'
  | 'escalate_ops_manager'
  | 'reassign_carrier'
  | 'request_updated_eta'
  | 'prioritise_shipment'
  | 'create_delivery_followup'
  | 'request_missing_pod';

export type TrackingEventType =
  | 'order_created'
  | 'vehicle_assigned'
  | 'departed_origin'
  | 'checkpoint_reached'
  | 'in_transit_update'
  | 'arrived_destination_hub'
  | 'out_for_delivery'
  | 'delivered'
  | 'delay_reported'
  | 'breakdown_reported'
  | 'route_deviation';

export type DocumentType =
  | 'eway_bill'
  | 'lorry_receipt'
  | 'proof_of_delivery'
  | 'freight_invoice'
  | 'delivery_receipt'
  | 'inspection_report';

export type AuditStatus =
  | 'passed'
  | 'discrepancy_flagged'
  | 'pending_review'
  | 'approved'
  | 'rejected';

export type DiscrepancyReason =
  | 'none'
  | 'extra_fuel_surcharge'
  | 'incorrect_distance_charge'
  | 'duplicate_invoice'
  | 'base_rate_mismatch'
  | 'detention_unauthorized';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface Organisation {
  id: string;
  name: string;
  slug: string;
  code: string;
  gst_number: string;
  created_at: string;
  updated_at?: string;
}

export interface OrganisationMember {
  id: string;
  organisation_id: string;
  user_id: string;
  role: UserRole;
  status: 'active' | 'suspended';
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  default_role: UserRole;
  created_at: string;
  updated_at?: string;
}

export interface Customer {
  id: string;
  organisation_id: string;
  name: string;
  code: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pin_code: string;
  credit_limit_inr: number;
  created_at: string;
}

export interface Facility {
  id: string;
  organisation_id: string;
  name: string;
  code: string;
  facility_type: 'hub' | 'warehouse' | 'distribution_center' | 'cross_dock';
  address: string;
  city: string;
  state: string;
  pin_code: string;
  latitude: number;
  longitude: number;
  lat?: number;
  lng?: number;
  contact_name: string;
  contact_phone: string;
  created_at: string;
}

export interface Carrier {
  id: string;
  organisation_id: string;
  name: string;
  code: string;
  contact_person: string;
  email: string;
  phone: string;
  rating: number; // 1.0 to 5.0
  on_time_percentage: number; // e.g. 94.5
  avg_delay_hours: number;
  cancellation_rate: number; // e.g. 2.1
  damage_incident_rate: number; // e.g. 0.8
  total_shipments_completed: number;
  serviceable_lanes_count: number;
  base_rate_per_km_inr: number;
  is_active: boolean;
  created_at: string;
}

export interface Vehicle {
  id: string;
  organisation_id: string;
  carrier_id: string;
  registration_number: string;
  vehicle_type: 'Tata Ace' | '14ft Eicher' | '19ft Container' | '32ft Multi-Axle' | '40ft Trailer';
  max_weight_kg: number;
  max_volume_cbm: number;
  driver_name: string;
  driver_phone: string;
  current_status: 'available' | 'in_transit' | 'maintenance' | 'offline';
  created_at: string;
}

export interface TransportLane {
  id: string;
  organisation_id: string;
  origin_city: string;
  destination_city: string;
  distance_km: number;
  transit_time_hours: number;
  standard_rate_inr: number;
  toll_estimate_inr: number;
  difficulty_rating: number; // 1-5
  is_active: boolean;
  created_at: string;
}

export interface TransportationOrder {
  id: string;
  organisation_id: string;
  customer_id: string;
  customer_name?: string;
  order_number: string;
  origin_facility_id: string;
  origin_facility_name?: string;
  origin_city: string;
  destination_facility_id: string;
  destination_facility_name?: string;
  destination_city: string;
  pickup_address: string;
  delivery_address: string;
  cargo_description: string;
  cargo_category: string;
  cargo_weight_kg: number;
  cargo_volume_cbm: number;
  required_vehicle_type: string;
  pickup_deadline: string;
  delivery_deadline: string;
  special_instructions?: string;
  status: OrderStatus;
  estimated_freight_inr: number;
  shipment_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface Shipment {
  id: string;
  organisation_id: string;
  shipment_number: string;
  order_ids: string[];
  carrier_id?: string;
  carrier_name?: string;
  vehicle_id?: string;
  vehicle_registration?: string;
  vehicle_type?: string;
  origin_facility_id: string;
  origin_city: string;
  destination_facility_id: string;
  destination_city: string;
  scheduled_pickup_at: string;
  actual_pickup_at?: string;
  estimated_delivery_at: string;
  actual_delivery_at?: string;
  total_weight_kg: number;
  total_volume_cbm: number;
  agreed_freight_rate_inr: number;
  status: ShipmentStatus;
  risk_score: number; // 0-100
  risk_level: RiskLevel;
  dispatcher_id?: string;
  dispatcher_name?: string;
  tracking_number: string;
  created_at: string;
  updated_at?: string;
}

export interface ShipmentStop {
  id: string;
  organisation_id: string;
  shipment_id: string;
  stop_sequence: number;
  stop_type: 'pickup' | 'checkpoint' | 'delivery';
  facility_name: string;
  city: string;
  planned_arrival: string;
  actual_arrival?: string;
  status: 'pending' | 'arrived' | 'departed' | 'skipped';
  notes?: string;
  created_at: string;
}

export interface TrackingEvent {
  id: string;
  organisation_id: string;
  shipment_id: string;
  event_type: TrackingEventType;
  location_name: string;
  city: string;
  latitude?: number;
  longitude?: number;
  event_timestamp: string;
  description: string;
  is_simulated: boolean;
  created_by?: string;
  created_at: string;
}

export interface ShipmentException {
  id: string;
  organisation_id: string;
  shipment_id: string;
  shipment_number?: string;
  exception_type: ExceptionType;
  severity: RiskLevel;
  title: string;
  description: string;
  evidence_data: Record<string, any>;
  status: ExceptionStatus;
  recommended_action_type?: RecommendedActionType;
  ai_recommendation?: {
    problem_identified: string;
    evidence: string;
    recommended_action: string;
    expected_outcome: string;
    confidence_level: number; // e.g. 0.92
    requires_approval: boolean;
    suggested_payload?: Record<string, any>;
  };
  resolution_notes?: string;
  resolved_at?: string;
  resolved_by?: string;
  created_at: string;
}

export interface CarrierQuote {
  id: string;
  organisation_id: string;
  shipment_id: string;
  carrier_id: string;
  carrier_name: string;
  quote_amount_inr: number;
  estimated_transit_hours: number;
  score_overall: number; // 0-100
  score_cost: number;
  score_otp: number;
  score_capacity: number;
  score_incident: number;
  score_lane_exp: number;
  recommendation_rank: number;
  is_selected: boolean;
  override_reason?: string;
  created_at: string;
}

export interface ScoringWeights {
  cost: number; // default 0.35
  on_time: number; // default 0.30
  capacity: number; // default 0.15
  incident: number; // default 0.10
  lane_experience: number; // default 0.10
}

export interface FreightDocument {
  id: string;
  organisation_id: string;
  shipment_id?: string;
  shipment_number?: string;
  document_type: DocumentType;
  file_name: string;
  file_size_bytes: number;
  mime_type: string;
  storage_path: string;
  public_url?: string;
  verified: boolean;
  verification_notes?: string;
  uploaded_by?: string;
  created_at: string;
}

export interface FreightInvoice {
  id: string;
  organisation_id: string;
  shipment_id: string;
  shipment_number?: string;
  carrier_id: string;
  carrier_name?: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  expected_amount_inr: number;
  billed_amount_inr: number;
  variance_amount_inr: number;
  variance_percentage: number;
  audit_status: AuditStatus;
  discrepancy_reason: DiscrepancyReason;
  payment_status: 'unpaid' | 'approved_for_payment' | 'paid';
  created_at: string;
}

export interface FreightInvoiceItem {
  id: string;
  organisation_id: string;
  invoice_id: string;
  item_description: string;
  expected_rate_inr: number;
  billed_rate_inr: number;
  variance_inr: number;
  is_flagged: boolean;
  created_at: string;
}

export interface Approval {
  id: string;
  organisation_id: string;
  entity_type: 'exception_action' | 'carrier_override' | 'invoice_payment' | 'rate_revision';
  entity_id: string;
  requested_by: string;
  requested_by_name?: string;
  requested_action: string;
  justification: string;
  impact_summary: string;
  status: ApprovalStatus;
  approved_by?: string;
  approved_by_name?: string;
  reviewed_at?: string;
  review_notes?: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  organisation_id: string;
  user_id?: string;
  user_name?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}

export interface ProductEvent {
  id: string;
  organisation_id: string;
  user_id?: string;
  event_name: string;
  event_properties: Record<string, any>;
  session_id?: string;
  created_at: string;
}

export interface KPIStats {
  totalShipments: number;
  activeShipments: number;
  deliveredShipments: number;
  delayedShipments: number;
  atRiskShipments: number;
  onTimeDeliveryRate: number; // percentage e.g. 92.4
  freightExpenditureTotalInr: number;
  averageDeliveryHours: number;
  openExceptionsCount: number;
  averageResolutionHours: number;
  invoicesDiscrepancyRate: number;
}
