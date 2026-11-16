import React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { OrdersView } from '@/components/orders/orders-table';

export const metadata = {
  title: 'Order Management | TransitIQ TMS',
  description: 'Enterprise Transportation Orders and Consignment Queue',
};

export default function OrdersPage() {
  return (
    <AppShell>
      <OrdersView />
    </AppShell>
  );
}
