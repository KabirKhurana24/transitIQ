import { describe, it, expect } from 'vitest';
import { calculateShipmentRisk } from '@/lib/ai/exception-engine';
import { Shipment, TrackingEvent } from '@/types/tms';

describe('AI Exception Risk Scoring Engine', () => {
  const baseShipment: Shipment = {
    id: 'shp-test-01',
    organisation_id: 'org-apex-001',
    shipment_number: 'TMS-TEST',
    order_ids: ['ord-1'],
    origin_facility_id: 'fac-1',
    origin_city: 'Gurgaon',
    destination_facility_id: 'fac-2',
    destination_city: 'Mumbai',
    scheduled_pickup_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    estimated_delivery_at: new Date(Date.now() + 24 * 3600000).toISOString(),
    total_weight_kg: 8000,
    total_volume_cbm: 30,
    agreed_freight_rate_inr: 64000,
    status: 'in_transit',
    risk_score: 15,
    risk_level: 'low',
    tracking_number: 'TRK-TEST',
    created_at: new Date().toISOString(),
  };

  it('assigns low risk score to nominal in-transit shipment', () => {
    const risk = calculateShipmentRisk(baseShipment, [], 96);
    expect(risk.riskScore).toBeLessThan(35);
    expect(risk.riskLevel).toBe('low');
  });

  it('escalates to critical risk when mechanical breakdown event is detected', () => {
    const breakdownEvent: TrackingEvent = {
      id: 'trk-test-breakdown',
      organisation_id: 'org-apex-001',
      shipment_id: baseShipment.id,
      event_type: 'breakdown_reported',
      location_name: 'NH-48 KM 180',
      city: 'Kotputli',
      event_timestamp: new Date().toISOString(),
      description: 'Radiator coolant pipe burst; engine overheating',
      is_simulated: true,
      created_at: new Date().toISOString(),
    };

    const delayedShipment: Shipment = {
      ...baseShipment,
      status: 'delayed',
    };

    const risk = calculateShipmentRisk(delayedShipment, [breakdownEvent], 90);
    expect(risk.riskScore).toBeGreaterThanOrEqual(80);
    expect(risk.riskLevel).toBe('critical');
    expect(risk.suggestedAction.actionType).toBe('reassign_carrier');
    expect(risk.suggestedAction.requiresApproval).toBe(true);
    expect(risk.suggestedAction.confidenceLevel).toBeGreaterThan(0.9);
  });
});
