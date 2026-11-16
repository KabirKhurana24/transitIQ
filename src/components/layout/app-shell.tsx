'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { CreateOrderDialog } from '@/components/orders/create-order-dialog';
import { SimulateTrackingDialog } from '@/components/tracking/simulate-tracking-dialog';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [currentRole, setCurrentRole] = useState('operations_manager');
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [simulatorModalOpen, setSimulatorModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar currentRole={currentRole} onRoleChange={setCurrentRole} />

      {/* Main Content Layout */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Topbar
          onOpenOrderModal={() => setOrderModalOpen(true)}
          onOpenSimulatorModal={() => setSimulatorModalOpen(true)}
        />

        <main key={refreshKey} className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <CreateOrderDialog
        open={orderModalOpen}
        onOpenChange={setOrderModalOpen}
        onOrderCreated={handleRefresh}
      />

      <SimulateTrackingDialog
        open={simulatorModalOpen}
        onOpenChange={setSimulatorModalOpen}
        onEventSimulated={handleRefresh}
      />
    </div>
  );
}
