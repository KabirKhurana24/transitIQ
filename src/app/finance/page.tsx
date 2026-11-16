import React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { FinanceView } from '@/components/finance/finance-view';

export const metadata = {
  title: 'Freight Audit & Finance Reconciliation | TransitIQ TMS',
  description: 'Automated 3-Way Freight Audit, Rate Card Reconciliation and Carrier Invoice Management',
};

export default function FinancePage() {
  return (
    <AppShell>
      <FinanceView />
    </AppShell>
  );
}
