# Database Schema Documentation — TransitIQ TMS

**Database Engine:** PostgreSQL 16 (Supabase)  
**Security Model:** Row Level Security (RLS) on all tenant-owned tables  
**Schema Migration:** `supabase/migrations/20261116000001_transitiq_schema.sql`  

---

## 1. Entity-Relationship Overview

TransitIQ models the full lifecycle of Indian freight transportation through 20 relational tables:

```
[organisations]
       ▲
       │ 1:N
[profiles] ◄─── [organisation_members]
       ▲
       │
[facilities] ◄──────┐
                    │ 1:N
[customers]  ◄──────┼── [transportation_orders]
                    │           │ 1:N
[carriers]   ◄──────┼── [shipments] ───► [shipment_stops]
  │                 │       │
  │ 1:N             │       ├───► [tracking_events]
[vehicles] ─────────┘       ├───► [shipment_exceptions]
                            ├───► [carrier_quotes]
                            ├───► [freight_invoices] ───► [freight_invoice_items]
                            └───► [freight_documents]

[approvals] ───► References entity_id (Shipment / Carrier / Invoice)
[activity_logs] ───► Immutable audit log for operational actions
[product_events] ───► Product adoption and feature tracking
```

---

## 2. Table Specifications

### 2.1 organisations
Represents the tenant company (e.g., Apex Distribution India Pvt Ltd).
- `id` (UUID, Primary Key, default `gen_random_uuid()`)
- `name` (TEXT, NOT NULL)
- `slug` (TEXT, UNIQUE, NOT NULL)
- `code` (TEXT, UNIQUE, NOT NULL)
- `gst_number` (TEXT, Indian GSTIN)
- `created_at` (TIMESTAMPTZ, default `NOW()`)

### 2.2 profiles
User profile linked to Supabase `auth.users`.
- `id` (UUID, Primary Key, references `auth.users(id)` ON DELETE CASCADE)
- `email` (TEXT, UNIQUE, NOT NULL)
- `full_name` (TEXT, NOT NULL)
- `phone` (TEXT)
- `avatar_url` (TEXT)
- `default_role` (TEXT, default `'dispatcher'`)
- `created_at` (TIMESTAMPTZ)

### 2.3 organisation_members
Maps users to organizations with specific RBAC roles.
- `id` (UUID, Primary Key)
- `organisation_id` (UUID, references `organisations(id)`)
- `user_id` (UUID, references `profiles(id)`)
- `role` (TEXT: `'org_admin'`, `'operations_manager'`, `'dispatcher'`, `'finance_manager'`, `'carrier_user'`)
- `status` (TEXT: `'active'`, `'suspended'`)
- `UNIQUE(organisation_id, user_id)`

### 2.4 customers
Enterprise shipping clients.
- `id` (UUID, Primary Key)
- `organisation_id` (UUID)
- `name` (TEXT, NOT NULL)
- `code` (TEXT, NOT NULL)
- `contact_person`, `email`, `phone`, `address`, `city`, `state`, `pin_code`
- `credit_limit_inr` (NUMERIC(14,2))

### 2.5 facilities
Warehouses, cross-docks, and distribution centers.
- `id` (UUID, Primary Key)
- `organisation_id` (UUID)
- `name`, `code`, `facility_type` (`'hub'`, `'warehouse'`, `'distribution_center'`, `'cross_dock'`)
- `latitude`, `longitude` (DOUBLE PRECISION)
- `address`, `city`, `state`, `pin_code`, `contact_name`, `contact_phone`

### 2.6 carriers
Contracted road transport providers.
- `id` (UUID, Primary Key)
- `organisation_id` (UUID)
- `name`, `code`, `contact_person`, `email`, `phone`
- `rating` (NUMERIC(3,2), 1.0 to 5.0)
- `on_time_percentage` (NUMERIC(5,2), 0 to 100)
- `avg_delay_hours` (NUMERIC(5,2))
- `cancellation_rate` (NUMERIC(5,2))
- `damage_incident_rate` (NUMERIC(5,2))
- `total_shipments_completed` (INT)
- `base_rate_per_km_inr` (NUMERIC(10,2))
- `is_active` (BOOLEAN)

### 2.7 vehicles
Commercial freight trucks.
- `id` (UUID, Primary Key)
- `organisation_id` (UUID)
- `carrier_id` (UUID, references `carriers(id)`)
- `registration_number` (TEXT, e.g. `'HR 55 AN 1824'`)
- `vehicle_type` (`'Tata Ace'`, `'14ft Eicher'`, `'19ft Container'`, `'32ft Multi-Axle'`, `'40ft Trailer'`)
- `max_weight_kg`, `max_volume_cbm`
- `driver_name`, `driver_phone`
- `current_status` (`'available'`, `'in_transit'`, `'maintenance'`, `'offline'`)

### 2.8 transport_lanes
Key freight corridors across India.
- `id` (UUID, Primary Key)
- `organisation_id` (UUID)
- `origin_city`, `destination_city`
- `distance_km` (NUMERIC(10,2))
- `transit_time_hours` (NUMERIC(6,2))
- `standard_rate_inr` (NUMERIC(12,2))
- `toll_estimate_inr` (NUMERIC(10,2))
- `difficulty_rating` (INT, 1-5)

### 2.9 transportation_orders
Consignment transport demand.
- `id` (UUID, Primary Key)
- `organisation_id` (UUID)
- `customer_id` (UUID, references `customers(id)`)
- `order_number` (TEXT, UNIQUE within org)
- `origin_facility_id`, `destination_facility_id`
- `cargo_description`, `cargo_category`, `cargo_weight_kg`, `cargo_volume_cbm`
- `required_vehicle_type`
- `pickup_deadline`, `delivery_deadline`
- `status` (`'draft'`, `'confirmed'`, `'planned'`, `'in_transit'`, `'delivered'`, `'cancelled'`)
- `shipment_id` (UUID, references `shipments(id)`)

### 2.10 shipments
Consolidated freight movements.
- `id` (UUID, Primary Key)
- `organisation_id` (UUID)
- `shipment_number` (TEXT, UNIQUE within org)
- `order_ids` (UUID[])
- `carrier_id`, `vehicle_id`
- `origin_city`, `destination_city`
- `scheduled_pickup_at`, `actual_pickup_at`
- `estimated_delivery_at`, `actual_delivery_at`
- `total_weight_kg`, `total_volume_cbm`
- `agreed_freight_rate_inr`
- `status` (`'created'`, `'planned'`, `'carrier_assigned'`, `'dispatched'`, `'in_transit'`, `'at_risk'`, `'delayed'`, `'delivered'`, `'cancelled'`)
- `risk_score` (INT, 0-100)
- `risk_level` (`'low'`, `'medium'`, `'high'`, `'critical'`)
- `dispatcher_id`, `tracking_number`

### 2.11 tracking_events
Telematics milestones and simulation logs.
- `id` (UUID, Primary Key)
- `organisation_id` (UUID)
- `shipment_id` (UUID, references `shipments(id)`)
- `event_type` (`'order_created'`, `'vehicle_assigned'`, `'departed_origin'`, `'checkpoint_reached'`, `'in_transit_update'`, `'arrived_destination_hub'`, `'out_for_delivery'`, `'delivered'`, `'delay_reported'`, `'breakdown_reported'`, `'route_deviation'`)
- `location_name`, `city`, `latitude`, `longitude`
- `event_timestamp`, `description`, `is_simulated` (BOOLEAN)

### 2.12 shipment_exceptions
Identified risks and AI prescriptions.
- `id` (UUID, Primary Key)
- `organisation_id` (UUID)
- `shipment_id` (UUID, references `shipments(id)`)
- `exception_type` (`'vehicle_breakdown'`, `'delayed_pickup'`, `'missed_checkpoint'`, `'route_deviation'`, `'capacity_issue'`, `'delivery_rejection'`, `'missing_pod'`, `'invoice_mismatch'`)
- `severity` (`'low'`, `'medium'`, `'high'`, `'critical'`)
- `title`, `description`
- `evidence_data` (JSONB)
- `status` (`'open'`, `'investigating'`, `'action_recommended'`, `'resolved'`, `'closed'`)
- `recommended_action_type`
- `ai_recommendation` (JSONB)
- `resolution_notes`, `resolved_at`, `resolved_by`

### 2.13 freight_invoices & 2.14 freight_invoice_items
Carrier billing and rate reconciliation.
- `id` (UUID, Primary Key)
- `organisation_id` (UUID)
- `shipment_id`, `carrier_id`
- `invoice_number`, `invoice_date`, `due_date`
- `expected_amount_inr`, `billed_amount_inr`, `variance_amount_inr`, `variance_percentage`
- `audit_status` (`'passed'`, `'discrepancy_flagged'`, `'pending_review'`, `'approved'`, `'rejected'`)
- `discrepancy_reason` (`'none'`, `'extra_fuel_surcharge'`, `'incorrect_distance_charge'`, `'duplicate_invoice'`, `'base_rate_mismatch'`, `'detention_unauthorized'`)
- `payment_status` (`'unpaid'`, `'approved_for_payment'`, `'paid'`)

### 2.15 freight_documents
Digital document attachments stored in Supabase Storage (`shipment-documents`).
- `id`, `organisation_id`, `shipment_id`, `document_type`, `file_name`, `file_size_bytes`, `storage_path`, `verified`

### 2.16 approvals, 2.17 activity_logs, 2.18 product_events
Governance, auditability, and usage analytics.
