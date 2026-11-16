import React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { AnalyticsView } from '@/components/analytics/analytics-view';

export const metadata = {
  title: 'Operational & Freight Analytics | TransitIQ TMS',
  description: 'KPI Dashboard, OTIF Metrics and Freight Spend Analysis',
};

export default function AnalyticsPage() {
  return (
    <AppShell>
      <AnalyticsView />
    </AppShell>
  );
}
