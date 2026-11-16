-- ============================================================================
-- TRANSITIQ TMS — SEED SQL SCRIPT FOR SUPABASE POSTGRESQL
-- Seeds Core Master Organisation: Apex Distribution India
-- ============================================================================

INSERT INTO public.organisations (id, name, slug, code, gst_number)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Apex Distribution India Pvt Ltd',
    'apex-distribution-india',
    'APEX-IN',
    '27AAACA1234F1Z8'
) ON CONFLICT (id) DO NOTHING;

-- Insert 8 Key Facilities
INSERT INTO public.facilities (id, organisation_id, name, code, facility_type, address, city, state, pin_code, latitude, longitude, contact_name, contact_phone)
VALUES
('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'Gurgaon Central Hub & Fulfillment Center', 'GGN-HUB-01', 'hub', 'Plot 45, Sector 18, Udyog Vihar Phase IV', 'Gurgaon', 'Haryana', '122015', 28.4984, 77.0858, 'Manish Rawat', '+91 98112 34567'),
('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000001', 'Bhiwandi Western Gateway Warehouse', 'BHW-WH-02', 'warehouse', 'Gala 12-16, Shree Rajlaxmi Commercial Complex, Kalher', 'Mumbai', 'Maharashtra', '421302', 19.2969, 73.0631, 'Suresh Deshmukh', '+91 98200 45678'),
('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000001', 'Hosakote Southern Distribution Center', 'BLR-DC-03', 'distribution_center', 'Survey 88, KIADB Industrial Area, Pillagumpe', 'Bengaluru', 'Karnataka', '562114', 13.0699, 77.7981, 'Raghavan Iyer', '+91 98450 12345'),
('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000001', 'Sriperumbudur Auto-Freight Hub', 'MAA-HUB-04', 'hub', 'SIPCOT Industrial Park, Mambakkam', 'Chennai', 'Tamil Nadu', '602105', 12.9692, 79.9414, 'K. Balaji', '+91 94440 98765'),
('00000000-0000-0000-0001-000000000005', '00000000-0000-0000-0000-000000000001', 'Shamshabad Aero-Cargo Cross-Dock', 'HYD-XD-05', 'cross_dock', 'Cargo Satellite Village, GMR Aviation Zone', 'Hyderabad', 'Telangana', '500108', 17.2403, 78.4294, 'Venkatesh Reddy', '+91 98660 33445'),
('00000000-0000-0000-0001-000000000006', '00000000-0000-0000-0000-000000000001', 'Sanand Industrial Logistics Hub', 'AMD-HUB-06', 'hub', 'GIDC Industrial Estate Phase II, Bol', 'Ahmedabad', 'Gujarat', '382170', 22.9868, 72.3789, 'Bhavesh Patel', '+91 98790 66778'),
('00000000-0000-0000-0001-000000000007', '00000000-0000-0000-0000-000000000001', 'Dankuni Eastern Freight Terminal', 'CCU-FT-07', 'warehouse', 'NH-2 Express Highway Crossing, Dankuni Coal Complex', 'Kolkata', 'West Bengal', '712311', 22.6841, 88.2917, 'Subhash Sen', '+91 98310 55443'),
('00000000-0000-0000-0001-000000000008', '00000000-0000-0000-0000-000000000001', 'Chakan Automotive Distribution Park', 'PUN-DC-08', 'distribution_center', 'MIDC Phase III, Nighoje, Taluka Khed', 'Pune', 'Maharashtra', '410501', 18.7606, 73.8183, 'Anil Kulkarni', '+91 99220 88990')
ON CONFLICT (id) DO NOTHING;

-- Insert 12 Leading Indian Road Transport Carriers
INSERT INTO public.carriers (id, organisation_id, name, code, contact_person, email, phone, rating, on_time_percentage, avg_delay_hours, cancellation_rate, damage_incident_rate, total_shipments_completed, serviceable_lanes_count, base_rate_per_km_inr, is_active)
VALUES
('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0000-000000000001', 'TCI Freight Logistics', 'TCI-FRT', 'Ramesh Agarwal', 'ramesh.a@tcifreight.in', '+91 98110 50001', 4.85, 96.4, 1.2, 1.2, 0.3, 1420, 28, 44.50, TRUE),
('00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0000-000000000001', 'VRL Logistics Network', 'VRL-LOG', 'Vijay Sankeshwar', 'fleet@vrllogistics.com', '+91 98450 60002', 4.70, 94.8, 1.6, 1.8, 0.6, 1180, 26, 42.00, TRUE),
('00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0000-000000000001', 'Gati-KWE Express Fleet', 'GATI-EXP', 'Bala Subramanian', 'express@gatikwe.com', '+91 98490 70003', 4.65, 93.5, 2.1, 2.1, 0.7, 960, 24, 47.00, TRUE),
('00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0000-000000000001', 'Delhivery Surface Freight', 'DLV-SRF', 'Mohit Tandon', 'surface.b2b@delhivery.com', '+91 98112 80004', 4.55, 91.2, 2.4, 2.5, 0.9, 850, 22, 41.50, TRUE),
('00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0000-000000000001', 'Rivigo Relay Cargo', 'RVG-RLY', 'Gaurav Anand', 'relay.desk@rivigo.com', '+91 98103 90005', 4.60, 92.8, 1.9, 1.5, 0.4, 720, 20, 49.00, TRUE),
('00000000-0000-0000-0002-000000000006', '00000000-0000-0000-0000-000000000001', 'Mahindra Logistics Express', 'MLDL-EXP', 'Santosh Kadam', 'operations@mahindralogistics.com', '+91 98205 10006', 4.50, 90.5, 2.8, 2.9, 1.1, 640, 18, 43.50, TRUE),
('00000000-0000-0000-0002-000000000007', '00000000-0000-0000-0000-000000000001', 'Blue Dart Surface Logistics', 'BD-SURF', 'Cyrus Mistry', 'ground@bluedart.com', '+91 98200 20007', 4.80, 97.2, 0.8, 0.9, 0.2, 1100, 25, 52.00, TRUE),
('00000000-0000-0000-0002-000000000008', '00000000-0000-0000-0000-000000000001', 'Safexpress Dedicated Roadway', 'SFX-RDW', 'Pradeep Sharma', 'safexpress.desk@safexpress.com', '+91 98104 30008', 4.62, 93.0, 2.0, 2.2, 0.8, 790, 21, 46.00, TRUE),
('00000000-0000-0000-0002-000000000009', '00000000-0000-0000-0000-000000000001', 'Om Logistics Multimodal', 'OM-LOG', 'Dinesh Singhal', 'dinesh.s@omlogistics.co.in', '+91 98115 40009', 4.35, 87.5, 3.5, 3.8, 1.5, 510, 16, 39.50, TRUE),
('00000000-0000-0000-0002-000000000010', '00000000-0000-0000-0000-000000000001', 'Allcargo Logistics Fleet', 'ALLC-FLT', 'Shailendra Pillai', 'fleet.ops@allcargologistics.com', '+91 98211 50010', 4.45, 89.0, 3.0, 3.1, 1.2, 580, 19, 40.50, TRUE),
('00000000-0000-0000-0002-000000000011', '00000000-0000-0000-0000-000000000001', 'CJ Darcl Logistics', 'CJ-DARCL', 'R. K. Agarwal', 'transport@cjdarcl.com', '+91 98106 60011', 4.40, 88.5, 3.2, 3.4, 1.3, 490, 15, 38.50, TRUE),
('00000000-0000-0000-0002-000000000012', '00000000-0000-0000-0000-000000000001', 'Associated Road Carriers (ARC)', 'ARC-IND', 'Narayan Murthy', 'arc.dispatch@arclimited.com', '+91 98492 70012', 4.25, 85.0, 4.1, 4.5, 1.8, 430, 14, 37.00, TRUE)
ON CONFLICT (id) DO NOTHING;
