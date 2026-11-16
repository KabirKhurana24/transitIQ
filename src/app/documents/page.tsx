import React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { DocumentsView } from '@/components/documents/documents-view';

export const metadata = {
  title: 'Document Center & POD Vault | TransitIQ TMS',
  description: 'Freight Documentation, Proof of Delivery and E-Way Bill Management',
};

export default function DocumentsPage() {
  return (
    <AppShell>
      <DocumentsView />
    </AppShell>
  );
}
