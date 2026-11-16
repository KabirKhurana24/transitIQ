import React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { ExceptionManagerView } from '@/components/exceptions/exception-manager-view';

export const metadata = {
  title: 'AI Exception Manager | TransitIQ TMS',
  description: 'AI-First Transportation Exception Detection and Recommendation Engine',
};

export default function ExceptionsPage() {
  return (
    <AppShell>
      <ExceptionManagerView />
    </AppShell>
  );
}
