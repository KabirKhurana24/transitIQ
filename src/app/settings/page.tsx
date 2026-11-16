import React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { SettingsView } from '@/components/settings/settings-view';

export const metadata = {
  title: 'Organization Settings & Access Control | TransitIQ TMS',
  description: 'Role-Based Access Control, Approvals Queue and Multi-Tenant Setup',
};

export default function SettingsPage() {
  return (
    <AppShell>
      <SettingsView />
    </AppShell>
  );
}
