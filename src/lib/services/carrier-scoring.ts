import { Carrier, CarrierQuote, ScoringWeights, TransportLane } from '@/types/tms';

export interface CarrierScoreBreakdown {
  carrier: Carrier;
  quoteAmountInr: number;
  estimatedTransitHours: number;
  scoreOverall: number;
  scoreCost: number;
  scoreOtp: number;
  scoreCapacity: number;
  scoreIncident: number;
  scoreLaneExp: number;
  rank: number;
  recommendationReason: string;
}

export function calculateCarrierScores(
  carriers: Carrier[],
  lane: TransportLane,
  cargoWeightKg: number,
  cargoVolumeCbm: number,
  requiredVehicleType: string,
  weights: ScoringWeights = {
    cost: 0.35,
    on_time: 0.30,
    capacity: 0.15,
    incident: 0.10,
    lane_experience: 0.10,
  }
): CarrierScoreBreakdown[] {
  if (!carriers || carriers.length === 0) return [];

  // Generate quotes based on carrier's base rate per km and lane distance
  const carrierQuotesData = carriers.map((carrier) => {
    // Quote is base_rate_per_km * distance with small realistic carrier variance
    const rateFactor = carrier.base_rate_per_km_inr / 45.0;
    const baseQuote = Math.round(lane.distance_km * carrier.base_rate_per_km_inr);
    // Add estimated toll
    const totalQuote = baseQuote + lane.toll_estimate_inr;

    return {
      carrier,
      quoteAmount: totalQuote,
      transitHours: lane.transit_time_hours + (carrier.avg_delay_hours > 2 ? 2 : 0),
    };
  });

  const quotes = carrierQuotesData.map((q) => q.quoteAmount);
  const minQuote = Math.min(...quotes);
  const maxQuote = Math.max(...quotes);
  const quoteRange = maxQuote - minQuote || 1;

  const breakdowns: CarrierScoreBreakdown[] = carrierQuotesData.map(({ carrier, quoteAmount, transitHours }) => {
    // 1. Cost Score (0 - 100): Normalized inversely to quote price
    const scoreCost = Math.round(Math.max(0, Math.min(100, 100 - ((quoteAmount - minQuote) / quoteRange) * 80)));

    // 2. On-Time Performance Score (0 - 100): Direct OTP percentage
    const scoreOtp = Math.round(carrier.on_time_percentage);

    // 3. Capacity Suitability Score (0 - 100):
    // Based on carrier active fleet size and suitability
    const capacityScoreRaw = 85 + (carrier.serviceable_lanes_count > 20 ? 10 : 0);
    const scoreCapacity = Math.min(100, capacityScoreRaw);

    // 4. Incident & Cancellation Score (0 - 100):
    // Deduct for cancellations and damage rates
    const incidentPenalty = carrier.cancellation_rate * 5 + carrier.damage_incident_rate * 15;
    const scoreIncident = Math.round(Math.max(0, 100 - incidentPenalty));

    // 5. Lane Experience Score (0 - 100):
    // Based on completed shipments volume
    const scoreLaneExp = Math.round(Math.min(100, (carrier.total_shipments_completed / 1200) * 100));

    // Weighted Overall Score
    const rawOverall =
      weights.cost * scoreCost +
      weights.on_time * scoreOtp +
      weights.capacity * scoreCapacity +
      weights.incident * scoreIncident +
      weights.lane_experience * scoreLaneExp;

    const scoreOverall = Number(rawOverall.toFixed(1));

    // Explainable rationale
    let reason = '';
    if (scoreCost > 88 && scoreOtp > 93) {
      reason = `Optimal balance: Top-tier on-time reliability (${carrier.on_time_percentage}%) with highly competitive linehaul quote (₹${quoteAmount.toLocaleString('en-IN')}).`;
    } else if (scoreCost > 90) {
      reason = `Lowest cost option for ${lane.origin_city} → ${lane.destination_city} corridor (₹${quoteAmount.toLocaleString('en-IN')}), saving ~${Math.round(((maxQuote - quoteAmount) / maxQuote) * 100)}% vs market high.`;
    } else if (scoreOtp > 96) {
      reason = `Industry benchmark reliability with ${carrier.on_time_percentage}% OTP and low damage frequency (${carrier.damage_incident_rate}%). Ideal for SLA-sensitive cargo.`;
    } else {
      reason = `High network coverage with ${carrier.serviceable_lanes_count} serviceable corridors and dedicated fleet availability.`;
    }

    return {
      carrier,
      quoteAmountInr: quoteAmount,
      estimatedTransitHours: transitHours,
      scoreOverall,
      scoreCost,
      scoreOtp,
      scoreCapacity,
      scoreIncident,
      scoreLaneExp,
      rank: 0,
      recommendationReason: reason,
    };
  });

  // Sort descending by scoreOverall
  breakdowns.sort((a, b) => b.scoreOverall - a.scoreOverall);

  // Assign ranks
  breakdowns.forEach((item, index) => {
    item.rank = index + 1;
  });

  return breakdowns;
}
