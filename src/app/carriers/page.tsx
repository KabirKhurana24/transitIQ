import React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { CarriersView } from '@/components/carriers/carriers-view';

export const metadata = {
  title: 'Carrier Procurement & Network | TransitIQ TMS',
  description: 'AI-Powered Carrier Scoring and Multi-Criteria Procurement Engine',
};

export default function CarriersPage() {
  return (
    <AppShell>
      <CarriersView />
    </AppShell>
  );
}
