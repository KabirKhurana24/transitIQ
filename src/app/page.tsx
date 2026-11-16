import React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { ControlTowerView } from '@/components/dashboard/control-tower-view';

export default function RootPage() {
  return (
    <AppShell>
      <ControlTowerView />
    </AppShell>
  );
}
