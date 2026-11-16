import { describe, it, expect } from 'vitest';
import { hasPermission, ROLE_PERMISSIONS } from '@/lib/auth/roles';

describe('Role-Based Access Control (RBAC) Permissions', () => {
  it('Organisation Admin has all administrative privileges', () => {
    expect(hasPermission('org_admin', 'manage:org')).toBe(true);
    expect(hasPermission('org_admin', 'manage:users')).toBe(true);
    expect(hasPermission('org_admin', 'finance:approve_payment')).toBe(true);
    expect(hasPermission('org_admin', 'exceptions:approve_ai')).toBe(true);
  });

  it('Operations Manager can plan shipments and approve AI exceptions but cannot manage org users', () => {
    expect(hasPermission('operations_manager', 'shipments:plan')).toBe(true);
    expect(hasPermission('operations_manager', 'exceptions:approve_ai')).toBe(true);
    expect(hasPermission('operations_manager', 'manage:users')).toBe(false);
  });

  it('Senior Dispatcher can simulate tracking and dispatch loads', () => {
    expect(hasPermission('dispatcher', 'tracking:simulate')).toBe(true);
    expect(hasPermission('dispatcher', 'shipments:dispatch')).toBe(true);
    expect(hasPermission('dispatcher', 'finance:approve_payment')).toBe(false);
  });

  it('Finance Manager can reconcile invoices and approve disbursements', () => {
    expect(hasPermission('finance_manager', 'finance:reconcile')).toBe(true);
    expect(hasPermission('finance_manager', 'finance:approve_payment')).toBe(true);
    expect(hasPermission('finance_manager', 'shipments:dispatch')).toBe(false);
  });

  it('Carrier User has restricted access only to tracking and documents', () => {
    expect(hasPermission('carrier_user', 'documents:upload')).toBe(true);
    expect(hasPermission('carrier_user', 'shipments:plan')).toBe(false);
    expect(hasPermission('carrier_user', 'finance:reconcile')).toBe(false);
  });
});
