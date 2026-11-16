import React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { ControlTowerView } from '@/components/dashboard/control-tower-view';

export const metadata = {
  title: 'Transportation Control Tower | TransitIQ TMS',
  description: 'AI-First Transportation Management System Dashboard',
};

export default function DashboardPage() {
  return (
    <AppShell>
      <ControlTowerView />
    </AppShell>
  );
}
