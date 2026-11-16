# Test Plan & Verification Strategy — TransitIQ TMS

**Document Version:** 1.0.0  
**Testing Frameworks:** Vitest (Unit & Integration), Playwright (End-to-End)  

---

## 1. Test Scope & Coverage Objectives

| Test Suite | Purpose | Target Coverage |
| :--- | :--- | :--- |
| **Unit & Calculation Tests** | Verify carrier scoring weights, risk scoring, capacity limits, and invoice reconciliation | 95%+ of core calculations |
| **RBAC & Security Tests** | Validate role-based permission gates and multi-tenant RLS functions | 100% of defined permissions |
| **Integration Tests** | Validate service operations (`tmsRepository`) state mutations | All CRUD and workflow methods |
| **Playwright E2E Tests** | Test the complete operational lifecycle from Order to Cash | Complete golden path |

---

## 2. Main Operational Journey E2E Test Flow

The golden path end-to-end test executes the following sequence:
1. **Login:** Authenticate via Supabase as Operations Manager (`ops@apexdist.in`).
2. **Order Intake:** Create a new transportation order (8,500 kg, Gurgaon to Mumbai).
3. **Planning & Consolidation:** Open Shipment Planner, select order, allocate vehicle, verify capacity.
4. **Carrier Procurement:** Run carrier scoring, verify top recommended carrier, and assign load.
5. **Dispatch:** Dispatch vehicle and verify status change to `dispatched`.
6. **Telemetry Simulation:** Open Tracking Simulator and trigger a checkpoint event and breakdown event.
7. **Exception Detection:** Verify risk score jumps to `critical` and an exception is logged.
8. **AI Prescription & Approval:** Approve the AI transshipment action; verify risk score drops.
9. **Delivery Sign-Off:** Simulate `delivered` event; verify status updates to `delivered`.
10. **Invoice Reconciliation:** Verify invoice is generated and can be cleared by finance.
