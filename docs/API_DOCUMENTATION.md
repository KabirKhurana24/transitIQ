# API & Service Documentation — TransitIQ TMS

**Document Version:** 1.0.0  
**Pattern:** Next.js Server Actions & Facade Service Interface (`tmsRepository`)  

---

## 1. Authentication Endpoints & Patterns

TransitIQ utilizes official Supabase Next.js SSR authentication (`@supabase/ssr`):

### 1.1 `POST /auth/login`
- **Body:** `{ email: string, password: string }`
- **Response:** Sets authenticated HTTP-only session cookies (`sb-*-auth-token`).
- **Roles:** `org_admin`, `operations_manager`, `dispatcher`, `finance_manager`, `carrier_user`.

### 1.2 `GET /auth/callback`
- **Query:** `?code=<auth-code>&next=/dashboard`
- **Behavior:** Exchanges PKCE code for Supabase JWT session and redirects to protected dashboard.

---

## 2. TMS Service Contracts (`tmsRepository`)

### 2.1 Order Operations
```typescript
getOrders(filters?: { status?: string; search?: string }): TransportationOrder[]
getOrderById(id: string): TransportationOrder | undefined
createOrder(orderData: Omit<TransportationOrder, 'id' | 'created_at' | 'updated_at'>): TransportationOrder
```

### 2.2 Shipment Operations
```typescript
getShipments(filters?: { status?: string; search?: string; carrierId?: string }): Shipment[]
getShipmentById(id: string): (Shipment & { orders; trackingEvents; exceptions; documents }) | undefined
planShipment(data: {
  orderIds: string[];
  carrierId?: string;
  vehicleId?: string;
  scheduledPickup: string;
  estimatedDelivery: string;
  agreedRateInr: number;
}): Shipment
assignCarrier(shipmentId: string, carrierId: string, quoteAmountInr: number, overrideReason?: string): Shipment
dispatchShipment(shipmentId: string): Shipment
```

### 2.3 Carrier Procurement & Scoring
```typescript
getCarrierScoresForShipment(shipmentId: string): CarrierScoreBreakdown[]
calculateCarrierScores(
  carriers: Carrier[],
  lane: TransportLane,
  cargoWeightKg: number,
  cargoVolumeCbm: number,
  requiredVehicleType: string,
  weights: ScoringWeights
): CarrierScoreBreakdown[]
```

### 2.4 Tracking Telemetry Simulator
```typescript
simulateTrackingEvent(
  shipmentId: string,
  eventType: TrackingEventType,
  locationName: string,
  city: string,
  description: string
): TrackingEvent
```
- Emits telemetry pings (`checkpoint_reached`, `delay_reported`, `breakdown_reported`, `delivered`).
- Automatically updates shipment status and invokes `calculateShipmentRisk()`.

### 2.5 AI Exception Management
```typescript
getExceptions(filters?: { status?: string; severity?: string }): ShipmentException[]
resolveException(
  exceptionId: string,
  action: 'approve_recommendation' | 'reject_recommendation' | 'manual_resolve',
  notes: string,
  userName?: string
): ShipmentException
```

### 2.6 Freight Invoice Audit
```typescript
getInvoices(filters?: { auditStatus?: string; search?: string }): FreightInvoice[]
reconcileInvoice(
  invoiceId: string,
  decision: 'passed' | 'approved' | 'rejected' | 'discrepancy_flagged',
  notes?: string
): FreightInvoice
```

### 2.7 AI Copilot Controlled Query
```typescript
answerCopilotQuery(query: string): {
  answer: string;
  supportingShipmentIds: string[];
  dataPoints: Record<string, any>;
  suggestedFollowups: string[];
}
```
