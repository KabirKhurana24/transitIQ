import {
  Organisation,
  Profile,
  Customer,
  Facility,
  Carrier,
  Vehicle,
  TransportLane,
  TransportationOrder,
  Shipment,
  ShipmentStop,
  TrackingEvent,
  ShipmentException,
  CarrierQuote,
  FreightInvoice,
  FreightInvoiceItem,
  Approval,
  FreightDocument,
  ActivityLog,
  ScoringWeights,
} from '@/types/tms';

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  cost: 0.35,
  on_time: 0.30,
  capacity: 0.15,
  incident: 0.10,
  lane_experience: 0.10,
};

export const DEMO_ORG: Organisation = {
  id: 'org-apex-001',
  name: 'Apex Distribution India Pvt Ltd',
  slug: 'apex-distribution-india',
  code: 'APEX-IN',
  gst_number: '27AAACA1234F1Z8',
  created_at: new Date(Date.now() - 180 * 86400000).toISOString(),
};

// 8 Logistics Facilities across India
export const DEMO_FACILITIES: Facility[] = [
  {
    id: 'fac-01',
    organisation_id: DEMO_ORG.id,
    name: 'Gurgaon Central Hub & Fulfillment Center',
    code: 'GGN-HUB-01',
    facility_type: 'hub',
    address: 'Plot 45, Sector 18, Udyog Vihar Phase IV',
    city: 'Gurgaon',
    state: 'Haryana',
    pin_code: '122015',
    latitude: 28.4984,
    longitude: 77.0858,
    contact_name: 'Manish Rawat',
    contact_phone: '+91 98112 34567',
    created_at: new Date(Date.now() - 150 * 86400000).toISOString(),
  },
  {
    id: 'fac-02',
    organisation_id: DEMO_ORG.id,
    name: 'Bhiwandi Western Gateway Warehouse',
    code: 'BHW-WH-02',
    facility_type: 'warehouse',
    address: 'Gala 12-16, Shree Rajlaxmi Commercial Complex, Kalher',
    city: 'Mumbai',
    state: 'Maharashtra',
    pin_code: '421302',
    latitude: 19.2969,
    longitude: 73.0631,
    contact_name: 'Suresh Deshmukh',
    contact_phone: '+91 98200 45678',
    created_at: new Date(Date.now() - 150 * 86400000).toISOString(),
  },
  {
    id: 'fac-03',
    organisation_id: DEMO_ORG.id,
    name: 'Hosakote Southern Distribution Center',
    code: 'BLR-DC-03',
    facility_type: 'distribution_center',
    address: 'Survey 88, KIADB Industrial Area, Pillagumpe',
    city: 'Bengaluru',
    state: 'Karnataka',
    pin_code: '562114',
    latitude: 13.0699,
    longitude: 77.7981,
    contact_name: 'Raghavan Iyer',
    contact_phone: '+91 98450 12345',
    created_at: new Date(Date.now() - 150 * 86400000).toISOString(),
  },
  {
    id: 'fac-04',
    organisation_id: DEMO_ORG.id,
    name: 'Sriperumbudur Auto-Freight Hub',
    code: 'MAA-HUB-04',
    facility_type: 'hub',
    address: 'SIPCOT Industrial Park, Mambakkam',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pin_code: '602105',
    latitude: 12.9692,
    longitude: 79.9414,
    contact_name: 'K. Balaji',
    contact_phone: '+91 94440 98765',
    created_at: new Date(Date.now() - 150 * 86400000).toISOString(),
  },
  {
    id: 'fac-05',
    organisation_id: DEMO_ORG.id,
    name: 'Shamshabad Aero-Cargo Cross-Dock',
    code: 'HYD-XD-05',
    facility_type: 'cross_dock',
    address: 'Cargo Satellite Village, GMR Aviation Zone',
    city: 'Hyderabad',
    state: 'Telangana',
    pin_code: '500108',
    latitude: 17.2403,
    longitude: 78.4294,
    contact_name: 'Venkatesh Reddy',
    contact_phone: '+91 98660 33445',
    created_at: new Date(Date.now() - 150 * 86400000).toISOString(),
  },
  {
    id: 'fac-06',
    organisation_id: DEMO_ORG.id,
    name: 'Sanand Industrial Logistics Hub',
    code: 'AMD-HUB-06',
    facility_type: 'hub',
    address: 'GIDC Industrial Estate Phase II, Bol',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pin_code: '382170',
    latitude: 22.9868,
    longitude: 72.3789,
    contact_name: 'Bhavesh Patel',
    contact_phone: '+91 98790 66778',
    created_at: new Date(Date.now() - 150 * 86400000).toISOString(),
  },
  {
    id: 'fac-07',
    organisation_id: DEMO_ORG.id,
    name: 'Dankuni Eastern Freight Terminal',
    code: 'CCU-FT-07',
    facility_type: 'warehouse',
    address: 'NH-2 Express Highway Crossing, Dankuni Coal Complex',
    city: 'Kolkata',
    state: 'West Bengal',
    pin_code: '712311',
    latitude: 22.6841,
    longitude: 88.2917,
    contact_name: 'Subhash Sen',
    contact_phone: '+91 98310 55443',
    created_at: new Date(Date.now() - 150 * 86400000).toISOString(),
  },
  {
    id: 'fac-08',
    organisation_id: DEMO_ORG.id,
    name: 'Chakan Automotive Distribution Park',
    code: 'PUN-DC-08',
    facility_type: 'distribution_center',
    address: 'MIDC Phase III, Nighoje, Taluka Khed',
    city: 'Pune',
    state: 'Maharashtra',
    pin_code: '410501',
    latitude: 18.7606,
    longitude: 73.8183,
    contact_name: 'Anil Kulkarni',
    contact_phone: '+91 99220 88990',
    created_at: new Date(Date.now() - 150 * 86400000).toISOString(),
  },
];

// 25 Enterprise Customers in India
export const DEMO_CUSTOMERS: Customer[] = [
  { id: 'cust-01', organisation_id: DEMO_ORG.id, name: 'Tata AutoComp Systems Ltd', code: 'TACO', contact_person: 'Ajay Srivastava', email: 'ajay.s@tataautocomp.com', phone: '+91 98230 11223', address: 'Taco House, Hinjawadi', city: 'Pune', state: 'Maharashtra', pin_code: '411057', credit_limit_inr: 5000000, created_at: new Date(Date.now() - 120 * 86400000).toISOString() },
  { id: 'cust-02', organisation_id: DEMO_ORG.id, name: 'Havells India Enterprises', code: 'HAVL', contact_person: 'Neeraj Goel', email: 'n.goel@havells.com', phone: '+91 98110 44556', address: 'QRG Towers, 2D Expressway', city: 'Noida', state: 'Uttar Pradesh', pin_code: '201304', credit_limit_inr: 7500000, created_at: new Date(Date.now() - 120 * 86400000).toISOString() },
  { id: 'cust-03', organisation_id: DEMO_ORG.id, name: 'Asian Paints Distribution', code: 'ASPN', contact_person: 'Kunal Merchant', email: 'logistics@asianpaints.com', phone: '+91 98201 99887', address: '6A Shantiniketan, Vakola', city: 'Mumbai', state: 'Maharashtra', pin_code: '400055', credit_limit_inr: 8000000, created_at: new Date(Date.now() - 120 * 86400000).toISOString() },
  { id: 'cust-04', organisation_id: DEMO_ORG.id, name: 'Sun Pharma Logistics', code: 'SUNP', contact_person: 'Dr. Vivek Joshi', email: 'v.joshi@sunpharma.com', phone: '+91 98210 55667', address: 'Sun House, Goregaon East', city: 'Mumbai', state: 'Maharashtra', pin_code: '400063', credit_limit_inr: 10000000, created_at: new Date(Date.now() - 120 * 86400000).toISOString() },
  { id: 'cust-05', organisation_id: DEMO_ORG.id, name: 'Schneider Electric India', code: 'SEIN', contact_person: 'Deepak Mohan', email: 'deepak.m@se.com', phone: '+91 98451 77889', address: 'Global Tech Park, Bellandur', city: 'Bengaluru', state: 'Karnataka', pin_code: '560103', credit_limit_inr: 6000000, created_at: new Date(Date.now() - 120 * 86400000).toISOString() },
  { id: 'cust-06', organisation_id: DEMO_ORG.id, name: 'Marico Consumer Goods', code: 'MARI', contact_person: 'Anita Roy', email: 'anita.roy@marico.com', phone: '+91 98202 33441', address: 'Grande Palladium, CST Road', city: 'Mumbai', state: 'Maharashtra', pin_code: '400098', credit_limit_inr: 4500000, created_at: new Date(Date.now() - 120 * 86400000).toISOString() },
  { id: 'cust-07', organisation_id: DEMO_ORG.id, name: 'Dabur India Consumer Care', code: 'DABR', contact_person: 'Harish Chawla', email: 'h.chawla@dabur.com', phone: '+91 98101 22334', address: 'Kaushambi, Sahibabad', city: 'Ghaziabad', state: 'Uttar Pradesh', pin_code: '201010', credit_limit_inr: 5000000, created_at: new Date(Date.now() - 120 * 86400000).toISOString() },
  { id: 'cust-08', organisation_id: DEMO_ORG.id, name: 'Lupin Pharmaceuticals', code: 'LUPN', contact_person: 'Sunil Rao', email: 'sunilrao@lupin.com', phone: '+91 98203 77889', address: 'Kalpataru Inspire, Santacruz', city: 'Mumbai', state: 'Maharashtra', pin_code: '400055', credit_limit_inr: 6500000, created_at: new Date(Date.now() - 120 * 86400000).toISOString() },
  { id: 'cust-09', organisation_id: DEMO_ORG.id, name: 'Crompton Greaves Consumer', code: 'CRMP', contact_person: 'Prasad Naik', email: 'prasad.n@crompton.co.in', phone: '+91 98204 44556', address: 'Equinox Business Park, LBS Marg', city: 'Mumbai', state: 'Maharashtra', pin_code: '400070', credit_limit_inr: 3500000, created_at: new Date(Date.now() - 120 * 86400000).toISOString() },
  { id: 'cust-10', organisation_id: DEMO_ORG.id, name: 'Bosch Chassis Systems', code: 'BOSC', contact_person: 'Karthik Nathan', email: 'karthik.n@bosch.com', phone: '+91 98452 33221', address: 'Adugodi, Hosur Road', city: 'Bengaluru', state: 'Karnataka', pin_code: '560030', credit_limit_inr: 9000000, created_at: new Date(Date.now() - 120 * 86400000).toISOString() },
  { id: 'cust-11', organisation_id: DEMO_ORG.id, name: 'Godrej Consumer Products', code: 'GDRJ', contact_person: 'Preeti Kamat', email: 'preeti.k@godrejcp.com', phone: '+91 98205 66778', address: 'Godrej One, Vikhroli East', city: 'Mumbai', state: 'Maharashtra', pin_code: '400079', credit_limit_inr: 4000000, created_at: new Date(Date.now() - 120 * 86400000).toISOString() },
  { id: 'cust-12', organisation_id: DEMO_ORG.id, name: 'Voltas Climate Solutions', code: 'VOLT', contact_person: 'Ramesh Menon', email: 'r.menon@voltas.com', phone: '+91 98206 77881', address: 'Voltas House A, Dr. Babasaheb', city: 'Mumbai', state: 'Maharashtra', pin_code: '400033', credit_limit_inr: 5500000, created_at: new Date(Date.now() - 120 * 86400000).toISOString() },
  { id: 'cust-13', organisation_id: DEMO_ORG.id, name: 'TVS Motor Logistics', code: 'TVSM', contact_person: 'Senthil Kumar', email: 'senthil.k@tvsmotor.com', phone: '+91 98401 11223', address: 'Harita, Hosur', city: 'Hosur', state: 'Tamil Nadu', pin_code: '635109', credit_limit_inr: 8500000, created_at: new Date(Date.now() - 120 * 86400000).toISOString() },
  { id: 'cust-14', organisation_id: DEMO_ORG.id, name: 'Dr. Reddy Laboratories', code: 'DRDY', contact_person: 'G. Madhavan', email: 'g.madhav@drreddys.com', phone: '+91 98661 22334', address: 'Door No 8-2-337, Banjara Hills', city: 'Hyderabad', state: 'Telangana', pin_code: '500034', credit_limit_inr: 7000000, created_at: new Date(Date.now() - 120 * 86400000).toISOString() },
  { id: 'cust-15', organisation_id: DEMO_ORG.id, name: 'Berger Paints India', code: 'BRGR', contact_person: 'Debashis Das', email: 'd.das@bergerindia.com', phone: '+91 98301 99881', address: '129 Park Street', city: 'Kolkata', state: 'West Bengal', pin_code: '700017', credit_limit_inr: 4500000, created_at: new Date(Date.now() - 120 * 86400000).toISOString() },
  { id: 'cust-16', organisation_id: DEMO_ORG.id, name: 'Pidilite Industries', code: 'PIDI', contact_person: 'Nitin Parekh', email: 'nitin.p@pidilite.com', phone: '+91 98207 88990', address: 'Ramkrishna Mandir Road, Andheri', city: 'Mumbai', state: 'Maharashtra', pin_code: '400059', credit_limit_inr: 5000000, created_at: new Date(Date.now() - 120 * 86400000).toISOString() },
  { id: 'cust-17', organisation_id: DEMO_ORG.id, name: 'Finolex Cables Limited', code: 'FNLX', contact_person: 'Pramod Patil', email: 'p.patil@finolex.com', phone: '+91 98221 44556', address: '26/27 Mumbai-Pune Road, Pimpri', city: 'Pune', state: 'Maharashtra', pin_code: '411018', credit_limit_inr: 4000000, created_at: new Date(Date.now() - 120 * 86400000).toISOString() },
  { id: 'cust-18', organisation_id: DEMO_ORG.id, name: 'Amara Raja Batteries', code: 'AMRJ', contact_person: 'Sudhir Varma', email: 's.varma@amararaja.com', phone: '+91 98480 33445', address: 'Renigunta Road, Karakambadi', city: 'Tirupati', state: 'Andhra Pradesh', pin_code: '517520', credit_limit_inr: 6000000, created_at: new Date(Date.now() - 120 * 86400000).toISOString() },
  { id: 'cust-19', organisation_id: DEMO_ORG.id, name: 'Hero MotoCorp Spares', code: 'HMCL', contact_person: 'Rajiv Khanna', email: 'rajiv.k@heromotocorp.com', phone: '+91 98102 66778', address: 'Vasant Kunj Phase II', city: 'Delhi', state: 'Delhi', pin_code: '110070', credit_limit_inr: 7500000, created_at: new Date(Date.now() - 120 * 86400000).toISOString() },
  { id: 'cust-20', organisation_id: DEMO_ORG.id, name: 'Exide Industries Limited', code: 'EXID', contact_person: 'Joydeep Bose', email: 'j.bose@exide.co.in', phone: '+91 98302 55667', address: '59E Chowringhee Road', city: 'Kolkata', state: 'West Bengal', pin_code: '700020', credit_limit_inr: 5500000, created_at: new Date(Date.now() - 120 * 86400000).toISOString() },
  { id: 'cust-21', organisation_id: DEMO_ORG.id, name: 'Ashok Leyland Spare Logistics', code: 'ALEY', contact_person: 'V. Ramanathan', email: 'v.ram@ashokleyland.com', phone: '+91 98402 77889', address: '1 Sardar Patel Road, Guindy', city: 'Chennai', state: 'Tamil Nadu', pin_code: '600032', credit_limit_inr: 6500000, created_at: new Date(Date.now() - 120 * 86400000).toISOString() },
  { id: 'cust-22', organisation_id: DEMO_ORG.id, name: 'Blue Star Commercial Refrigeration', code: 'BLUS', contact_person: 'Chetan Shah', email: 'c.shah@bluestarindia.com', phone: '+91 98208 99001', address: 'Kasturi Building, Mohan Advani', city: 'Mumbai', state: 'Maharashtra', pin_code: '400020', credit_limit_inr: 4500000, created_at: new Date(Date.now() - 120 * 86400000).toISOString() },
  { id: 'cust-23', organisation_id: DEMO_ORG.id, name: 'Balkrishna Industries (BKT)', code: 'BKTI', contact_person: 'Alok Poddar', email: 'alok.p@bkt-tires.com', phone: '+91 98209 11223', address: 'BKT House, C-15 Trade World', city: 'Mumbai', state: 'Maharashtra', pin_code: '400013', credit_limit_inr: 5000000, created_at: new Date(Date.now() - 120 * 86400000).toISOString() },
  { id: 'cust-24', organisation_id: DEMO_ORG.id, name: 'Thermax Energy & Environment', code: 'THRX', contact_person: 'Mahesh Joshi', email: 'm.joshi@thermaxglobal.com', phone: '+91 98222 33445', address: 'Thermax House, 19 Wakdewadi', city: 'Pune', state: 'Maharashtra', pin_code: '411003', credit_limit_inr: 4000000, created_at: new Date(Date.now() - 120 * 86400000).toISOString() },
  { id: 'cust-25', organisation_id: DEMO_ORG.id, name: 'Apollo Tyres Distribution', code: 'APLO', contact_person: 'Harpreet Singh', email: 'harpreet.s@apollotyres.com', phone: '+91 98111 88990', address: 'Apollo House, 7 Institutional Area', city: 'Gurgaon', state: 'Haryana', pin_code: '122001', credit_limit_inr: 7000000, created_at: new Date(Date.now() - 120 * 86400000).toISOString() },
];

// 12 Realistic Indian Road Carriers
export const DEMO_CARRIERS: Carrier[] = [
  { id: 'carr-01', organisation_id: DEMO_ORG.id, name: 'TCI Freight Logistics', code: 'TCI-FRT', contact_person: 'Ramesh Agarwal', email: 'ramesh.a@tcifreight.in', phone: '+91 98110 50001', rating: 4.85, on_time_percentage: 96.4, avg_delay_hours: 1.2, cancellation_rate: 1.2, damage_incident_rate: 0.3, total_shipments_completed: 1420, serviceable_lanes_count: 28, base_rate_per_km_inr: 44.5, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'carr-02', organisation_id: DEMO_ORG.id, name: 'VRL Logistics Network', code: 'VRL-LOG', contact_person: 'Vijay Sankeshwar', email: 'fleet@vrllogistics.com', phone: '+91 98450 60002', rating: 4.70, on_time_percentage: 94.8, avg_delay_hours: 1.6, cancellation_rate: 1.8, damage_incident_rate: 0.6, total_shipments_completed: 1180, serviceable_lanes_count: 26, base_rate_per_km_inr: 42.0, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'carr-03', organisation_id: DEMO_ORG.id, name: 'Gati-KWE Express Fleet', code: 'GATI-EXP', contact_person: 'Bala Subramanian', email: 'express@gatikwe.com', phone: '+91 98490 70003', rating: 4.65, on_time_percentage: 93.5, avg_delay_hours: 2.1, cancellation_rate: 2.1, damage_incident_rate: 0.7, total_shipments_completed: 960, serviceable_lanes_count: 24, base_rate_per_km_inr: 47.0, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'carr-04', organisation_id: DEMO_ORG.id, name: 'Delhivery Surface Freight', code: 'DLV-SRF', contact_person: 'Mohit Tandon', email: 'surface.b2b@delhivery.com', phone: '+91 98112 80004', rating: 4.55, on_time_percentage: 91.2, avg_delay_hours: 2.4, cancellation_rate: 2.5, damage_incident_rate: 0.9, total_shipments_completed: 850, serviceable_lanes_count: 22, base_rate_per_km_inr: 41.5, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'carr-05', organisation_id: DEMO_ORG.id, name: 'Rivigo Relay Cargo', code: 'RVG-RLY', contact_person: 'Gaurav Anand', email: 'relay.desk@rivigo.com', phone: '+91 98103 90005', rating: 4.60, on_time_percentage: 92.8, avg_delay_hours: 1.9, cancellation_rate: 1.5, damage_incident_rate: 0.4, total_shipments_completed: 720, serviceable_lanes_count: 20, base_rate_per_km_inr: 49.0, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'carr-06', organisation_id: DEMO_ORG.id, name: 'Mahindra Logistics Express', code: 'MLDL-EXP', contact_person: 'Santosh Kadam', email: 'operations@mahindralogistics.com', phone: '+91 98205 10006', rating: 4.50, on_time_percentage: 90.5, avg_delay_hours: 2.8, cancellation_rate: 2.9, damage_incident_rate: 1.1, total_shipments_completed: 640, serviceable_lanes_count: 18, base_rate_per_km_inr: 43.5, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'carr-07', organisation_id: DEMO_ORG.id, name: 'Blue Dart Surface Logistics', code: 'BD-SURF', contact_person: 'Cyrus Mistry', email: 'ground@bluedart.com', phone: '+91 98200 20007', rating: 4.80, on_time_percentage: 97.2, avg_delay_hours: 0.8, cancellation_rate: 0.9, damage_incident_rate: 0.2, total_shipments_completed: 1100, serviceable_lanes_count: 25, base_rate_per_km_inr: 52.0, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'carr-08', organisation_id: DEMO_ORG.id, name: 'Safexpress Dedicated Roadway', code: 'SFX-RDW', contact_person: 'Pradeep Sharma', email: 'safexpress.desk@safexpress.com', phone: '+91 98104 30008', rating: 4.62, on_time_percentage: 93.0, avg_delay_hours: 2.0, cancellation_rate: 2.2, damage_incident_rate: 0.8, total_shipments_completed: 790, serviceable_lanes_count: 21, base_rate_per_km_inr: 46.0, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'carr-09', organisation_id: DEMO_ORG.id, name: 'Om Logistics Multimodal', code: 'OM-LOG', contact_person: 'Dinesh Singhal', email: 'dinesh.s@omlogistics.co.in', phone: '+91 98115 40009', rating: 4.35, on_time_percentage: 87.5, avg_delay_hours: 3.5, cancellation_rate: 3.8, damage_incident_rate: 1.5, total_shipments_completed: 510, serviceable_lanes_count: 16, base_rate_per_km_inr: 39.5, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'carr-10', organisation_id: DEMO_ORG.id, name: 'Allcargo Logistics Fleet', code: 'ALLC-FLT', contact_person: 'Shailendra Pillai', email: 'fleet.ops@allcargologistics.com', phone: '+91 98211 50010', rating: 4.45, on_time_percentage: 89.0, avg_delay_hours: 3.0, cancellation_rate: 3.1, damage_incident_rate: 1.2, total_shipments_completed: 580, serviceable_lanes_count: 19, base_rate_per_km_inr: 40.5, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'carr-11', organisation_id: DEMO_ORG.id, name: 'CJ Darcl Logistics', code: 'CJ-DARCL', contact_person: 'R. K. Agarwal', email: 'transport@cjdarcl.com', phone: '+91 98106 60011', rating: 4.40, on_time_percentage: 88.5, avg_delay_hours: 3.2, cancellation_rate: 3.4, damage_incident_rate: 1.3, total_shipments_completed: 490, serviceable_lanes_count: 15, base_rate_per_km_inr: 38.5, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'carr-12', organisation_id: DEMO_ORG.id, name: 'Associated Road Carriers (ARC)', code: 'ARC-IND', contact_person: 'Narayan Murthy', email: 'arc.dispatch@arclimited.com', phone: '+91 98492 70012', rating: 4.25, on_time_percentage: 85.0, avg_delay_hours: 4.1, cancellation_rate: 4.5, damage_incident_rate: 1.8, total_shipments_completed: 430, serviceable_lanes_count: 14, base_rate_per_km_inr: 37.0, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
];

// 15 Vehicles with Indian commercial registrations and drivers
export const DEMO_VEHICLES: Vehicle[] = [
  { id: 'veh-01', organisation_id: DEMO_ORG.id, carrier_id: 'carr-01', registration_number: 'HR 55 AN 1824', vehicle_type: '32ft Multi-Axle', max_weight_kg: 18500, max_volume_cbm: 68, driver_name: 'Balwinder Singh', driver_phone: '+91 98123 45678', current_status: 'in_transit', created_at: new Date(Date.now() - 140 * 86400000).toISOString() },
  { id: 'veh-02', organisation_id: DEMO_ORG.id, carrier_id: 'carr-01', registration_number: 'HR 55 AQ 9012', vehicle_type: '19ft Container', max_weight_kg: 9000, max_volume_cbm: 38, driver_name: 'Satnam Singh', driver_phone: '+91 98123 90123', current_status: 'available', created_at: new Date(Date.now() - 140 * 86400000).toISOString() },
  { id: 'veh-03', organisation_id: DEMO_ORG.id, carrier_id: 'carr-02', registration_number: 'KA 25 D 4419', vehicle_type: '32ft Multi-Axle', max_weight_kg: 18500, max_volume_cbm: 68, driver_name: 'Basavaraj Patil', driver_phone: '+91 98451 11223', current_status: 'in_transit', created_at: new Date(Date.now() - 140 * 86400000).toISOString() },
  { id: 'veh-04', organisation_id: DEMO_ORG.id, carrier_id: 'carr-02', registration_number: 'KA 01 AH 5812', vehicle_type: '14ft Eicher', max_weight_kg: 5000, max_volume_cbm: 24, driver_name: 'Manjunath Gowda', driver_phone: '+91 98452 44556', current_status: 'available', created_at: new Date(Date.now() - 140 * 86400000).toISOString() },
  { id: 'veh-05', organisation_id: DEMO_ORG.id, carrier_id: 'carr-03', registration_number: 'TS 08 UB 7714', vehicle_type: '19ft Container', max_weight_kg: 9000, max_volume_cbm: 38, driver_name: 'K. Narsimha', driver_phone: '+91 98662 77889', current_status: 'in_transit', created_at: new Date(Date.now() - 140 * 86400000).toISOString() },
  { id: 'veh-06', organisation_id: DEMO_ORG.id, carrier_id: 'carr-03', registration_number: 'TS 07 TC 3190', vehicle_type: '40ft Trailer', max_weight_kg: 28000, max_volume_cbm: 95, driver_name: 'Mallaiah Goud', driver_phone: '+91 98663 88990', current_status: 'maintenance', created_at: new Date(Date.now() - 140 * 86400000).toISOString() },
  { id: 'veh-07', organisation_id: DEMO_ORG.id, carrier_id: 'carr-04', registration_number: 'DL 1M AB 4591', vehicle_type: '14ft Eicher', max_weight_kg: 5000, max_volume_cbm: 24, driver_name: 'Rambeer Yadav', driver_phone: '+91 98114 22334', current_status: 'in_transit', created_at: new Date(Date.now() - 140 * 86400000).toISOString() },
  { id: 'veh-08', organisation_id: DEMO_ORG.id, carrier_id: 'carr-05', registration_number: 'MH 04 KF 8201', vehicle_type: '32ft Multi-Axle', max_weight_kg: 18500, max_volume_cbm: 68, driver_name: 'Santosh Shinde', driver_phone: '+91 98207 55667', current_status: 'in_transit', created_at: new Date(Date.now() - 140 * 86400000).toISOString() },
  { id: 'veh-09', organisation_id: DEMO_ORG.id, carrier_id: 'carr-06', registration_number: 'MH 12 QN 6328', vehicle_type: '19ft Container', max_weight_kg: 9000, max_volume_cbm: 38, driver_name: 'Ganesh Jadhav', driver_phone: '+91 98223 99001', current_status: 'available', created_at: new Date(Date.now() - 140 * 86400000).toISOString() },
  { id: 'veh-10', organisation_id: DEMO_ORG.id, carrier_id: 'carr-07', registration_number: 'MH 02 CR 1198', vehicle_type: 'Tata Ace', max_weight_kg: 1200, max_volume_cbm: 8, driver_name: 'Pandurang Bhosale', driver_phone: '+91 98208 33445', current_status: 'available', created_at: new Date(Date.now() - 140 * 86400000).toISOString() },
  { id: 'veh-11', organisation_id: DEMO_ORG.id, carrier_id: 'carr-07', registration_number: 'TN 09 BX 5621', vehicle_type: '14ft Eicher', max_weight_kg: 5000, max_volume_cbm: 24, driver_name: 'K. Murugan', driver_phone: '+91 98403 66778', current_status: 'in_transit', created_at: new Date(Date.now() - 140 * 86400000).toISOString() },
  { id: 'veh-12', organisation_id: DEMO_ORG.id, carrier_id: 'carr-08', registration_number: 'GJ 01 AY 9432', vehicle_type: '32ft Multi-Axle', max_weight_kg: 18500, max_volume_cbm: 68, driver_name: 'Pravin Solanki', driver_phone: '+91 98791 22334', current_status: 'in_transit', created_at: new Date(Date.now() - 140 * 86400000).toISOString() },
  { id: 'veh-13', organisation_id: DEMO_ORG.id, carrier_id: 'carr-09', registration_number: 'WB 23 E 7820', vehicle_type: '19ft Container', max_weight_kg: 9000, max_volume_cbm: 38, driver_name: 'Tapan Ghosh', driver_phone: '+91 98303 44556', current_status: 'available', created_at: new Date(Date.now() - 140 * 86400000).toISOString() },
  { id: 'veh-14', organisation_id: DEMO_ORG.id, carrier_id: 'carr-10', registration_number: 'HR 38 W 5019', vehicle_type: '40ft Trailer', max_weight_kg: 28000, max_volume_cbm: 95, driver_name: 'Karamveer Gurjar', driver_phone: '+91 98116 88990', current_status: 'in_transit', created_at: new Date(Date.now() - 140 * 86400000).toISOString() },
  { id: 'veh-15', organisation_id: DEMO_ORG.id, carrier_id: 'carr-11', registration_number: 'UP 16 Z 8310', vehicle_type: '14ft Eicher', max_weight_kg: 5000, max_volume_cbm: 24, driver_name: 'Laxman Tyagi', driver_phone: '+91 98107 11223', current_status: 'available', created_at: new Date(Date.now() - 140 * 86400000).toISOString() },
];

// 30 Major Indian Transport Lanes with realistic distances, times, and INR rates
export const DEMO_LANES: TransportLane[] = [
  { id: 'lane-01', organisation_id: DEMO_ORG.id, origin_city: 'Gurgaon', destination_city: 'Mumbai', distance_km: 1410, transit_time_hours: 36, standard_rate_inr: 64000, toll_estimate_inr: 4800, difficulty_rating: 3, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'lane-02', organisation_id: DEMO_ORG.id, origin_city: 'Delhi', destination_city: 'Jaipur', distance_km: 275, transit_time_hours: 7, standard_rate_inr: 16500, toll_estimate_inr: 1200, difficulty_rating: 2, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'lane-03', organisation_id: DEMO_ORG.id, origin_city: 'Mumbai', destination_city: 'Pune', distance_km: 150, transit_time_hours: 4, standard_rate_inr: 12000, toll_estimate_inr: 950, difficulty_rating: 1, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'lane-04', organisation_id: DEMO_ORG.id, origin_city: 'Bengaluru', destination_city: 'Chennai', distance_km: 350, transit_time_hours: 8, standard_rate_inr: 21000, toll_estimate_inr: 1600, difficulty_rating: 2, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'lane-05', organisation_id: DEMO_ORG.id, origin_city: 'Hyderabad', destination_city: 'Bengaluru', distance_km: 570, transit_time_hours: 12, standard_rate_inr: 31000, toll_estimate_inr: 2200, difficulty_rating: 2, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'lane-06', organisation_id: DEMO_ORG.id, origin_city: 'Delhi', destination_city: 'Lucknow', distance_km: 540, transit_time_hours: 9, standard_rate_inr: 29500, toll_estimate_inr: 2100, difficulty_rating: 2, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'lane-07', organisation_id: DEMO_ORG.id, origin_city: 'Ahmedabad', destination_city: 'Mumbai', distance_km: 525, transit_time_hours: 11, standard_rate_inr: 28000, toll_estimate_inr: 1900, difficulty_rating: 2, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'lane-08', organisation_id: DEMO_ORG.id, origin_city: 'Chennai', destination_city: 'Hyderabad', distance_km: 630, transit_time_hours: 14, standard_rate_inr: 34000, toll_estimate_inr: 2400, difficulty_rating: 2, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'lane-09', organisation_id: DEMO_ORG.id, origin_city: 'Pune', destination_city: 'Indore', distance_km: 590, transit_time_hours: 13, standard_rate_inr: 32000, toll_estimate_inr: 2300, difficulty_rating: 3, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'lane-10', organisation_id: DEMO_ORG.id, origin_city: 'Kolkata', destination_city: 'Patna', distance_km: 580, transit_time_hours: 14, standard_rate_inr: 33500, toll_estimate_inr: 2100, difficulty_rating: 3, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'lane-11', organisation_id: DEMO_ORG.id, origin_city: 'Delhi', destination_city: 'Ahmedabad', distance_km: 940, transit_time_hours: 20, standard_rate_inr: 48000, toll_estimate_inr: 3400, difficulty_rating: 2, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'lane-12', organisation_id: DEMO_ORG.id, origin_city: 'Mumbai', destination_city: 'Bengaluru', distance_km: 980, transit_time_hours: 22, standard_rate_inr: 51000, toll_estimate_inr: 3600, difficulty_rating: 3, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'lane-13', organisation_id: DEMO_ORG.id, origin_city: 'Gurgaon', destination_city: 'Ludhiana', distance_km: 340, transit_time_hours: 7, standard_rate_inr: 19000, toll_estimate_inr: 1400, difficulty_rating: 1, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'lane-14', organisation_id: DEMO_ORG.id, origin_city: 'Kolkata', destination_city: 'Bhubaneswar', distance_km: 440, transit_time_hours: 10, standard_rate_inr: 26000, toll_estimate_inr: 1700, difficulty_rating: 2, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'lane-15', organisation_id: DEMO_ORG.id, origin_city: 'Hyderabad', destination_city: 'Nagpur', distance_km: 500, transit_time_hours: 11, standard_rate_inr: 28500, toll_estimate_inr: 2000, difficulty_rating: 2, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'lane-16', organisation_id: DEMO_ORG.id, origin_city: 'Chennai', destination_city: 'Coimbatore', distance_km: 505, transit_time_hours: 10, standard_rate_inr: 27500, toll_estimate_inr: 1950, difficulty_rating: 2, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'lane-17', organisation_id: DEMO_ORG.id, origin_city: 'Mumbai', destination_city: 'Nagpur', distance_km: 820, transit_time_hours: 14, standard_rate_inr: 44000, toll_estimate_inr: 3100, difficulty_rating: 2, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'lane-18', organisation_id: DEMO_ORG.id, origin_city: 'Bengaluru', destination_city: 'Kochi', distance_km: 540, transit_time_hours: 12, standard_rate_inr: 32500, toll_estimate_inr: 2200, difficulty_rating: 3, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'lane-19', organisation_id: DEMO_ORG.id, origin_city: 'Ahmedabad', destination_city: 'Indore', distance_km: 390, transit_time_hours: 8, standard_rate_inr: 23000, toll_estimate_inr: 1500, difficulty_rating: 2, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'lane-20', organisation_id: DEMO_ORG.id, origin_city: 'Delhi', destination_city: 'Chandigarh', distance_km: 250, transit_time_hours: 5, standard_rate_inr: 15500, toll_estimate_inr: 1100, difficulty_rating: 1, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'lane-21', organisation_id: DEMO_ORG.id, origin_city: 'Kolkata', destination_city: 'Ranchi', distance_km: 410, transit_time_hours: 9, standard_rate_inr: 25000, toll_estimate_inr: 1600, difficulty_rating: 3, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'lane-22', organisation_id: DEMO_ORG.id, origin_city: 'Pune', destination_city: 'Goa', distance_km: 440, transit_time_hours: 10, standard_rate_inr: 27000, toll_estimate_inr: 1800, difficulty_rating: 3, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'lane-23', organisation_id: DEMO_ORG.id, origin_city: 'Jaipur', destination_city: 'Ahmedabad', distance_km: 660, transit_time_hours: 13, standard_rate_inr: 35000, toll_estimate_inr: 2500, difficulty_rating: 2, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'lane-24', organisation_id: DEMO_ORG.id, origin_city: 'Hyderabad', destination_city: 'Vijayawada', distance_km: 275, transit_time_hours: 6, standard_rate_inr: 17000, toll_estimate_inr: 1200, difficulty_rating: 1, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'lane-25', organisation_id: DEMO_ORG.id, origin_city: 'Delhi', destination_city: 'Kanpur', distance_km: 490, transit_time_hours: 9, standard_rate_inr: 27000, toll_estimate_inr: 1900, difficulty_rating: 2, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'lane-26', organisation_id: DEMO_ORG.id, origin_city: 'Bengaluru', destination_city: 'Mangalore', distance_km: 350, transit_time_hours: 8, standard_rate_inr: 22500, toll_estimate_inr: 1400, difficulty_rating: 4, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'lane-27', organisation_id: DEMO_ORG.id, origin_city: 'Mumbai', destination_city: 'Surat', distance_km: 280, transit_time_hours: 6, standard_rate_inr: 18000, toll_estimate_inr: 1300, difficulty_rating: 1, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'lane-28', organisation_id: DEMO_ORG.id, origin_city: 'Chennai', destination_city: 'Madurai', distance_km: 460, transit_time_hours: 9, standard_rate_inr: 26000, toll_estimate_inr: 1800, difficulty_rating: 2, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'lane-29', organisation_id: DEMO_ORG.id, origin_city: 'Gurgaon', destination_city: 'Bhopal', distance_km: 740, transit_time_hours: 15, standard_rate_inr: 39000, toll_estimate_inr: 2800, difficulty_rating: 3, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
  { id: 'lane-30', organisation_id: DEMO_ORG.id, origin_city: 'Kolkata', destination_city: 'Guwahati', distance_km: 1000, transit_time_hours: 26, standard_rate_inr: 58000, toll_estimate_inr: 3900, difficulty_rating: 4, is_active: true, created_at: new Date(Date.now() - 150 * 86400000).toISOString() },
];

// Helper to generate dynamic relative dates
export function getRelativeDate(daysOffset: number, hoursOffset: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(d.getHours() + hoursOffset);
  return d.toISOString();
}

// 80 Transportation Orders, 70 Shipments, 150 Tracking Events, 20 Exceptions, 20 Invoices, 12 Approvals
export function generateSeedData() {
  const orders: TransportationOrder[] = [];
  const shipments: Shipment[] = [];
  const trackingEvents: TrackingEvent[] = [];
  const exceptions: ShipmentException[] = [];
  const carrierQuotes: CarrierQuote[] = [];
  const freightInvoices: FreightInvoice[] = [];
  const approvals: Approval[] = [];
  const documents: FreightDocument[] = [];
  const activityLogs: ActivityLog[] = [];

  const cargoItems = [
    { desc: 'Automotive wiring harnesses & engine sensors', cat: 'Automotive Parts', wt: 6400, vol: 28, veh: '19ft Container' },
    { desc: 'HVAC compressors & cooling fan assemblies', cat: 'Industrial Machinery', wt: 12500, vol: 54, veh: '32ft Multi-Axle' },
    { desc: 'Industrial paint drums & epoxy coatings (Class 3 Non-Hazardous)', cat: 'Chemicals & Coatings', wt: 8800, vol: 32, veh: '19ft Container' },
    { desc: 'Temperature-sensitive oral pharmaceuticals (15-25°C)', cat: 'Pharmaceuticals', wt: 3200, vol: 16, veh: '14ft Eicher' },
    { desc: 'High-voltage switchgear units & circuit breakers', cat: 'Electrical Equipment', wt: 14200, vol: 62, veh: '32ft Multi-Axle' },
    { desc: 'Commercial edible oils & consumer FMCG cartons', cat: 'Consumer Goods', wt: 17800, vol: 66, veh: '32ft Multi-Axle' },
    { desc: 'Ayurvedic wellness products & personal care lotions', cat: 'FMCG Healthcare', wt: 4500, vol: 22, veh: '14ft Eicher' },
    { desc: 'Precision hydraulic valves & steering assemblies', cat: 'Automotive Engineering', wt: 7200, vol: 30, veh: '19ft Container' },
    { desc: 'LED luminaires, streetlights & architectural fixtures', cat: 'Lighting & Electronics', wt: 3800, vol: 20, veh: '14ft Eicher' },
    { desc: 'Heavy vehicle radial truck tires (295/80 R22.5)', cat: 'Rubber & Tires', wt: 16500, vol: 65, veh: '32ft Multi-Axle' },
  ];

  // 1. Generate 70 Shipments and their linked Orders
  // Shipment statuses distribution:
  // - 10 'created' / 'planned' / 'carrier_assigned'
  // - 15 'dispatched'
  // - 18 'in_transit'
  // - 7 'at_risk'
  // - 6 'delayed'
  // - 12 'delivered'
  // - 2 'cancelled'
  // Total = 70 shipments!

  const shipmentStatusList: Array<Shipment['status']> = [
    // 10 early state
    'created', 'created', 'planned', 'planned', 'planned', 'carrier_assigned', 'carrier_assigned', 'carrier_assigned', 'carrier_assigned', 'carrier_assigned',
    // 15 dispatched
    'dispatched', 'dispatched', 'dispatched', 'dispatched', 'dispatched', 'dispatched', 'dispatched', 'dispatched', 'dispatched', 'dispatched', 'dispatched', 'dispatched', 'dispatched', 'dispatched', 'dispatched',
    // 18 in_transit
    'in_transit', 'in_transit', 'in_transit', 'in_transit', 'in_transit', 'in_transit', 'in_transit', 'in_transit', 'in_transit', 'in_transit', 'in_transit', 'in_transit', 'in_transit', 'in_transit', 'in_transit', 'in_transit', 'in_transit', 'in_transit',
    // 7 at_risk
    'at_risk', 'at_risk', 'at_risk', 'at_risk', 'at_risk', 'at_risk', 'at_risk',
    // 6 delayed
    'delayed', 'delayed', 'delayed', 'delayed', 'delayed', 'delayed',
    // 12 delivered
    'delivered', 'delivered', 'delivered', 'delivered', 'delivered', 'delivered', 'delivered', 'delivered', 'delivered', 'delivered', 'delivered', 'delivered',
    // 2 cancelled
    'cancelled', 'cancelled',
  ];

  for (let i = 0; i < 70; i++) {
    const shipmentIndex = i + 1;
    const shipmentNumber = `TMS-${1000 + shipmentIndex}`;
    const status = shipmentStatusList[i];
    const lane = DEMO_LANES[i % DEMO_LANES.length];
    const carrier = DEMO_CARRIERS[i % DEMO_CARRIERS.length];
    const vehicle = DEMO_VEHICLES[i % DEMO_VEHICLES.length];
    const customer = DEMO_CUSTOMERS[i % DEMO_CUSTOMERS.length];
    const cargo = cargoItems[i % cargoItems.length];

    // Dates relative to today
    let daysOffsetScheduled = 0;
    let daysOffsetActual = 0;
    let daysOffsetEstimated = 2;

    if (status === 'delivered') {
      daysOffsetScheduled = -5 - (i % 6);
      daysOffsetActual = daysOffsetScheduled;
      daysOffsetEstimated = daysOffsetScheduled + 2;
    } else if (status === 'in_transit' || status === 'dispatched' || status === 'at_risk' || status === 'delayed') {
      daysOffsetScheduled = -1 - (i % 2);
      daysOffsetActual = daysOffsetScheduled;
      daysOffsetEstimated = status === 'delayed' ? -1 : 1 + (i % 3);
    } else {
      // created / planned
      daysOffsetScheduled = 1 + (i % 3);
      daysOffsetEstimated = daysOffsetScheduled + 2;
    }

    const scheduledPickup = getRelativeDate(daysOffsetScheduled, 9);
    const estimatedDelivery = getRelativeDate(daysOffsetEstimated, 18);
    const actualPickup = ['dispatched', 'in_transit', 'at_risk', 'delayed', 'delivered'].includes(status)
      ? getRelativeDate(daysOffsetScheduled, 11)
      : undefined;
    const actualDelivery = status === 'delivered'
      ? getRelativeDate(daysOffsetEstimated, 17)
      : undefined;

    // Risk calculation
    let riskScore = 15;
    let riskLevel: Shipment['risk_level'] = 'low';

    if (status === 'at_risk') {
      riskScore = 74 + (i % 15);
      riskLevel = riskScore > 85 ? 'critical' : 'high';
    } else if (status === 'delayed') {
      riskScore = 88 + (i % 10);
      riskLevel = 'critical';
    } else if (status === 'in_transit') {
      riskScore = 20 + (i % 25);
      riskLevel = riskScore > 40 ? 'medium' : 'low';
    }

    const orderId = `ord-${shipmentIndex}`;
    const orderNumber = `ORD-${5000 + shipmentIndex}`;
    const shipmentId = `shp-${shipmentIndex}`;

    const order: TransportationOrder = {
      id: orderId,
      organisation_id: DEMO_ORG.id,
      customer_id: customer.id,
      customer_name: customer.name,
      order_number: orderNumber,
      origin_facility_id: DEMO_FACILITIES[i % DEMO_FACILITIES.length].id,
      origin_facility_name: DEMO_FACILITIES[i % DEMO_FACILITIES.length].name,
      origin_city: lane.origin_city,
      destination_facility_id: DEMO_FACILITIES[(i + 1) % DEMO_FACILITIES.length].id,
      destination_facility_name: DEMO_FACILITIES[(i + 1) % DEMO_FACILITIES.length].name,
      destination_city: lane.destination_city,
      pickup_address: DEMO_FACILITIES[i % DEMO_FACILITIES.length].address,
      delivery_address: DEMO_FACILITIES[(i + 1) % DEMO_FACILITIES.length].address,
      cargo_description: cargo.desc,
      cargo_category: cargo.cat,
      cargo_weight_kg: cargo.wt,
      cargo_volume_cbm: cargo.vol,
      required_vehicle_type: cargo.veh,
      pickup_deadline: scheduledPickup,
      delivery_deadline: estimatedDelivery,
      special_instructions: i % 3 === 0 ? 'Handle with care; maintain speed limit 60km/h on expressway; do not stack beyond 2 layers.' : undefined,
      status: status === 'created' ? 'confirmed' : (status === 'planned' ? 'planned' : (status === 'delivered' ? 'delivered' : 'in_transit')),
      estimated_freight_inr: lane.standard_rate_inr,
      shipment_id: shipmentId,
      created_at: getRelativeDate(daysOffsetScheduled - 2, 10),
      updated_at: getRelativeDate(daysOffsetScheduled - 1, 14),
    };
    orders.push(order);

    const shipment: Shipment = {
      id: shipmentId,
      organisation_id: DEMO_ORG.id,
      shipment_number: shipmentNumber,
      order_ids: [orderId],
      carrier_id: status === 'created' ? undefined : carrier.id,
      carrier_name: status === 'created' ? undefined : carrier.name,
      vehicle_id: ['created', 'planned'].includes(status) ? undefined : vehicle.id,
      vehicle_registration: ['created', 'planned'].includes(status) ? undefined : vehicle.registration_number,
      vehicle_type: vehicle.vehicle_type,
      origin_facility_id: order.origin_facility_id,
      origin_city: lane.origin_city,
      destination_facility_id: order.destination_facility_id,
      destination_city: lane.destination_city,
      scheduled_pickup_at: scheduledPickup,
      actual_pickup_at: actualPickup,
      estimated_delivery_at: estimatedDelivery,
      actual_delivery_at: actualDelivery,
      total_weight_kg: cargo.wt,
      total_volume_cbm: cargo.vol,
      agreed_freight_rate_inr: lane.standard_rate_inr + (i % 5) * 500,
      status,
      risk_score: riskScore,
      risk_level: riskLevel,
      dispatcher_id: 'usr-dispatch-01',
      dispatcher_name: 'Amit Patel',
      tracking_number: `TRK-IN-${88000 + shipmentIndex}`,
      created_at: getRelativeDate(daysOffsetScheduled - 1, 12),
      updated_at: getRelativeDate(0, -2),
    };
    shipments.push(shipment);

    // 2. Tracking events for active / delivered shipments
    if (['dispatched', 'in_transit', 'at_risk', 'delayed', 'delivered'].includes(status)) {
      trackingEvents.push({
        id: `trk-ev-${trackingEvents.length + 1}`,
        organisation_id: DEMO_ORG.id,
        shipment_id: shipment.id,
        event_type: 'vehicle_assigned',
        location_name: `${lane.origin_city} Logistics Hub`,
        city: lane.origin_city,
        latitude: 28.4595,
        longitude: 77.0266,
        event_timestamp: getRelativeDate(daysOffsetScheduled, 8),
        description: `Vehicle ${vehicle.registration_number} assigned with driver ${vehicle.driver_name}. E-way bill verified.`,
        is_simulated: true,
        created_at: getRelativeDate(daysOffsetScheduled, 8),
      });

      trackingEvents.push({
        id: `trk-ev-${trackingEvents.length + 1}`,
        organisation_id: DEMO_ORG.id,
        shipment_id: shipment.id,
        event_type: 'departed_origin',
        location_name: `${lane.origin_city} Toll Plaza NH-48`,
        city: lane.origin_city,
        latitude: 28.4200,
        longitude: 76.9900,
        event_timestamp: getRelativeDate(daysOffsetScheduled, 11),
        description: `Consignment cleared outward gate inspection. Transit initiated towards ${lane.destination_city}.`,
        is_simulated: true,
        created_at: getRelativeDate(daysOffsetScheduled, 11),
      });

      if (['in_transit', 'at_risk', 'delayed', 'delivered'].includes(status)) {
        trackingEvents.push({
          id: `trk-ev-${trackingEvents.length + 1}`,
          organisation_id: DEMO_ORG.id,
          shipment_id: shipment.id,
          event_type: 'checkpoint_reached',
          location_name: `Mid-way Toll Checkpoint`,
          city: 'Kotputli / Milestone Checkpoint',
          latitude: 27.7000,
          longitude: 76.2000,
          event_timestamp: getRelativeDate(daysOffsetScheduled, 17),
          description: `Passed RFID FASTag scanner checkpoint. Speed: 54 km/h. Driver rest halt recorded for 20 mins.`,
          is_simulated: true,
          created_at: getRelativeDate(daysOffsetScheduled, 17),
        });
      }

      if (status === 'at_risk') {
        trackingEvents.push({
          id: `trk-ev-${trackingEvents.length + 1}`,
          organisation_id: DEMO_ORG.id,
          shipment_id: shipment.id,
          event_type: 'delay_reported',
          location_name: 'Highway Congestion Zone',
          city: 'National Highway Corridor',
          latitude: 26.9000,
          longitude: 75.8000,
          event_timestamp: getRelativeDate(0, -4),
          description: `Unscheduled stoppage detected (stalled > 120 mins). Heavy rain and highway lane diversion reported.`,
          is_simulated: true,
          created_at: getRelativeDate(0, -4),
        });
      }

      if (status === 'delayed') {
        trackingEvents.push({
          id: `trk-ev-${trackingEvents.length + 1}`,
          organisation_id: DEMO_ORG.id,
          shipment_id: shipment.id,
          event_type: 'breakdown_reported',
          location_name: 'Western Expressway Bypass',
          city: 'Highway Service Bay',
          latitude: 24.5854,
          longitude: 73.7125,
          event_timestamp: getRelativeDate(0, -8),
          description: `Driver reported coolant leak and radiator overheating. Mobile service van dispatched by carrier.`,
          is_simulated: true,
          created_at: getRelativeDate(0, -8),
        });
      }

      if (status === 'delivered') {
        trackingEvents.push({
          id: `trk-ev-${trackingEvents.length + 1}`,
          organisation_id: DEMO_ORG.id,
          shipment_id: shipment.id,
          event_type: 'arrived_destination_hub',
          location_name: `${lane.destination_city} Inward Dock`,
          city: lane.destination_city,
          latitude: 19.0760,
          longitude: 72.8777,
          event_timestamp: getRelativeDate(daysOffsetEstimated, 14),
          description: `Vehicle arrived at destination facility gate. Inward barcode scan completed.`,
          is_simulated: true,
          created_at: getRelativeDate(daysOffsetEstimated, 14),
        });

        trackingEvents.push({
          id: `trk-ev-${trackingEvents.length + 1}`,
          organisation_id: DEMO_ORG.id,
          shipment_id: shipment.id,
          event_type: 'delivered',
          location_name: `${lane.destination_city} Customer Warehouse`,
          city: lane.destination_city,
          latitude: 19.0800,
          longitude: 72.8800,
          event_timestamp: getRelativeDate(daysOffsetEstimated, 17),
          description: `Consignment successfully offloaded. Digital Proof of Delivery signed with zero physical damages.`,
          is_simulated: true,
          created_at: getRelativeDate(daysOffsetEstimated, 17),
        });
      }
    }
  }

  // 3. Add 10 additional Unplanned Orders to bring total orders to exactly 80!
  for (let u = 71; u <= 80; u++) {
    const lane = DEMO_LANES[u % DEMO_LANES.length];
    const customer = DEMO_CUSTOMERS[u % DEMO_CUSTOMERS.length];
    const cargo = cargoItems[u % cargoItems.length];
    const scheduledPickup = getRelativeDate(2 + (u % 4), 9);
    const estimatedDelivery = getRelativeDate(4 + (u % 4), 18);

    orders.push({
      id: `ord-${u}`,
      organisation_id: DEMO_ORG.id,
      customer_id: customer.id,
      customer_name: customer.name,
      order_number: `ORD-${5000 + u}`,
      origin_facility_id: DEMO_FACILITIES[u % DEMO_FACILITIES.length].id,
      origin_facility_name: DEMO_FACILITIES[u % DEMO_FACILITIES.length].name,
      origin_city: lane.origin_city,
      destination_facility_id: DEMO_FACILITIES[(u + 1) % DEMO_FACILITIES.length].id,
      destination_facility_name: DEMO_FACILITIES[(u + 1) % DEMO_FACILITIES.length].name,
      destination_city: lane.destination_city,
      pickup_address: DEMO_FACILITIES[u % DEMO_FACILITIES.length].address,
      delivery_address: DEMO_FACILITIES[(u + 1) % DEMO_FACILITIES.length].address,
      cargo_description: cargo.desc,
      cargo_category: cargo.cat,
      cargo_weight_kg: cargo.wt,
      cargo_volume_cbm: cargo.vol,
      required_vehicle_type: cargo.veh,
      pickup_deadline: scheduledPickup,
      delivery_deadline: estimatedDelivery,
      special_instructions: 'Customer requested 4-hour advance SMS notification before arrival.',
      status: 'confirmed',
      estimated_freight_inr: lane.standard_rate_inr,
      shipment_id: undefined,
      created_at: getRelativeDate(-1, 9),
      updated_at: getRelativeDate(0, -1),
    });
  }

  // 4. Generate Exactly 20 Realistic Shipment Exceptions
  const exceptionDefinitions: Array<{
    type: ShipmentException['exception_type'];
    severity: ShipmentException['severity'];
    title: string;
    desc: string;
    recAction: ShipmentException['recommended_action_type'];
    problem: string;
    evidence: string;
    rec: string;
    outcome: string;
    conf: number;
    reqApproval: boolean;
  }> = [
    {
      type: 'vehicle_breakdown',
      severity: 'critical',
      title: 'Radiator Malfunction on NH-48 Expressway',
      desc: 'Vehicle HR 55 AN 1824 halted near Kotputli due to sudden engine coolant leakage. Fleet driver stopped on highway shoulder.',
      recAction: 'reassign_carrier',
      problem: 'Engine overheating resulting in stationary delay exceeding 180 minutes with remaining SLA of 14 hours.',
      evidence: 'GPS telematics shows vehicle stationary at KM 142 for 3h 12m; driver phone report confirmed mechanical radiator fault.',
      rec: 'Deploy emergency rescue transshipment vehicle from Jaipur hub (VRL Logistics 19ft Container) and notify receiver.',
      outcome: 'Mitigates 12-hour customer delivery delay down to 2.5 hours.',
      conf: 0.94,
      reqApproval: true,
    },
    {
      type: 'delayed_pickup',
      severity: 'medium',
      title: 'Carrier Dock Delay at Bhiwandi Warehouse',
      desc: 'Carrier truck arrived 3 hours past scheduled pickup appointment window due to local industrial corridor gridlock.',
      recAction: 'contact_carrier',
      problem: 'Scheduled outward dispatch delayed; risk of missing evening highway green corridor window.',
      evidence: 'Facility security gate timestamp shows check-in at 14:15 IST vs planned 11:00 IST.',
      rec: 'Assign priority express loading dock Bay #4 and authorize overtime warehouse staff for rapid pallet turn-around.',
      outcome: 'Truck departs within 45 minutes, recovering 1.5 hours of transit buffer.',
      conf: 0.88,
      reqApproval: false,
    },
    {
      type: 'route_deviation',
      severity: 'high',
      title: 'Unauthorized Corridor Diversion Detected',
      desc: 'Vehicle diverted 42 km off the approved Golden Quadrilateral route towards secondary state highway without dispatcher notice.',
      recAction: 'contact_carrier',
      problem: 'Safety and toll compliance alert: diverted route has weight-restricted bridges and documented hijack risk.',
      evidence: 'Geofence departure alert triggered at 03:22 IST; distance from primary lane is currently 42.4 km.',
      rec: 'Issue immediate phone contact to driver Balwinder Singh and demand immediate return to designated NH-48 lane.',
      outcome: 'Ensures cargo safety compliance and prevents highway confiscation.',
      conf: 0.96,
      reqApproval: false,
    },
    {
      type: 'missed_checkpoint',
      severity: 'medium',
      title: 'Missed FASTag Toll Checkpoint at Hubli Bypass',
      desc: 'Expected FASTag ping at Hubli Toll Plaza not received within expected 2-hour transit window.',
      recAction: 'request_updated_eta',
      problem: 'Blackout in telematics tracking for over 2.5 hours on Bengaluru-Mumbai corridor.',
      evidence: 'Last ping received at Davanagere at 07:15 IST; next checkpoint overdue by 135 minutes.',
      rec: 'Ping carrier telematics server for GPS fallback; request dispatcher voice verification with vehicle co-driver.',
      outcome: 'Re-establishes end-to-end shipment visibility and recalibrates ETA.',
      conf: 0.82,
      reqApproval: false,
    },
    {
      type: 'capacity_issue',
      severity: 'high',
      title: 'Consignment Weight Exceeds Vehicle Gross Payload',
      desc: 'Consolidated pallet weighment at factory weighbridge shows 19,450 kg vs vehicle registration rated capacity of 18,500 kg.',
      recAction: 'escalate_ops_manager',
      problem: 'Overweight shipment violates RTO regulations; risks heavy fines, vehicle seizure, and tire blowout.',
      evidence: 'Certified weighbridge slip WB-8821 records tare 9,800 kg, gross 29,250 kg (950 kg overload).',
      rec: 'Offload 2 non-critical pallets (1,100 kg) into cross-dock consolidation holding area for next-day dispatch.',
      outcome: 'Complies with Motor Vehicles Act 2019 and prevents highway interdiction.',
      conf: 0.98,
      reqApproval: true,
    },
    {
      type: 'delivery_rejection',
      severity: 'critical',
      title: 'Consignee Refused Unloading Due to Damaged Outer Pallet',
      desc: 'Customer receiver at Chennai distribution center refused 3 cartons citing moisture water ingress on outer corrugated boxes.',
      recAction: 'notify_customer',
      problem: 'Delivery halted; driver stranded at customer unloading ramp with 95% intact load.',
      evidence: 'Receiver gate rejection memo RM-402 filed with photo evidence of damaged shrinkwrap.',
      rec: 'Authorize partial delivery acceptance with debit note; segregate 3 cartons for joint surveyor insurance inspection.',
      outcome: 'Secures release of remaining 95% consignment and limits customer downtime.',
      conf: 0.91,
      reqApproval: true,
    },
    {
      type: 'missing_pod',
      severity: 'low',
      title: 'Missing Physical Lorry Receipt / Signed Proof of Delivery',
      desc: 'Shipment marked delivered 48 hours ago but signed customer POD stamp has not been uploaded to document vault.',
      recAction: 'request_missing_pod',
      problem: 'Freight invoice payment cannot be billed to customer without signed proof of delivery.',
      evidence: 'Delivered timestamp is 48 hours old; POD repository status is null.',
      rec: 'Trigger automated WhatsApp & SMS reminder to carrier operations desk to scan and upload stamped LR copy.',
      outcome: 'Accelerates invoice billing cycle and reduces Days Sales Outstanding (DSO).',
      conf: 0.95,
      reqApproval: false,
    },
    {
      type: 'invoice_mismatch',
      severity: 'medium',
      title: 'Fuel Surcharge & Toll Variance of ₹4,200',
      desc: 'Carrier submitted freight invoice billing ₹68,200 against contracted rate sheet cap of ₹64,000.',
      recAction: 'escalate_ops_manager',
      problem: 'Carrier applied unapproved 6.5% diesel price escalation surcharge.',
      evidence: 'Contract agreement clause 4.2 states diesel revision triggers only on monthly delta > 5%.',
      rec: 'Issue auto-rejection notice with itemized credit note requirement for ₹4,200 variance.',
      outcome: 'Protects gross transportation operating margin and maintains audit compliance.',
      conf: 0.93,
      reqApproval: true,
    },
  ];

  // We map 20 exceptions to at-risk, delayed, and random in-transit shipments
  const exceptionShipments = shipments.filter(s => s.status === 'at_risk' || s.status === 'delayed' || s.status === 'in_transit').slice(0, 20);

  for (let e = 0; e < 20; e++) {
    const shp = exceptionShipments[e] || shipments[e];
    const def = exceptionDefinitions[e % exceptionDefinitions.length];
    const excId = `exc-${e + 1}`;
    const isResolved = e >= 14;

    const exception: ShipmentException = {
      id: excId,
      organisation_id: DEMO_ORG.id,
      shipment_id: shp.id,
      shipment_number: shp.shipment_number,
      exception_type: def.type,
      severity: def.severity,
      title: `${def.title} [${shp.shipment_number}]`,
      description: def.desc,
      evidence_data: {
        lane: `${shp.origin_city} → ${shp.destination_city}`,
        carrier: shp.carrier_name,
        vehicle: shp.vehicle_registration,
        evidence_summary: def.evidence,
      },
      status: isResolved ? 'resolved' : (e % 3 === 0 ? 'action_recommended' : 'open'),
      recommended_action_type: def.recAction,
      ai_recommendation: {
        problem_identified: def.problem,
        evidence: def.evidence,
        recommended_action: def.rec,
        expected_outcome: def.outcome,
        confidence_level: def.conf,
        requires_approval: def.reqApproval,
      },
      resolution_notes: isResolved ? 'Action approved and executed by Operations Manager. Carrier verified operational continuity.' : undefined,
      resolved_at: isResolved ? getRelativeDate(0, -6) : undefined,
      resolved_by: isResolved ? 'Priya Sharma (Operations Manager)' : undefined,
      created_at: getRelativeDate(0, -(e * 3 + 2)),
    };
    exceptions.push(exception);
  }

  // 5. Generate Exactly 20 Freight Invoices (with realistic discrepancies, duplicate charges, extra fuel surcharges)
  const discrepancyTypes: Array<{
    reason: FreightInvoice['discrepancy_reason'];
    audit: FreightInvoice['audit_status'];
    diffPercent: number;
    notes: string;
  }> = [
    { reason: 'none', audit: 'passed', diffPercent: 0, notes: 'Exact match with agreed contracted lane rate.' },
    { reason: 'extra_fuel_surcharge', audit: 'discrepancy_flagged', diffPercent: 7.5, notes: 'Billed uncontracted diesel fuel surcharge without prior notice.' },
    { reason: 'incorrect_distance_charge', audit: 'discrepancy_flagged', diffPercent: 12.0, notes: 'Billed 1,620 km vs lane master approved distance of 1,410 km.' },
    { reason: 'duplicate_invoice', audit: 'discrepancy_flagged', diffPercent: 100.0, notes: 'Duplicate invoice number submitted for previously settled consignment.' },
    { reason: 'base_rate_mismatch', audit: 'discrepancy_flagged', diffPercent: 8.5, notes: 'Base line-haul freight rate higher than quarterly tender agreement.' },
    { reason: 'detention_unauthorized', audit: 'discrepancy_flagged', diffPercent: 4.2, notes: 'Detention waiting charges claimed without receiver unloading log stamp.' },
  ];

  for (let inv = 1; inv <= 20; inv++) {
    const shp = shipments[inv - 1];
    const carrier = DEMO_CARRIERS[inv % DEMO_CARRIERS.length];
    const disc = discrepancyTypes[inv % discrepancyTypes.length];
    const expected = shp.agreed_freight_rate_inr;
    const variance = disc.reason === 'none' ? 0 : Math.round(expected * (disc.diffPercent / 100));
    const billed = expected + variance;

    const invoice: FreightInvoice = {
      id: `inv-${inv}`,
      organisation_id: DEMO_ORG.id,
      shipment_id: shp.id,
      shipment_number: shp.shipment_number,
      carrier_id: carrier.id,
      carrier_name: carrier.name,
      invoice_number: `INV-2026-${8000 + inv}`,
      invoice_date: getRelativeDate(-4 - (inv % 5)),
      due_date: getRelativeDate(25 - (inv % 5)),
      expected_amount_inr: expected,
      billed_amount_inr: billed,
      variance_amount_inr: variance,
      variance_percentage: disc.diffPercent,
      audit_status: disc.audit,
      discrepancy_reason: disc.reason,
      payment_status: disc.audit === 'passed' ? (inv % 2 === 0 ? 'approved_for_payment' : 'paid') : 'unpaid',
      created_at: getRelativeDate(-4 - (inv % 5), 11),
    };
    freightInvoices.push(invoice);
  }

  // 6. Generate Exactly 12 Pending / Completed Approvals
  const approvalTypes = [
    { type: 'exception_action' as const, act: 'Authorize Emergency Transshipment Vehicle', just: 'Engine breakdown on NH-48 with 12 hours remaining on high-value pharma delivery SLA.', imp: 'Authorizes secondary carrier booking of ₹24,000 to save ₹450,000 inventory loss.' },
    { type: 'carrier_override' as const, act: 'Override AI Carrier Recommendation for Gurgaon-Mumbai', just: 'Customer contract strictly mandates dedicated ISO-certified cold fleet, which top AI pick lacked.', imp: 'Approved carrier TCI Freight at ₹64,000 (delta +₹2,500 over lowest quote).' },
    { type: 'invoice_payment' as const, act: 'Approve Reconciled Freight Invoice with Negotiated ₹2,000 Credit', just: 'Carrier accepted erroneous detention charge and issued credit note CN-442.', imp: 'Releases cleared net payment of ₹48,000 to VRL Logistics.' },
    { type: 'rate_revision' as const, act: 'Approve Seasonal Lane Surcharge for Chakan-Indore Route', just: 'Temporary monsoon bridge detour adds 65 km roundtrip over next 14 days.', imp: 'Temporary rate adjustment of +₹1,800/trip for 10 planned shipments.' },
  ];

  for (let a = 1; a <= 12; a++) {
    const def = approvalTypes[a % approvalTypes.length];
    const isApproved = a > 5;
    approvals.push({
      id: `appr-${a}`,
      organisation_id: DEMO_ORG.id,
      entity_type: def.type,
      entity_id: `ent-${a}`,
      requested_by: 'usr-ops-01',
      requested_by_name: 'Priya Sharma (Operations Manager)',
      requested_action: `${def.act} #${100 + a}`,
      justification: def.just,
      impact_summary: def.imp,
      status: isApproved ? 'approved' : 'pending',
      approved_by: isApproved ? 'usr-admin-01' : undefined,
      approved_by_name: isApproved ? 'Rajesh Verma (Org Admin)' : undefined,
      reviewed_at: isApproved ? getRelativeDate(0, -5) : undefined,
      review_notes: isApproved ? 'Approved based on operational urgency and cost-benefit audit.' : undefined,
      created_at: getRelativeDate(0, -18 - a * 4),
    });
  }

  // 7. Generate Supporting Freight Documents
  for (let d = 1; d <= 25; d++) {
    const shp = shipments[d - 1];
    const docTypes: FreightDocument['document_type'][] = ['eway_bill', 'lorry_receipt', 'proof_of_delivery', 'freight_invoice'];
    const docType = docTypes[d % docTypes.length];
    documents.push({
      id: `doc-${d}`,
      organisation_id: DEMO_ORG.id,
      shipment_id: shp.id,
      shipment_number: shp.shipment_number,
      document_type: docType,
      file_name: `${shp.shipment_number}_${docType.toUpperCase()}.pdf`,
      file_size_bytes: 245000 + (d * 12340),
      mime_type: 'application/pdf',
      storage_path: `documents/${shp.id}/${shp.shipment_number}_${docType}.pdf`,
      public_url: `/simulated-docs/${shp.shipment_number}_${docType}.pdf`,
      verified: d % 3 !== 0,
      verification_notes: d % 3 !== 0 ? 'Digital GST / e-Way bill signature cryptographically verified.' : 'Pending manual audit by dispatch supervisor.',
      uploaded_by: 'Amit Patel (Senior Dispatcher)',
      created_at: getRelativeDate(-2 - (d % 4), 14),
    });
  }

  // 8. Generate Activity Logs
  const actions = [
    'Order created from ERP integration',
    'Shipment consolidated & planned into 32ft load',
    'Carrier procurement algorithm executed',
    'Vehicle assigned & gate clearance approved',
    'Simulated highway tracking event logged',
    'AI Exception Risk triggered score recalculation',
    'Operations Manager approved transshipment action',
    'Freight invoice audited against contracted rate sheet',
  ];

  for (let act = 1; act <= 30; act++) {
    activityLogs.push({
      id: `log-${act}`,
      organisation_id: DEMO_ORG.id,
      user_id: 'usr-ops-01',
      user_name: act % 2 === 0 ? 'Priya Sharma' : 'Amit Patel',
      action: actions[act % actions.length],
      entity_type: act % 3 === 0 ? 'shipment' : (act % 3 === 1 ? 'order' : 'exception'),
      entity_id: `TMS-${1000 + (act % 50)}`,
      details: {
        module: 'Transportation Operations',
        timestamp: getRelativeDate(0, -act),
      },
      ip_address: '103.21.124.45',
      created_at: getRelativeDate(0, -act),
    });
  }

  return {
    organisation: DEMO_ORG,
    facilities: DEMO_FACILITIES,
    customers: DEMO_CUSTOMERS,
    carriers: DEMO_CARRIERS,
    vehicles: DEMO_VEHICLES,
    lanes: DEMO_LANES,
    orders,
    shipments,
    trackingEvents,
    exceptions,
    freightInvoices,
    approvals,
    documents,
    activityLogs,
  };
}
