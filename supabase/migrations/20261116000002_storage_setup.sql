-- ============================================================================
-- SUPABASE STORAGE BUCKET: shipment-documents
-- Private enterprise document storage for Lorry Receipts, PODs, Invoices, E-Way bills
-- ============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'shipment-documents',
    'shipment-documents',
    FALSE,
    20971520, -- 20 MB max file size
    ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'text/csv']
)
ON CONFLICT (id) DO UPDATE SET
    public = FALSE,
    file_size_limit = 20971520,
    allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'text/csv'];

-- Storage RLS Policies
CREATE POLICY "Authenticated users can read shipment documents in their org"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'shipment-documents');

CREATE POLICY "Authenticated users can upload shipment documents"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'shipment-documents');

CREATE POLICY "Authenticated users can update their shipment documents"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'shipment-documents');

CREATE POLICY "Org Admins can delete shipment documents"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'shipment-documents');
