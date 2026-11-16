import React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { ShipmentDetailView } from '@/components/shipments/shipment-detail-view';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ShipmentPage({ params }: PageProps) {
  const resolvedParams = await params;

  return (
    <AppShell>
      <ShipmentDetailView shipmentId={resolvedParams.id} />
    </AppShell>
  );
}
