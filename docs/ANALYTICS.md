# Analytics & KPI Definitions — TransitIQ TMS

**Document Version:** 1.0.0  
**Purpose:** Standardize mathematical definitions and operational benchmarks for transportation metrics.

---

## 1. Key Performance Indicator (KPI) Dictionary

### 1.1 On-Time In-Full (OTIF) Delivery Rate
- **Definition:** The percentage of orders delivered on or before the committed delivery deadline without damaged pallets or shortages.
- **Formula:**
  $$\text{OTIF \%} = \left(\frac{\text{Orders Delivered On-Time with Verified POD}}{\text{Total Completed Orders}}\right) \times 100$$
- **Target:** $\ge 95.0\%$

### 1.2 Freight Cost Per Kilometre (₹/KM)
- **Definition:** The total linehaul freight expenditure incurred per road kilometre across active transport lanes.
- **Formula:**
  $$\text{Cost Per KM} = \frac{\sum \text{Agreed Freight Rates (INR)}}{\sum \text{Lane Distances (KM)}}$$
- **Industry Benchmark:** ₹42 - ₹48 / km for 32ft Multi-Axle vehicles in India.

### 1.3 Exception Resolution Duration
- **Definition:** Mean elapsed time between an AI exception detection (e.g. breakdown, route departure) and formal manager resolution.
- **Formula:**
  $$\text{Resolution Hours} = \frac{\sum (\text{Resolved Timestamp} - \text{Created Timestamp})}{\text{Total Resolved Exceptions}}$$
- **Target:** $< 3.0 \text{ hours}$

### 1.4 Freight Invoice Discrepancy Rate
- **Definition:** Proportion of carrier invoices where billed charges diverge from contracted rate card agreements.
- **Formula:**
  $$\text{Discrepancy Rate \%} = \left(\frac{\text{Invoices Flagged with Variance}}{\text{Total Billed Invoices}}\right) \times 100$$
- **Target:** $< 10.0\%$ (Current demo: 15.0%)
