import { UserRole } from '@/types/tms';

export type Permission =
  | 'manage:org'
  | 'manage:users'
  | 'orders:create'
  | 'orders:edit'
  | 'orders:cancel'
  | 'shipments:plan'
  | 'shipments:dispatch'
  | 'shipments:assign_carrier'
  | 'tracking:simulate'
  | 'exceptions:resolve'
  | 'exceptions:approve_ai'
  | 'finance:view_invoices'
  | 'finance:reconcile'
  | 'finance:approve_payment'
  | 'documents:upload'
  | 'documents:verify'
  | 'analytics:view'
  | 'analytics:export';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  org_admin: [
    'manage:org',
    'manage:users',
    'orders:create',
    'orders:edit',
    'orders:cancel',
    'shipments:plan',
    'shipments:dispatch',
    'shipments:assign_carrier',
    'tracking:simulate',
    'exceptions:resolve',
    'exceptions:approve_ai',
    'finance:view_invoices',
    'finance:reconcile',
    'finance:approve_payment',
    'documents:upload',
    'documents:verify',
    'analytics:view',
    'analytics:export',
  ],
  operations_manager: [
    'orders:create',
    'orders:edit',
    'orders:cancel',
    'shipments:plan',
    'shipments:dispatch',
    'shipments:assign_carrier',
    'tracking:simulate',
    'exceptions:resolve',
    'exceptions:approve_ai',
    'documents:upload',
    'documents:verify',
    'analytics:view',
    'analytics:export',
  ],
  dispatcher: [
    'orders:create',
    'shipments:dispatch',
    'shipments:assign_carrier',
    'tracking:simulate',
    'exceptions:resolve',
    'documents:upload',
    'analytics:view',
  ],
  finance_manager: [
    'finance:view_invoices',
    'finance:reconcile',
    'finance:approve_payment',
    'documents:upload',
    'documents:verify',
    'analytics:view',
    'analytics:export',
  ],
  carrier_user: [
    'tracking:simulate',
    'documents:upload',
  ],
};

export function hasPermission(role: UserRole | undefined, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  org_admin: 'Organisation Admin',
  operations_manager: 'Operations Manager',
  dispatcher: 'Dispatcher',
  finance_manager: 'Finance Manager',
  carrier_user: 'Carrier User',
};

export const DEMO_USERS = [
  {
    role: 'org_admin' as UserRole,
    email: 'admin@apexdist.in',
    name: 'Rajesh Verma',
    title: 'VP of Supply Chain & Org Admin',
    description: 'Full administrative access across all modules, org settings, and approvals.',
  },
  {
    role: 'operations_manager' as UserRole,
    email: 'ops@apexdist.in',
    name: 'Priya Sharma',
    title: 'Operations Manager',
    description: 'Manages shipments, carrier allocations, capacity checks, and AI exception approvals.',
  },
  {
    role: 'dispatcher' as UserRole,
    email: 'dispatch@apexdist.in',
    name: 'Amit Patel',
    title: 'Senior Dispatcher',
    description: 'Handles real-time fleet dispatch, tracking event simulation, and road checkpoints.',
  },
  {
    role: 'finance_manager' as UserRole,
    email: 'finance@apexdist.in',
    name: 'Sunita Rao',
    title: 'Freight Audit & Finance Lead',
    description: 'Audits carrier invoices, flags rate discrepancies, and approves freight reconciliations.',
  },
  {
    role: 'carrier_user' as UserRole,
    email: 'carrier@tci-freight.in',
    name: 'Vikram Singh (TCI Freight)',
    title: 'Partner Carrier Representative',
    description: 'Restricted view of assigned loads, status updates, and Proof of Delivery uploads.',
  },
];
