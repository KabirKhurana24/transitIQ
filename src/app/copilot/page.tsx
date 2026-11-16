import React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { CopilotView } from '@/components/copilot/copilot-view';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ query?: string }>;
}

export const metadata = {
  title: 'AI Operations Copilot | TransitIQ TMS',
  description: 'Conversational Transportation Decision Intelligence Grounded in Live Data',
};

export default async function CopilotPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  return (
    <AppShell>
      <CopilotView initialQuery={resolvedParams?.query} />
    </AppShell>
  );
}
