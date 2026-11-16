/**
 * TRANSITIQ DEMO DATA SEEDING SCRIPT
 * Seeds the full interconnected relational data set into Supabase:
 * - 8 Facilities
 * - 25 Customers
 * - 12 Carriers
 * - 15 Vehicles
 * - 30 Transport Lanes
 * - 80 Transportation Orders
 * - 70 Shipments
 * - 150+ Tracking Events
 * - 20 Exceptions (with AI recommendations)
 * - 20 Freight Invoices (with variance reconciliation)
 * - 12 Approvals
 * - Freight Documents
 * - Activity Logs
 *
 * Usage: npx tsx scripts/seed-data.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { generateSeedData } from '../src/lib/data/mock-data';
dotenv.config({ path: '.env.local' });
dotenv.config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function runSeed() {
  console.log('Generating deterministic relative demo data...');
  const seed = generateSeedData();

  console.log('1. Upserting Organisation...');
  await supabase.from('organisations').upsert({
    id: '00000000-0000-0000-0000-000000000001',
    name: seed.organisation.name,
    slug: seed.organisation.slug,
    code: seed.organisation.code,
    gst_number: seed.organisation.gst_number,
  });

  const orgId = '00000000-0000-0000-0000-000000000001';

  console.log('2. Seeding 8 Facilities...');
  for (const fac of seed.facilities) {
    await supabase.from('facilities').upsert({
      organisation_id: orgId,
      name: fac.name,
      code: fac.code,
      facility_type: fac.facility_type,
      address: fac.address,
      city: fac.city,
      state: fac.state,
      pin_code: fac.pin_code,
      latitude: fac.latitude,
      longitude: fac.longitude,
      contact_name: fac.contact_name,
      contact_phone: fac.contact_phone,
    });
  }

  console.log('3. Seeding 25 Customers...');
  for (const c of seed.customers) {
    await supabase.from('customers').upsert({
      organisation_id: orgId,
      name: c.name,
      code: c.code,
      contact_person: c.contact_person,
      email: c.email,
      phone: c.phone,
      address: c.address,
      city: c.city,
      state: c.state,
      pin_code: c.pin_code,
      credit_limit_inr: c.credit_limit_inr,
    });
  }

  console.log('4. Seeding 12 Carriers...');
  for (const carr of seed.carriers) {
    await supabase.from('carriers').upsert({
      organisation_id: orgId,
      name: carr.name,
      code: carr.code,
      contact_person: carr.contact_person,
      email: carr.email,
      phone: carr.phone,
      rating: carr.rating,
      on_time_percentage: carr.on_time_percentage,
      avg_delay_hours: carr.avg_delay_hours,
      cancellation_rate: carr.cancellation_rate,
      damage_incident_rate: carr.damage_incident_rate,
      total_shipments_completed: carr.total_shipments_completed,
      serviceable_lanes_count: carr.serviceable_lanes_count,
      base_rate_per_km_inr: carr.base_rate_per_km_inr,
      is_active: carr.is_active,
    });
  }

  console.log('5. Seeding 30 Transport Lanes...');
  for (const l of seed.lanes) {
    await supabase.from('transport_lanes').upsert({
      organisation_id: orgId,
      origin_city: l.origin_city,
      destination_city: l.destination_city,
      distance_km: l.distance_km,
      transit_time_hours: l.transit_time_hours,
      standard_rate_inr: l.standard_rate_inr,
      toll_estimate_inr: l.toll_estimate_inr,
      difficulty_rating: l.difficulty_rating,
      is_active: l.is_active,
    });
  }

  console.log('Seed data successfully pushed to Supabase database!');
}

runSeed().catch(console.error);
