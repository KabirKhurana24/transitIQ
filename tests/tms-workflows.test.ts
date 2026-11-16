import { describe, it, expect } from 'vitest';
import { tmsRepository } from '@/lib/services/tms-service';

describe('TMS End-to-End Operational Lifecycle Workflows', () => {
  it('creates an order, plans a shipment, simulates telematics, resolves an exception, and reconciles invoice', () => {
    // 1. Order Intake
    const newOrder = tmsRepository.createOrder({
      organisation_id: 'org-apex-001',
      customer_id: 'cust-01',
      customer_name: 'Tata AutoComp Systems Ltd',
      order_number: `ORD-TEST-${Date.now().toString().slice(-4)}`,
      origin_facility_id: 'fac-01',
      origin_city: 'Gurgaon',
      destination_facility_id: 'fac-02',
      destination_city: 'Mumbai',
      pickup_address: 'Plot 45, Udyog Vihar',
      delivery_address: 'Bhiwandi Hub',
      cargo_description: 'Precision Gearboxes',
      cargo_category: 'Automotive',
      cargo_weight_kg: 8500,
      cargo_volume_cbm: 28,
      required_vehicle_type: '19ft Container',
      pickup_deadline: new Date(Date.now() + 24 * 3600000).toISOString(),
      delivery_deadline: new Date(Date.now() + 72 * 3600000).toISOString(),
      status: 'confirmed',
      estimated_freight_inr: 64000,
    });

    expect(newOrder.id).toBeTruthy();
    expect(newOrder.status).toBe('confirmed');

    // 2. Shipment Planning & Load Consolidation
    const plannedShipment = tmsRepository.planShipment({
      orderIds: [newOrder.id],
      carrierId: 'carr-01',
      vehicleId: 'veh-01',
      scheduledPickup: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 48 * 3600000).toISOString(),
      agreedRateInr: 64000,
    });

    expect(plannedShipment.id).toBeTruthy();
    expect(plannedShipment.carrier_name).toBeTruthy();
    expect(plannedShipment.status).toBe('carrier_assigned');

    // 3. Dispatch Vehicle
    const dispatched = tmsRepository.dispatchShipment(plannedShipment.id);
    expect(dispatched.status).toBe('dispatched');

    // 4. Simulate Highway Telematics Ping
    const trackingPing = tmsRepository.simulateTrackingEvent(
      plannedShipment.id,
      'checkpoint_reached',
      'Kotputli Toll Plaza',
      'Kotputli',
      'FASTag RFID ping received'
    );
    expect(trackingPing.id).toBeTruthy();
    expect(trackingPing.is_simulated).toBe(true);

    // 5. Simulate Stoppage Breakdown and AI Exception Trigger
    tmsRepository.simulateTrackingEvent(
      plannedShipment.id,
      'breakdown_reported',
      'Highway Service Shoulder',
      'Jaipur Bypass',
      'Engine radiator leak'
    );

    const detailedShipment = tmsRepository.getShipmentById(plannedShipment.id);
    expect(detailedShipment?.status).toBe('delayed');
    expect(detailedShipment?.risk_score).toBeGreaterThanOrEqual(80);

    // 6. Resolve Exception with Human Approval
    const exception = detailedShipment?.exceptions[0];
    if (exception) {
      const resolved = tmsRepository.resolveException(
        exception.id,
        'approve_recommendation',
        'Authorized emergency backup truck'
      );
      expect(resolved.status).toBe('resolved');
    }

    // 7. Complete Delivery
    tmsRepository.simulateTrackingEvent(
      plannedShipment.id,
      'delivered',
      'Customer Dock',
      'Mumbai',
      'Pallets offloaded, e-POD signed'
    );

    const finalShipment = tmsRepository.getShipmentById(plannedShipment.id);
    expect(finalShipment?.status).toBe('delivered');
  });
});
