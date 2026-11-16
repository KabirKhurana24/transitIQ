# Product Requirements Document (PRD) — TransitIQ TMS

**Document Version:** 1.0.0  
**Author:** Principal Product Manager & Enterprise Solutions Architect  
**Status:** Approved for Implementation  
**Target Market:** Indian Logistics Service Providers (LSPs), 3PLs, Manufacturers, and National Distributors  

---

## 1. Executive Summary & Vision

### 1.1 The Industry Problem
Transportation operations in India account for approximately 13-14% of national GDP (compared to 8% in developed economies). Logistics managers face fragmented carrier networks, lack of visibility across the Golden Quadrilateral, unstandardized highway checkpoints, delayed Proof of Delivery (POD) cycles, and unpredictable freight invoice disputes. Most legacy systems are **reactive tracking dashboards** that merely display delayed status after a disruption has already occurred.

### 1.2 The TransitIQ Vision
**TransitIQ** transforms transportation operations from **reactive shipment tracking** to **proactive, AI-assisted operations**. By unifying order intake, dynamic load consolidation, multi-attribute carrier scoring, live telematics telemetry, autonomous risk scoring, automated exception resolution, and 3-way freight audit into an interconnected SaaS platform, TransitIQ empowers shippers to preempt delivery breaches before they occur.

---

## 2. Target Personas & Market Segment

TransitIQ is built for Indian enterprise logistics ecosystems:
- **Shippers / Manufacturers:** Auto-OEMs, consumer durables, FMCG, and pharmaceuticals moving high-value freight across national corridors.
- **Third-Party Logistics (3PLs):** Managing multi-client warehouses, linehaul fleets, and outsourced road transporters.
- **Dedicated Road Carriers & Fleet Owners:** Submitting bids, logging checkpoint FASTag pings, and reconciling freight invoices.

### Core User Roles
1. **Organisation Admin (VP / Head of Supply Chain):** Oversees overall operational expenditure, carrier tender SLAs, org settings, and executive approval escalations.
2. **Operations Manager:** Manages load consolidation, capacity compliance, carrier allocation overrides, and approves AI exception mitigation plans.
3. **Senior Dispatcher:** Monitors real-time highway telematics, simulates road checkpoint pings, handles breakdowns, and communicates with drivers.
4. **Finance Manager / Freight Auditor:** Audits carrier invoices against agreed rate cards, flags unauthorized diesel/detention surcharges, and clears reconciled disbursements.
5. **Carrier User (Transporter Partner):** Views assigned loads, confirms vehicle registration, and uploads verified Proof of Delivery (POD) documents.

---

## 3. Scope & Interconnected Workflows

TransitIQ links 10 core operational modules into a continuous feedback loop:

```
[Order Intake] ──> [Shipment Planning & Load Builder] ──> [Carrier Procurement Scoring]
                                                                    │
                                                                    ▼
[3-Way Freight Audit] <── [POD Upload] <── [AI Exception Manager] <── [Dispatch & Telemetry]
         │
         ▼
[Operations Analytics & Copilot]
```

Every action in one module propagates downstream:
- Dispatching a shipment updates vehicle availability and triggers outward tracking events.
- Simulating a mechanical breakdown immediately creates an AI exception, recalculates shipment risk score from 15 to 92, and alerts the Operations Manager with a rescue recommendation.
- Approving an AI recommendation updates the shipment state and logs an immutable entry in the audit trail.
- Reconciling an invoice updates freight expenditure KPIs on the Control Tower dashboard.

---

## 4. Key Functional Modules

### 4.1 Transportation Control Tower
- Executive summary metrics: Total Shipments, Active Fleet, Delivered, At-Risk, Delayed, On-Time Delivery Rate (OTIF %), and Freight Spend (INR).
- Recharts visualizations: Spend trends, lifecycle distribution, and daily dispatch counts.
- Live carrier reliability leaderboard and priority exception alerts.

### 4.2 Order Management
- Order creation with cargo specifications (weight in kg, volume in CBM, commodity category, handling constraints).
- Facility selection across top Indian hubs (Gurgaon, Bhiwandi, Hosakote, Sriperumbudur, Shamshabad, Sanand, Dankuni, Chakan).
- Status lifecycle: Confirmed, Planned, In Transit, Delivered, Cancelled.

### 4.3 Shipment Planning & Load Builder
- Multi-order consolidation into unified truckloads.
- Vehicle payload validation against Motor Vehicles Act axle limits (Tata Ace, 14ft Eicher, 19ft Container, 32ft Multi-Axle, 40ft Trailer).
- Visual warning when payload or volumetric capacity is exceeded.

### 4.4 Intelligent Carrier Procurement Engine
- Multi-factor weighted scoring algorithm:
  - Linehaul Freight Cost: 35%
  - On-Time Performance (OTP): 30%
  - Vehicle & Fleet Suitability: 15%
  - Incident & Cancellation History: 10%
  - Regional Lane Experience: 10%
- Fully transparent and configurable weights.
- Mandatory audit reason logging on manual carrier overrides.

### 4.5 Shipment Tracking & Simulator
- Highway checkpoint timeline with automated FASTag RFID toll pings.
- Dispatcher telematics simulator to trigger departures, congestion halts, engine radiator breakdowns, hub gate arrivals, and customer sign-offs.

### 4.6 AI Exception Manager (Signature Feature)
- Autonomous risk engine evaluating missed checkpoints, standstill duration, remaining SLA buffer, and carrier delay history.
- Produces explainable 0-100 risk score and level (Low, Medium, High, Critical).
- AI prescribed actions with confidence levels, expected business outcomes, and human-in-the-loop approval gates.
- Dual-mode architecture: Generative LLM enrichment when API key is set; deterministic mathematical engine when offline.

### 4.7 AI Operations Copilot
- Natural language query assistant grounded in database records.
- Generates precise citations linking to active shipment numbers (e.g., TMS-1039).
- Controlled server queries preventing unrestricted SQL exposure.

### 4.8 Freight Audit & Finance
- Automated 3-way match: Billed Invoice vs Contracted Rate Card vs Verified POD.
- Flags unapproved fuel surcharges, unauthorized detention, incorrect distance, and duplicate invoices.

### 4.9 Document Center & Storage Vault
- Secure storage bucket: `shipment-documents`.
- Digital audit verification for e-Way Bills, Lorry Receipts, and signed PODs.

### 4.10 Product & Operational Analytics
- OTIF %, Cost per KM, Carrier Reliability Trends, and Lane Volumes.
- One-click CSV export and comprehensive KPI glossary.

---

## 5. Non-Functional & Security Requirements

1. **Multi-Tenancy & Data Isolation:** PostgreSQL Row Level Security (RLS) on all 20 tenant-owned tables. Zero cross-organization data leakage.
2. **Deterministic Seed Data:** 80 orders, 70 shipments, 12 carriers, 15 vehicles, 30 lanes, 25 customers, 8 facilities, 150+ tracking events, and 20 exceptions dynamically anchored relative to `new Date()`.
3. **Simulated Environment Transparency:** All demo data, telematics pings, and carrier documents are clearly labelled as simulated.
4. **Performance:** Sub-100ms response times on local state transitions and sub-1s load times on Control Tower charts.
