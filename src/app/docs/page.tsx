import React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { DocsBrowser } from '@/components/docs/docs-browser';

export const metadata = {
  title: 'Product Documentation & PRD Vault | TransitIQ TMS',
  description: 'Product Requirements Document, Architecture, Database Schema, and AI Design',
};

export default function DocsPage() {
  return (
    <AppShell>
      <DocsBrowser />
    </AppShell>
  );
}
