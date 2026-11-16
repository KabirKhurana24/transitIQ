# Business Rules & Operational Calculations — TransitIQ TMS

**Document Version:** 1.0.0  
**Context:** Indian Road Freight Logistics & Transport Regulations  

---

## 1. Carrier Procurement Scoring Formula

TransitIQ uses a configurable multi-attribute weighted scoring algorithm. Each carrier receives an overall score $S_{overall} \in [0, 100]$:

$$S_{overall} = W_{cost} \cdot S_{cost} + W_{otp} \cdot S_{otp} + W_{cap} \cdot S_{cap} + W_{inc} \cdot S_{inc} + W_{lane} \cdot S_{lane}$$

Where default weights are:
- $W_{cost} = 0.35$ (35%)
- $W_{otp} = 0.30$ (30%)
- $W_{cap} = 0.15$ (15%)
- $W_{inc} = 0.10$ (10%)
- $W_{lane} = 0.10$ (10%)

### Component Calculations:
1. **Cost Score ($S_{cost}$):**
   $$S_{cost} = \max\left(0, \min\left(100, 100 - \frac{\text{Quote} - \text{MinQuote}}{\text{MaxQuote} - \text{MinQuote} + \epsilon} \times 80\right)\right)$$
2. **On-Time Performance Score ($S_{otp}$):**
   $$S_{otp} = \text{Carrier Historical On-Time Percentage}$$
3. **Capacity Score ($S_{cap}$):**
   Evaluates serviceable corridor density and vehicle category match.
4. **Incident Score ($S_{inc}$):**
   $$S_{inc} = \max\left(0, 100 - (\text{CancellationRate} \times 5 + \text{DamageRate} \times 15)\right)$$
5. **Lane Experience Score ($S_{lane}$):**
   $$S_{lane} = \min\left(100, \frac{\text{TotalShipmentsCompleted}}{1200} \times 100\right)$$

---

## 2. Vehicle Capacity Constraints & Overload Prevention

In accordance with the Indian Motor Vehicles Act and CMVR standards, payloads cannot exceed gross vehicle weight ratings:

| Vehicle Type | Max Gross Payload (kg) | Max Volumetric Capacity (CBM) | Suitable Cargo |
| :--- | :--- | :--- | :--- |
| **Tata Ace** | 1,200 kg | 8 CBM | Intra-city courier, spares |
| **14ft Eicher** | 5,000 kg | 24 CBM | Regional FMCG, pharma |
| **19ft Container** | 9,000 kg | 38 CBM | Electronics, paints |
| **32ft Multi-Axle** | 18,500 kg | 68 CBM | Industrial machinery, tires |
| **40ft Trailer** | 28,000 kg | 95 CBM | Heavy steel, infrastructure |

**Rule:** The Shipment Planner calculates:
$$\text{Weight Utilization} = \frac{\sum \text{Order Weight}}{\text{Vehicle Max Payload}} \times 100\%$$
If utilization exceeds $100\%$, confirmation is blocked and an operational warning is displayed.

---

## 3. Autonomous Risk Scoring & Thresholds

Shipment risk scores range from 0 to 100:
- **Low Risk (0 - 34):** Nominal transit parameters. Automated monitoring.
- **Medium Risk (35 - 59):** Minor route congestion or carrier OTP < 88%.
- **High Risk (60 - 79):** Stoppage > 90 mins outside scheduled rest bays or remaining SLA < 4 hours.
- **Critical Risk (80 - 100):** Vehicle mechanical breakdown, route deviation > 30 km, or missed delivery appointment.

---

## 4. Freight Invoice 3-Way Reconciliation Rules

A freight invoice is automatically validated against three criteria:
1. **Agreed Rate Card:** Linehaul rate must match the contracted tender rate. Variance $\Delta = \text{Billed} - \text{Expected}$. If $\Delta > 0$, flag `base_rate_mismatch` or `extra_fuel_surcharge`.
2. **Approved Route Distance:** Billed distance cannot exceed lane master standard distance by $> 5\%$. If exceeded, flag `incorrect_distance_charge`.
3. **Duplicate Check:** Duplicate invoice numbers within the tenant organization are rejected with flag `duplicate_invoice`.
