# AI Architecture, Safeguards & Fallback Logic — TransitIQ TMS

**Document Version:** 1.0.0  
**AI Philosophy:** Explainable, Factual, Human-in-the-Loop Operations  

---

## 1. Core Principles of AI in TransitIQ

1. **Grounded In Reality:** The AI never fabricates shipment locations, telematics pings, or carrier rates. All insights originate from verified PostgreSQL database records.
2. **Transparent Mathematical Baselines:** Every AI recommendation is underpinned by an explainable algebraic rule engine.
3. **Strict Human Governance:** High-impact changes (carrier reassignment, financial credit notes, emergency transshipment authorizations) can never be executed autonomously by the AI without explicit approval by an authorized role (`operations_manager` or `org_admin`).
4. **Deterministic Fallback:** If external LLM API keys (`OPENAI_API_KEY`, `GEMINI_API_KEY`) are unconfigured, TransitIQ operates without degradation using its internal mathematical rule engine.

---

## 2. AI Exception Recommendation Architecture

```
┌────────────────────────────────────────────────────────┐
│            MULTI-MODAL TELEMETRY INGESTION             │
│  - RFID FASTag Toll Pings   - Driver Voice Logs        │
│  - GPS Geofence Signals     - Milestone Stoppages      │
└────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│         DETERMINISTIC RISK EVALUATION ENGINE           │
│  - Evaluates remaining SLA hours vs corridor transit   │
│  - Checks vehicle status (breakdown, standstill)       │
│  - Calculates Risk Score (0-100) & Severity Level      │
└────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│              LLM ENRICHMENT (CONDITIONAL)              │
│  - Grounded Context: Ingests Shipment ID, Lane, Stats  │
│  - Synthesizes clear problem statement & evidence      │
│  - Suggests targeted corrective action & confidence    │
└────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│          HUMAN-IN-THE-LOOP APPROVAL GATEWAY            │
│  - Operations Manager reviews recommended action       │
│  - Click 'Approve & Execute' or 'Reject Guidance'      │
│  - Database mutation commits + Audit log created       │
└────────────────────────────────────────────────────────┘
```

---

## 3. Operations Copilot Architecture

The AI Copilot does not possess unrestricted database access or direct SQL execution capabilities. It interacts exclusively through a curated set of server-side data functions:
- `getShipmentsAtRisk()`
- `getBottomCarriers()`
- `getTotalFreightSpend()`
- `getMissingPodConsignments()`

Responses provide clickable entity links (e.g. `TMS-1039`) allowing dispatchers to immediately inspect the live tracking timeline.
