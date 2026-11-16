/**
 * TRANSITIQ DEMO USER PROVISIONING SCRIPT
 * Creates the 5 authenticated demo users via the Supabase Admin API:
 * 1. Organisation Admin (admin@apexdist.in)
 * 2. Operations Manager (ops@apexdist.in)
 * 3. Dispatcher (dispatch@apexdist.in)
 * 4. Finance Manager (finance@apexdist.in)
 * 5. Carrier User (carrier@tci-freight.in)
 *
 * Usage: npx tsx scripts/seed-users.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEMO_PASSWORD = process.env.DEMO_USER_PASSWORD || 'TransitIQ@2026!';

const USERS_TO_SEED = [
  {
    email: 'admin@apexdist.in',
    name: 'Rajesh Verma',
    role: 'org_admin',
    phone: '+91 98110 11001',
    title: 'VP of Supply Chain & Org Admin',
  },
  {
    email: 'ops@apexdist.in',
    name: 'Priya Sharma',
    role: 'operations_manager',
    phone: '+91 98110 11002',
    title: 'Operations Manager',
  },
  {
    email: 'dispatch@apexdist.in',
    name: 'Amit Patel',
    role: 'dispatcher',
    phone: '+91 98110 11003',
    title: 'Senior Dispatcher',
  },
  {
    email: 'finance@apexdist.in',
    name: 'Sunita Rao',
    role: 'finance_manager',
    phone: '+91 98110 11004',
    title: 'Freight Audit & Finance Lead',
  },
  {
    email: 'carrier@tci-freight.in',
    name: 'Vikram Singh',
    role: 'carrier_user',
    phone: '+91 98110 11005',
    title: 'TCI Freight Partner Representative',
  },
];

async function seedUsers() {
  console.log('--- Provisioning TransitIQ Demo Accounts in Supabase Auth ---');

  // 1. Ensure Demo Organisation exists
  const { data: orgData, error: orgErr } = await supabase
    .from('organisations')
    .upsert({
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Apex Distribution India Pvt Ltd',
      slug: 'apex-distribution-india',
      code: 'APEX-IN',
      gst_number: '27AAACA1234F1Z8',
    })
    .select('id')
    .single();

  if (orgErr) {
    console.warn('Note on organisation creation:', orgErr.message);
  }
  const orgId = orgData?.id || '00000000-0000-0000-0000-000000000001';

  for (const user of USERS_TO_SEED) {
    console.log(`Creating user: ${user.email} (${user.role})...`);

    // Try creating via admin auth API
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: user.name,
        role: user.role,
        organisation_id: orgId,
      },
    });

    let userId = authUser?.user?.id;

    if (authError) {
      if (authError.message.includes('already exists') || authError.message.includes('unique')) {
        console.log(`User ${user.email} already exists in auth. Finding user ID...`);
        const { data: listData } = await supabase.auth.admin.listUsers();
        const existing = listData?.users.find((u) => u.email === user.email);
        userId = existing?.id;
      } else {
        console.error(`Error creating user ${user.email}:`, authError.message);
        continue;
      }
    }

    if (userId) {
      // Upsert profile
      await supabase.from('profiles').upsert({
        id: userId,
        email: user.email,
        full_name: user.name,
        phone: user.phone,
        default_role: user.role,
      });

      // Upsert organisation membership
      await supabase.from('organisation_members').upsert({
        organisation_id: orgId,
        user_id: userId,
        role: user.role,
        status: 'active',
      });

      console.log(`✓ User ${user.email} successfully linked to Apex Distribution India.`);
    }
  }

  console.log('\n--- Seeding Completed! ---');
  console.log('Login credentials:');
  console.log('Password for all demo accounts:', DEMO_PASSWORD);
  USERS_TO_SEED.forEach((u) => {
    console.log(`- [${u.role}] ${u.email}`);
  });
}

seedUsers().catch(console.error);
