import React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { ShipmentsTable } from '@/components/shipments/shipments-table';

export const metadata = {
  title: 'Shipments & Fleet Operations | TransitIQ TMS',
  description: 'Live Shipment Tracking and Exception Monitoring',
};

export default function ShipmentsPage() {
  return (
    <AppShell>
      <ShipmentsTable />
    </AppShell>
  );
}
