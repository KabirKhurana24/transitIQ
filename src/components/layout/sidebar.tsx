'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Truck,
  Route,
  Users,
  AlertTriangle,
  Bot,
  Receipt,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  LogOut,
  Building2,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  currentRole?: string;
  onRoleChange?: (newRole: string) => void;
}

export function Sidebar({ currentRole = 'operations_manager', onRoleChange }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Orders', href: '/orders', icon: Package, badge: '80' },
    { name: 'Shipments', href: '/shipments', icon: Truck, badge: '70' },
    { name: 'Shipment Planning', href: '/planning', icon: Route },
    { name: 'Carriers', href: '/carriers', icon: Users },
    {
      name: 'Exceptions',
      href: '/exceptions',
      icon: AlertTriangle,
      badge: '20',
      badgeVariant: 'danger',
    },
    {
      name: 'AI Copilot',
      href: '/copilot',
      icon: Bot,
      highlight: true,
    },
    { name: 'Freight & Finance', href: '/finance', icon: Receipt },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-slate-800 bg-slate-950 text-slate-200 transition-all duration-300 z-30 select-none min-h-screen',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800/80">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white">TransitIQ</span>
                <span className="text-[10px] font-semibold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.2 rounded">
                  TMS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[140px]">Apex Distribution IN</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
            <Truck className="h-5 w-5" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Demo Simulation Alert */}
      {!collapsed && (
        <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-blue-950/40 border border-blue-800/50 text-[11px] text-blue-300">
          <div className="flex items-center gap-1.5 font-medium mb-0.5 text-blue-200">
            <Sparkles className="h-3 w-3 text-blue-400" />
            <span>AI Operations Active</span>
          </div>
          <p className="text-slate-400 leading-tight">Indian Freight Corridor Demo • INR Simulation</p>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors cursor-pointer relative',
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100',
                item.highlight && !isActive && 'border border-blue-500/30 text-blue-300 bg-blue-950/20'
              )}
              title={collapsed ? item.name : undefined}
            >
              <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200')} />
              {!collapsed && (
                <div className="flex flex-1 items-center justify-between truncate">
                  <span className="truncate">{item.name}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        'ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeVariant === 'danger'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-300'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && (
                    <span className="ml-auto flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Role Profile & Switcher Footer */}
      <div className="border-t border-slate-800 p-3 bg-slate-950/80">
        {!collapsed ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Active Role</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                Connected
              </span>
            </div>

            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                  {currentRole.slice(0, 2).toUpperCase()}
                </div>
                <div className="truncate">
                  <p className="text-xs font-medium text-white truncate">
                    {currentRole === 'org_admin' && 'Rajesh Verma (Admin)'}
                    {currentRole === 'operations_manager' && 'Priya Sharma (Ops)'}
                    {currentRole === 'dispatcher' && 'Amit Patel (Dispatch)'}
                    {currentRole === 'finance_manager' && 'Sunita Rao (Finance)'}
                    {currentRole === 'carrier_user' && 'Vikram Singh (TCI)'}
                  </p>
                  <p className="text-[10px] text-slate-400 capitalize">{currentRole.replace('_', ' ')}</p>
                </div>
              </div>
            </div>

            {onRoleChange && (
              <div className="flex gap-1 pt-1">
                <select
                  value={currentRole}
                  onChange={(e) => onRoleChange(e.target.value)}
                  className="w-full text-[11px] bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300 focus:outline-none focus:border-blue-500"
                >
                  <option value="org_admin">Role: Org Admin</option>
                  <option value="operations_manager">Role: Operations Manager</option>
                  <option value="dispatcher">Role: Senior Dispatcher</option>
                  <option value="finance_manager">Role: Finance Manager</option>
                  <option value="carrier_user">Role: Carrier Partner</option>
                </select>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs" title={`Active: ${currentRole}`}>
              {currentRole.slice(0, 1).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
