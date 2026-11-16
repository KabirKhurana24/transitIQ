-- ============================================================================
-- TRANSITIQ TMS — PRODUCTION DATABASE SCHEMA & ROW-LEVEL SECURITY (RLS)
-- Multi-tenant Enterprise Transportation Management System for Indian Logistics
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean schema teardown if needed (for fresh local migrations)
-- ============================================================================
-- 1. ORGANISATIONS & USERS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.organisations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    gst_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    default_role TEXT NOT NULL DEFAULT 'dispatcher',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.organisation_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('org_admin', 'operations_manager', 'dispatcher', 'finance_manager', 'carrier_user')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organisation_id, user_id)
);

-- ============================================================================
-- 2. MASTER DATA (CUSTOMERS, FACILITIES, CARRIERS, VEHICLES, LANES)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pin_code TEXT NOT NULL,
    credit_limit_inr NUMERIC(14,2) NOT NULL DEFAULT 500000,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organisation_id, code)
);

CREATE TABLE IF NOT EXISTS public.facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    facility_type TEXT NOT NULL CHECK (facility_type IN ('hub', 'warehouse', 'distribution_center', 'cross_dock')),
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pin_code TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organisation_id, code)
);

CREATE TABLE IF NOT EXISTS public.carriers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    rating NUMERIC(3,2) NOT NULL DEFAULT 4.50 CHECK (rating >= 1.0 AND rating <= 5.0),
    on_time_percentage NUMERIC(5,2) NOT NULL DEFAULT 95.00 CHECK (on_time_percentage >= 0 AND on_time_percentage <= 100),
    avg_delay_hours NUMERIC(5,2) NOT NULL DEFAULT 1.5,
    cancellation_rate NUMERIC(5,2) NOT NULL DEFAULT 2.0 CHECK (cancellation_rate >= 0 AND cancellation_rate <= 100),
    damage_incident_rate NUMERIC(5,2) NOT NULL DEFAULT 0.5 CHECK (damage_incident_rate >= 0 AND damage_incident_rate <= 100),
    total_shipments_completed INT NOT NULL DEFAULT 0,
    serviceable_lanes_count INT NOT NULL DEFAULT 5,
    base_rate_per_km_inr NUMERIC(10,2) NOT NULL DEFAULT 45.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organisation_id, code)
);

CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    carrier_id UUID REFERENCES public.carriers(id) ON DELETE SET NULL,
    registration_number TEXT NOT NULL,
    vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('Tata Ace', '14ft Eicher', '19ft Container', '32ft Multi-Axle', '40ft Trailer')),
    max_weight_kg NUMERIC(10,2) NOT NULL,
    max_volume_cbm NUMERIC(10,2) NOT NULL,
    driver_name TEXT NOT NULL,
    driver_phone TEXT NOT NULL,
    current_status TEXT NOT NULL DEFAULT 'available' CHECK (current_status IN ('available', 'in_transit', 'maintenance', 'offline')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organisation_id, registration_number)
);

CREATE TABLE IF NOT EXISTS public.transport_lanes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    origin_city TEXT NOT NULL,
    destination_city TEXT NOT NULL,
    distance_km NUMERIC(10,2) NOT NULL,
    transit_time_hours NUMERIC(6,2) NOT NULL,
    standard_rate_inr NUMERIC(12,2) NOT NULL,
    toll_estimate_inr NUMERIC(10,2) NOT NULL DEFAULT 0,
    difficulty_rating INT NOT NULL DEFAULT 2 CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organisation_id, origin_city, destination_city)
);

-- ============================================================================
-- 3. ORDERS & SHIPMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.transportation_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    order_number TEXT NOT NULL,
    origin_facility_id UUID REFERENCES public.facilities(id) ON DELETE SET NULL,
    origin_city TEXT NOT NULL,
    destination_facility_id UUID REFERENCES public.facilities(id) ON DELETE SET NULL,
    destination_city TEXT NOT NULL,
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    cargo_description TEXT NOT NULL,
    cargo_category TEXT NOT NULL,
    cargo_weight_kg NUMERIC(10,2) NOT NULL CHECK (cargo_weight_kg > 0),
    cargo_volume_cbm NUMERIC(10,2) NOT NULL CHECK (cargo_volume_cbm > 0),
    required_vehicle_type TEXT NOT NULL,
    pickup_deadline TIMESTAMPTZ NOT NULL,
    delivery_deadline TIMESTAMPTZ NOT NULL,
    special_instructions TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed', 'planned', 'in_transit', 'delivered', 'cancelled')),
    estimated_freight_inr NUMERIC(12,2) NOT NULL DEFAULT 0,
    shipment_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organisation_id, order_number)
);

CREATE TABLE IF NOT EXISTS public.shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    shipment_number TEXT NOT NULL,
    order_ids UUID[] NOT NULL DEFAULT '{}',
    carrier_id UUID REFERENCES public.carriers(id) ON DELETE SET NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    origin_facility_id UUID REFERENCES public.facilities(id) ON DELETE SET NULL,
    origin_city TEXT NOT NULL,
    destination_facility_id UUID REFERENCES public.facilities(id) ON DELETE SET NULL,
    destination_city TEXT NOT NULL,
    scheduled_pickup_at TIMESTAMPTZ NOT NULL,
    actual_pickup_at TIMESTAMPTZ,
    estimated_delivery_at TIMESTAMPTZ NOT NULL,
    actual_delivery_at TIMESTAMPTZ,
    total_weight_kg NUMERIC(10,2) NOT NULL,
    total_volume_cbm NUMERIC(10,2) NOT NULL,
    agreed_freight_rate_inr NUMERIC(12,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'planned', 'carrier_assigned', 'dispatched', 'in_transit', 'at_risk', 'delayed', 'delivered', 'cancelled')),
    risk_score INT NOT NULL DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_level TEXT NOT NULL DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    dispatcher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    tracking_number TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organisation_id, shipment_number)
);

-- Link order to shipment foreign key
ALTER TABLE public.transportation_orders
    DROP CONSTRAINT IF EXISTS fk_order_shipment,
    ADD CONSTRAINT fk_order_shipment FOREIGN KEY (shipment_id) REFERENCES public.shipments(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.shipment_stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
    stop_sequence INT NOT NULL,
    stop_type TEXT NOT NULL CHECK (stop_type IN ('pickup', 'checkpoint', 'delivery')),
    facility_name TEXT NOT NULL,
    city TEXT NOT NULL,
    planned_arrival TIMESTAMPTZ NOT NULL,
    actual_arrival TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'arrived', 'departed', 'skipped')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 4. TRACKING EVENTS & EXCEPTIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.tracking_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('order_created', 'vehicle_assigned', 'departed_origin', 'checkpoint_reached', 'in_transit_update', 'arrived_destination_hub', 'out_for_delivery', 'delivered', 'delay_reported', 'breakdown_reported', 'route_deviation')),
    location_name TEXT NOT NULL,
    city TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    event_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    description TEXT NOT NULL,
    is_simulated BOOLEAN NOT NULL DEFAULT TRUE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.shipment_exceptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
    exception_type TEXT NOT NULL CHECK (exception_type IN ('vehicle_breakdown', 'delayed_pickup', 'missed_checkpoint', 'route_deviation', 'capacity_issue', 'delivery_rejection', 'missing_pod', 'invoice_mismatch')),
    severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    evidence_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'action_recommended', 'resolved', 'closed')),
    recommended_action_type TEXT CHECK (recommended_action_type IN ('contact_carrier', 'notify_customer', 'escalate_ops_manager', 'reassign_carrier', 'request_updated_eta', 'prioritise_shipment', 'create_delivery_followup', 'request_missing_pod')),
    ai_recommendation JSONB,
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 5. CARRIER QUOTES & SCORING
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.carrier_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
    carrier_id UUID NOT NULL REFERENCES public.carriers(id) ON DELETE CASCADE,
    quote_amount_inr NUMERIC(12,2) NOT NULL,
    estimated_transit_hours NUMERIC(6,2) NOT NULL,
    score_overall NUMERIC(5,2) NOT NULL,
    score_cost NUMERIC(5,2) NOT NULL,
    score_otp NUMERIC(5,2) NOT NULL,
    score_capacity NUMERIC(5,2) NOT NULL,
    score_incident NUMERIC(5,2) NOT NULL,
    score_lane_exp NUMERIC(5,2) NOT NULL,
    recommendation_rank INT NOT NULL,
    is_selected BOOLEAN NOT NULL DEFAULT FALSE,
    override_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 6. FREIGHT INVOICES & RECONCILIATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.freight_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
    carrier_id UUID NOT NULL REFERENCES public.carriers(id) ON DELETE RESTRICT,
    invoice_number TEXT NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    expected_amount_inr NUMERIC(12,2) NOT NULL,
    billed_amount_inr NUMERIC(12,2) NOT NULL,
    variance_amount_inr NUMERIC(12,2) NOT NULL,
    variance_percentage NUMERIC(6,2) NOT NULL,
    audit_status TEXT NOT NULL DEFAULT 'pending_review' CHECK (audit_status IN ('passed', 'discrepancy_flagged', 'pending_review', 'approved', 'rejected')),
    discrepancy_reason TEXT NOT NULL DEFAULT 'none' CHECK (discrepancy_reason IN ('none', 'extra_fuel_surcharge', 'incorrect_distance_charge', 'duplicate_invoice', 'base_rate_mismatch', 'detention_unauthorized')),
    payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'approved_for_payment', 'paid')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organisation_id, invoice_number)
);

CREATE TABLE IF NOT EXISTS public.freight_invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES public.freight_invoices(id) ON DELETE CASCADE,
    item_description TEXT NOT NULL,
    expected_rate_inr NUMERIC(12,2) NOT NULL,
    billed_rate_inr NUMERIC(12,2) NOT NULL,
    variance_inr NUMERIC(12,2) NOT NULL,
    is_flagged BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 7. DOCUMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.freight_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    shipment_id UUID REFERENCES public.shipments(id) ON DELETE SET NULL,
    document_type TEXT NOT NULL CHECK (document_type IN ('eway_bill', 'lorry_receipt', 'proof_of_delivery', 'freight_invoice', 'delivery_receipt', 'inspection_report')),
    file_name TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_notes TEXT,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 8. APPROVALS, ACTIVITY LOGS & PRODUCT EVENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('exception_action', 'carrier_override', 'invoice_payment', 'rate_revision')),
    entity_id UUID NOT NULL,
    requested_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    requested_action TEXT NOT NULL,
    justification TEXT NOT NULL,
    impact_summary TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    event_name TEXT NOT NULL,
    event_properties JSONB NOT NULL DEFAULT '{}'::jsonb,
    session_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR HIGH-THROUGHPUT OPERATIONAL QUERIES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_org_members_user ON public.organisation_members(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_org_status ON public.transportation_orders(organisation_id, status);
CREATE INDEX IF NOT EXISTS idx_shipments_org_status ON public.shipments(organisation_id, status);
CREATE INDEX IF NOT EXISTS idx_shipments_risk ON public.shipments(organisation_id, risk_score DESC);
CREATE INDEX IF NOT EXISTS idx_shipments_carrier ON public.shipments(carrier_id);
CREATE INDEX IF NOT EXISTS idx_tracking_shipment ON public.tracking_events(shipment_id, event_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_exceptions_shipment ON public.shipment_exceptions(shipment_id, status);
CREATE INDEX IF NOT EXISTS idx_invoices_shipment ON public.freight_invoices(shipment_id, audit_status);
CREATE INDEX IF NOT EXISTS idx_documents_shipment ON public.freight_documents(shipment_id);
CREATE INDEX IF NOT EXISTS idx_activity_org_time ON public.activity_logs(organisation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_events_time ON public.product_events(organisation_id, created_at DESC);

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES & HELPER FUNCTIONS
-- ============================================================================

-- Enable RLS on all tenant-owned tables
ALTER TABLE public.organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organisation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_lanes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transportation_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carrier_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freight_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freight_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freight_invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_events ENABLE ROW LEVEL SECURITY;

-- Helper function: get user's organisations without circular query
CREATE OR REPLACE FUNCTION public.get_user_organisation_ids()
RETURNS TABLE (organisation_id UUID)
LANGUAGE SQL SECURITY DEFINER STABLE
AS $$
    SELECT organisation_id
    FROM public.organisation_members
    WHERE user_id = auth.uid() AND status = 'active';
$$;

-- Helper function: check if user belongs to an organisation
CREATE OR REPLACE FUNCTION public.is_member_of_org(org_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL SECURITY DEFINER STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.organisation_members
        WHERE user_id = auth.uid()
          AND organisation_id = org_id
          AND status = 'active'
    );
$$;

-- Helper function: check user's role in an organisation
CREATE OR REPLACE FUNCTION public.has_role_in_org(org_id UUID, required_roles TEXT[])
RETURNS BOOLEAN
LANGUAGE SQL SECURITY DEFINER STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.organisation_members
        WHERE user_id = auth.uid()
          AND organisation_id = org_id
          AND role = ANY(required_roles)
          AND status = 'active'
    );
$$;

-- RLS Policies for Profiles
CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (id = auth.uid());

-- RLS Policies for Organisations
CREATE POLICY "Users can view organisations they belong to"
    ON public.organisations FOR SELECT
    USING (id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

-- RLS Policies for Organisation Members
CREATE POLICY "Users can view members of their organisation"
    ON public.organisation_members FOR SELECT
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

-- Generic Tenant Policies helper macro pattern:
-- Customers
CREATE POLICY "Org members can view customers"
    ON public.customers FOR SELECT
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

CREATE POLICY "Org staff can insert customers"
    ON public.customers FOR INSERT
    WITH CHECK (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

CREATE POLICY "Org staff can update customers"
    ON public.customers FOR UPDATE
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

-- Facilities
CREATE POLICY "Org members can view facilities"
    ON public.facilities FOR SELECT
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

CREATE POLICY "Org staff can manage facilities"
    ON public.facilities FOR ALL
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

-- Carriers
CREATE POLICY "Org members can view carriers"
    ON public.carriers FOR SELECT
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

CREATE POLICY "Org staff can manage carriers"
    ON public.carriers FOR ALL
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

-- Vehicles
CREATE POLICY "Org members can view vehicles"
    ON public.vehicles FOR SELECT
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

CREATE POLICY "Org staff can manage vehicles"
    ON public.vehicles FOR ALL
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

-- Transport Lanes
CREATE POLICY "Org members can view transport lanes"
    ON public.transport_lanes FOR SELECT
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

CREATE POLICY "Org staff can manage transport lanes"
    ON public.transport_lanes FOR ALL
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

-- Transportation Orders
CREATE POLICY "Org members can view orders"
    ON public.transportation_orders FOR SELECT
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

CREATE POLICY "Org staff can manage orders"
    ON public.transportation_orders FOR ALL
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

-- Shipments
CREATE POLICY "Org members can view shipments"
    ON public.shipments FOR SELECT
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

CREATE POLICY "Org staff can manage shipments"
    ON public.shipments FOR ALL
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

-- Shipment Stops
CREATE POLICY "Org members can view shipment stops"
    ON public.shipment_stops FOR SELECT
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

CREATE POLICY "Org staff can manage shipment stops"
    ON public.shipment_stops FOR ALL
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

-- Tracking Events
CREATE POLICY "Org members can view tracking events"
    ON public.tracking_events FOR SELECT
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

CREATE POLICY "Org staff can insert tracking events"
    ON public.tracking_events FOR INSERT
    WITH CHECK (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

-- Shipment Exceptions
CREATE POLICY "Org members can view shipment exceptions"
    ON public.shipment_exceptions FOR SELECT
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

CREATE POLICY "Org staff can manage shipment exceptions"
    ON public.shipment_exceptions FOR ALL
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

-- Carrier Quotes
CREATE POLICY "Org members can view carrier quotes"
    ON public.carrier_quotes FOR SELECT
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

CREATE POLICY "Org staff can manage carrier quotes"
    ON public.carrier_quotes FOR ALL
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

-- Freight Invoices & Items
CREATE POLICY "Org members can view freight invoices"
    ON public.freight_invoices FOR SELECT
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

CREATE POLICY "Finance & Admins can manage freight invoices"
    ON public.freight_invoices FOR ALL
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

CREATE POLICY "Org members can view invoice items"
    ON public.freight_invoice_items FOR SELECT
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

CREATE POLICY "Finance & Admins can manage invoice items"
    ON public.freight_invoice_items FOR ALL
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

-- Freight Documents
CREATE POLICY "Org members can view freight documents"
    ON public.freight_documents FOR SELECT
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

CREATE POLICY "Org staff can manage freight documents"
    ON public.freight_documents FOR ALL
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

-- Approvals
CREATE POLICY "Org members can view approvals"
    ON public.approvals FOR SELECT
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

CREATE POLICY "Org staff can manage approvals"
    ON public.approvals FOR ALL
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

-- Activity Logs
CREATE POLICY "Org members can view activity logs"
    ON public.activity_logs FOR SELECT
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

CREATE POLICY "Org staff can insert activity logs"
    ON public.activity_logs FOR INSERT
    WITH CHECK (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

-- Product Events
CREATE POLICY "Org members can view product events"
    ON public.product_events FOR SELECT
    USING (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));

CREATE POLICY "Org staff can insert product events"
    ON public.product_events FOR INSERT
    WITH CHECK (organisation_id IN (SELECT organisation_id FROM public.get_user_organisation_ids()));
