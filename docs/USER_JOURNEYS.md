# User Journeys — TransitIQ TMS

This document outlines the end-to-end operational workflows connecting demand creation to cash settlement in Indian freight logistics.

---

## 1. Primary Operational Journey (Core E2E Workflow)

```
[Customer Order Placed] 
         │
         ▼
[1. Load Consolidation & Planning] ──> Validates truck payload & CBM volume
         │
         ▼
[2. Intelligent Carrier Procurement] ──> Weighted scoring (Cost, OTP, Safety, Lane)
         │
         ▼
[3. Gate Clearance & Dispatch] ──> Generates outward tracking event
         │
         ▼
[4. Highway In-Transit Telemetry] ──> Simulates FASTag toll pings & checkpoints
         │
         ▼
[5. AI Exception Detection] ──> Standstill / breakdown triggers risk re-score
         │
         ▼
[6. Manager Action Approval] ──> Human approves rescue transshipment vehicle
         │
         ▼
[7. Customer Delivery & e-POD] ──> Signed delivery receipt uploaded to vault
         │
         ▼
[8. 3-Way Freight Invoice Audit] ──> Automated rate reconciliation & payment approval
```

### Detailed Step Walkthrough:
1. **Order Creation:** An order is created by customer "Tata AutoComp Systems Ltd" for 8,500 kg of precision automotive components from Gurgaon Hub to Bhiwandi Warehouse.
2. **Shipment Consolidation:** Priya (Operations Manager) opens the **Shipment Planning** module. The load builder calculates weight utilization (45.9% on a 32ft Multi-Axle) and allows grouping with a second confirmed order heading to Mumbai.
3. **Carrier Scoring:** TransitIQ runs the weighted procurement algorithm across 12 contracted carriers. TCI Freight scores #1 (Score: 92.4/100, Quote: ₹64,000, OTP: 96.4%). Priya confirms allocation.
4. **Dispatch:** Dispatcher Amit initiates outbound clearance. Status updates to `dispatched` with an initial low risk score (12/100).
5. **Highway Tracking & Incident:** En route on NH-48 near Kotputli, Amit uses the **Tracking Simulator** to log a mechanical breakdown event (radiator coolant leakage).
6. **AI Exception Evaluation:** The AI Exception Engine detects stationary delay > 120 mins with 14 hours remaining on the customer delivery SLA. The risk score escalates from 12 to 92 (`critical`). An AI prescription is generated: *Deploy emergency transshipment vehicle from Jaipur hub (Confidence: 94%)*.
7. **Action Approval:** Priya reviews the AI recommendation in the **AI Exception Manager** and clicks *Approve & Execute Action*. The decision is committed to the database, vehicle status updates, and an entry is logged in the immutable audit trail.
8. **Final Delivery & e-POD:** The transshipment vehicle reaches Bhiwandi. Customer scans the barcode, verifies intact pallets, and signs the electronic Proof of Delivery.
9. **Freight Audit:** TCI Freight submits an invoice for ₹64,000. Sunita (Finance Manager) conducts an automated 3-way match in the **Freight Finance** module. The billed amount matches the agreed tender. Sunita marks the invoice as *Audit Passed* for payment disbursement.

---

## 2. Secondary Journey: Carrier Procurement Override & Audit Governance

1. Operations Manager initiates carrier procurement for a sensitive pharmaceutical consignment.
2. The AI algorithm recommends *Delhivery Surface Freight* based on lowest quote.
3. The customer contract explicitly requires dedicated reefer temperature monitoring, which *Blue Dart Surface* possesses.
4. Priya selects Blue Dart (Quote: ₹52,000 vs lowest ₹41,500) and inputs a mandatory audit justification: *"Mandatory customer SLA requires cold chain telematics certification."*
5. The system logs a formal `carrier_override` record in the Approvals Queue for the Org Admin's review.

---

## 3. Secondary Journey: Freight Discrepancy & Credit Dispute

1. Carrier *Om Logistics* submits an invoice billing ₹72,500 for a Delhi-Lucknow trip contracted at ₹66,000.
2. The automated audit detects a variance of +₹6,500 (+9.8%) categorized as `extra_fuel_surcharge`.
3. Sunita (Finance Manager) reviews the contract clause: diesel price escalation only triggers on monthly price deltas exceeding 5%.
4. Sunita clicks *Reject with Debit Note Requirement*. The system marks the invoice as `rejected` and records the dispute reason.
