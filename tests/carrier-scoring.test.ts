import { describe, it, expect } from 'vitest';
import { calculateCarrierScores } from '@/lib/services/carrier-scoring';
import { DEMO_CARRIERS, DEMO_LANES } from '@/lib/data/mock-data';

describe('Intelligent Carrier Procurement Scoring Engine', () => {
  const lane = DEMO_LANES[0]; // Gurgaon -> Mumbai

  it('calculates weighted composite scores accurately for all carriers', () => {
    const scores = calculateCarrierScores(
      DEMO_CARRIERS,
      lane,
      12000,
      50,
      '32ft Multi-Axle',
      {
        cost: 0.35,
        on_time: 0.30,
        capacity: 0.15,
        incident: 0.10,
        lane_experience: 0.10,
      }
    );

    expect(scores.length).toBe(DEMO_CARRIERS.length);
    expect(scores[0].rank).toBe(1);
    expect(scores[0].scoreOverall).toBeGreaterThanOrEqual(scores[1].scoreOverall);

    // Each carrier has explainable score components
    scores.forEach((s) => {
      expect(s.scoreCost).toBeGreaterThanOrEqual(0);
      expect(s.scoreCost).toBeLessThanOrEqual(100);
      expect(s.scoreOtp).toBeGreaterThanOrEqual(0);
      expect(s.scoreOtp).toBeLessThanOrEqual(100);
      expect(s.quoteAmountInr).toBeGreaterThan(0);
      expect(s.recommendationReason).toBeTruthy();
    });
  });

  it('adapts rankings dynamically when cost weight is shifted to 70%', () => {
    const costDominantScores = calculateCarrierScores(
      DEMO_CARRIERS,
      lane,
      12000,
      50,
      '32ft Multi-Axle',
      {
        cost: 0.70,
        on_time: 0.10,
        capacity: 0.10,
        incident: 0.05,
        lane_experience: 0.05,
      }
    );

    const topCarrier = costDominantScores[0];
    expect(topCarrier.scoreCost).toBeGreaterThanOrEqual(80);
  });
});
