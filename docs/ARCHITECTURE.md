# System Architecture — TransitIQ TMS

**Document Version:** 1.0.0  
**Stack:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Supabase PostgreSQL, Supabase Auth, Supabase Storage, Recharts  

---

## 1. High-Level Architectural Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER                            │
│           Next.js 16 App Router (React Server & Client Components)      │
│  Control Tower │ Orders │ Planning │ Carriers │ Exceptions │ Copilot   │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         BUSINESS LOGIC LAYER                           │
│  ┌────────────────────────┐  ┌───────────────────────┐  ┌───────────┐  │
│  │ Carrier Scoring Engine │  │ AI Exception Engine   │  │ 3-Way     │  │
│  │ (Weighted Multi-Factor)│  │ (Rules + LLM Fallback)│  │ Reconcile │  │
│  └────────────────────────┘  └───────────────────────┘  └───────────┘  │
│                 TMS Repository Service (Facade Pattern)                │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         DATA & SECURITY LAYER                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Supabase Auth (SSR Cookie Session Management, JWT Verification)   │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ PostgreSQL 16 (20 Tenant-Owned Tables Protected by Row Level RLS)│  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ Supabase Storage (Private Bucket: shipment-documents)            │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Layer Separation & Design Principles

### 2.1 Presentation Layer
- **Component Isolation:** Presentation components are strictly decoupled from raw database queries.
- **Server vs Client Components:** Heavy aggregations, initial page shells, and security headers render on the server; interactive controls (sliders, simulators, filters, Recharts) execute as optimized client components (`'use client'`).
- **Responsive Navigation:** Collapsible dark navy sidebar with role switcher, dynamic status badges, and global modal triggers.

### 2.2 Business Logic & Service Facade Layer
- **Repository Pattern (`tmsRepository`):** Provides a single, strongly-typed interface for querying and mutating entities.
- **Unified Local & Cloud State:** Operates identically whether connecting to live Supabase PostgreSQL or running in deterministic simulated mode.
- **Explainable Mathematics:** All carrier recommendation scores and risk indexes use deterministic algebraic functions before invoking generative LLM extensions.

### 2.3 Data Access & Multi-Tenant Security
- **Multi-Tenant Row Level Security (RLS):** Every tenant table (`shipments`, `transportation_orders`, `carriers`, `facilities`, etc.) contains an `organisation_id` column.
- **Non-Recursive RLS Functions:** Uses `public.get_user_organisation_ids()` with `SECURITY DEFINER` to verify organization membership without triggering infinite PostgreSQL recursion loops.
- **Service-Role Key Isolation:** The elevated `SUPABASE_SERVICE_ROLE_KEY` is strictly confined to server-side scripts and never exposed to the client bundle.

---

## 3. Technology Stack Justification

| Technology | Purpose | Justification |
| :--- | :--- | :--- |
| **Next.js App Router** | Fullstack Web Framework | Server Components provide fast initial paint; server actions and route handlers enable secure data access. |
| **TypeScript** | Type Safety | Enforces strict data models across all 20 database tables, preventing runtime data contract violations. |
| **Tailwind CSS & shadcn/ui** | Design System | Enables compact, high-density enterprise layouts with custom dark navy palettes and accessible controls. |
| **Supabase PostgreSQL** | Relational Database | Native JSONB support for telematics evidence, rock-solid foreign keys, and performant Row Level Security. |
| **Supabase Storage** | Document Vault | Private bucket with signed URLs for confidential logistics documents (e-way bills, freight invoices). |
| **Recharts** | Data Visualization | Declarative, SVG-based charting for operational metrics, area charts, and OTIF trends. |
| **Zod & React Hook Form** | Form Validation | Strongly typed schema validation preventing invalid payload submissions. |
