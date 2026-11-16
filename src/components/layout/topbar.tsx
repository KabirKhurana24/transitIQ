'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  Sparkles,
  Plus,
  Play,
  Building2,
  LogOut,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';

interface TopbarProps {
  onOpenOrderModal?: () => void;
  onOpenSimulatorModal?: () => void;
}

export function Topbar({ onOpenOrderModal, onOpenSimulatorModal }: TopbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // In demo mode or if Supabase isn't configured, continue logout
    }
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur-xs">
      {/* Left: Organization context & Simulation badge */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-900">Apex Distribution India</span>
            <span className="text-[10px] text-slate-500 block leading-none">GST: 27AAACA1234F1Z8</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] text-emerald-700 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Simulated Fleet Data (India Corridors)</span>
        </div>
      </div>

      {/* Right: Actions, Notifications, Search, Profile */}
      <div className="flex items-center gap-3">
        {onOpenSimulatorModal && (
          <Button
            size="sm"
            variant="outline"
            onClick={onOpenSimulatorModal}
            className="hidden sm:inline-flex items-center gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <Play className="h-3.5 w-3.5 text-blue-600 fill-blue-600" />
            <span>Simulate Event</span>
          </Button>
        )}

        {onOpenOrderModal && (
          <Button
            size="sm"
            onClick={onOpenOrderModal}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Order</span>
          </Button>
        )}

        <Link href="/copilot">
          <Button
            size="sm"
            variant="outline"
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 hidden lg:inline-flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>AI Copilot</span>
          </Button>
        </Link>

        {/* Notification Bell */}
        <Link href="/exceptions">
          <button
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
            title="Exceptions & Alerts"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-rose-500" />
          </button>
        </Link>

        {/* Documentation Link */}
        <Link href="/docs">
          <button
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
            title="System Documentation & PRD"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
          title="Sign out of TransitIQ"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
