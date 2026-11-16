import React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { ShipmentPlanner } from '@/components/shipments/shipment-planner';

export const metadata = {
  title: 'Shipment Planning & Load Builder | TransitIQ TMS',
  description: 'AI Load Consolidation and Carrier Procurement Planning',
};

export default function PlanningPage() {
  return (
    <AppShell>
      <ShipmentPlanner />
    </AppShell>
  );
}
