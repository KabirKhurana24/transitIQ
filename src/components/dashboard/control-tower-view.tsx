'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Truck,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Activity,
  Filter,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { tmsRepository } from '@/lib/services/tms-service';

export function ControlTowerView() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState('30d');
  const [carrierFilter, setCarrierFilter] = useState('all');

  const stats = tmsRepository.getKPIStats();
  const shipments = tmsRepository.getShipments();
  const carriers = tmsRepository.getCarriers();
  const exceptions = tmsRepository.getExceptions().filter((e) => e.status !== 'resolved').slice(0, 5);
  const activityLogs = tmsRepository.getActivityLogs().slice(0, 6);

  // Status Distribution Data for Recharts
  const statusCounts = {
    Delivered: stats.deliveredShipments,
    'In Transit': shipments.filter((s) => s.status === 'in_transit').length,
    Dispatched: shipments.filter((s) => s.status === 'dispatched').length,
    'At Risk': stats.atRiskShipments,
    Delayed: stats.delayedShipments,
    Planned: shipments.filter((s) => s.status === 'planned' || s.status === 'carrier_assigned').length,
  };

  const statusPieData = [
    { name: 'Delivered', value: statusCounts.Delivered, color: '#10b981' },
    { name: 'In Transit', value: statusCounts['In Transit'], color: '#3b82f6' },
    { name: 'Dispatched', value: statusCounts.Dispatched, color: '#6366f1' },
    { name: 'Planned', value: statusCounts.Planned, color: '#8b5cf6' },
    { name: 'At Risk', value: statusCounts['At Risk'], color: '#f59e0b' },
    { name: 'Delayed', value: statusCounts.Delayed, color: '#ef4444' },
  ];

  // Freight Expenditure & Dispatch Trends
  const trendData = [
    { month: 'Oct Week 1', spend: 280000, dispatches: 14, otp: 96.2 },
    { month: 'Oct Week 2', spend: 340000, dispatches: 18, otp: 95.5 },
    { month: 'Oct Week 3', spend: 310000, dispatches: 16, otp: 94.8 },
    { month: 'Oct Week 4', spend: 390000, dispatches: 21, otp: 93.9 },
    { month: 'Nov Week 1', spend: 420000, dispatches: 23, otp: 94.6 },
    { month: 'Nov Week 2', spend: 465000, dispatches: 26, otp: stats.onTimeDeliveryRate },
  ];

  // Daily Dispatch Trend (last 7 days)
  const dailyDispatchData = [
    { day: 'Mon', count: 6, delayed: 0 },
    { day: 'Tue', count: 8, delayed: 1 },
    { day: 'Wed', count: 11, delayed: 1 },
    { day: 'Thu', count: 9, delayed: 2 },
    { day: 'Fri', count: 12, delayed: 0 },
    { day: 'Sat', count: 7, delayed: 1 },
    { day: 'Sun', count: 5, delayed: 1 },
  ];

  // Top Carrier Leaderboard
  const carrierLeaderboard = [...carriers]
    .sort((a, b) => b.on_time_percentage - a.on_time_percentage)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Transportation Control Tower
            </h1>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Live Fleet Hub
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time multi-corridor transportation operations, SLA telemetry, and predictive risk monitoring.
          </p>
        </div>

        {/* Global Control Filters */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1 shadow-2xs">
            <Calendar className="h-4 w-4 text-slate-400 ml-2 mr-1" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="text-xs bg-transparent border-0 text-slate-700 focus:outline-none pr-2 cursor-pointer font-medium"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days (MTD)</option>
              <option value="90d">Quarter to Date (QTD)</option>
              <option value="ytd">Year to Date (YTD)</option>
            </select>
          </div>

          <Link href="/copilot">
            <Button
              size="sm"
              className="bg-slate-900 hover:bg-slate-800 text-white shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span>Ask Operations Copilot</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid (Clickable to Filtered Views) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Shipments */}
        <div
          onClick={() => router.push('/shipments?status=all')}
          className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Loads</span>
            <Truck className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{stats.totalShipments}</span>
            <span className="text-[11px] text-emerald-600 font-medium">+14% MoM</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Contracted freight</p>
        </div>

        {/* Active Shipments */}
        <div
          onClick={() => router.push('/shipments?status=in_transit')}
          className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active In-Transit</span>
            <Activity className="h-4 w-4 text-blue-500 group-hover:text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-600">{stats.activeShipments}</span>
            <span className="text-[11px] text-slate-500">Live vehicles</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Dispatched on highway</p>
        </div>

        {/* Delivered Shipments */}
        <div
          onClick={() => router.push('/shipments?status=delivered')}
          className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Delivered</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500 group-hover:text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600">{stats.deliveredShipments}</span>
            <span className="text-[11px] text-emerald-600 font-medium">98.2% OTIF</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">POD confirmed</p>
        </div>

        {/* At-Risk Shipments */}
        <div
          onClick={() => router.push('/shipments?status=at_risk')}
          className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">At Risk</span>
            <AlertTriangle className="h-4 w-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-700">{stats.atRiskShipments}</span>
            <span className="text-[11px] text-amber-700 font-semibold">AI Alert</span>
          </div>
          <p className="text-[11px] text-amber-700/80 mt-1">Traffic / SLA danger</p>
        </div>

        {/* Delayed Shipments */}
        <div
          onClick={() => router.push('/shipments?status=delayed')}
          className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 shadow-xs hover:border-rose-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">Delayed</span>
            <Clock className="h-4 w-4 text-rose-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-700">{stats.delayedShipments}</span>
            <span className="text-[11px] text-rose-700 font-semibold">Critical</span>
          </div>
          <p className="text-[11px] text-rose-700/80 mt-1">Breakdown / missed dock</p>
        </div>

        {/* Freight Expenditure Total */}
        <div
          onClick={() => router.push('/finance')}
          className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Freight Spend</span>
            <IndianRupee className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-900 truncate">
              ₹{(stats.freightExpenditureTotalInr / 100000).toFixed(1)}L
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Audited rate: ₹43.8/km</p>
        </div>
      </div>

      {/* Primary Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Freight Spend & Dispatch Volume Trends (Area Chart) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Freight Expenditure & Dispatch Growth</CardTitle>
              <CardDescription>Linehaul spend (₹ INR) vs weekly consignment dispatch count</CardDescription>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              MTD Total: ₹{(stats.freightExpenditureTotalInr).toLocaleString('en-IN')}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => `₹${v / 1000}k`}
                  />
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      name === 'spend' ? `₹${Number(value).toLocaleString('en-IN')}` : value,
                      name === 'spend' ? 'Freight Spend' : 'Dispatches',
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="spend"
                    stroke="#2563eb"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#spendGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Shipment Status Distribution (Pie / Donut Chart) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Shipment Lifecycle Status</CardTitle>
            <CardDescription>Live breakdown across active logistics states</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${v} Loads`, 'Volume']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-100 text-xs">
              {statusPieData.map((item) => (
                <div key={item.name} className="flex flex-col">
                  <span className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="truncate">{item.name}</span>
                  </span>
                  <span className="font-semibold text-slate-900 ml-3.5">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Operational Row: Carrier Leaderboard & Live Exception Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Carrier Reliability Leaderboard */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">Carrier Performance Leaderboard</CardTitle>
              <CardDescription>Audited on-time delivery percentage & SLA delay statistics</CardDescription>
            </div>
            <Link href="/carriers">
              <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700">
                All 12 Carriers <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {carrierLeaderboard.map((carrier, index) => (
              <div
                key={carrier.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-slate-700 font-bold text-xs">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{carrier.name}</p>
                    <p className="text-xs text-slate-500">
                      {carrier.total_shipments_completed} loads completed • {carrier.serviceable_lanes_count} corridors
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="text-sm font-bold text-emerald-600">{carrier.on_time_percentage}%</span>
                    <span className="text-xs text-slate-400">OTP</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Avg delay: {carrier.avg_delay_hours} hrs</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* High-Impact Shipment Exceptions & AI Prescriptions */}
        <Card className="border-amber-200/80 bg-amber-50/20">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-semibold text-slate-900">
                  Critical Exceptions & AI Actions
                </CardTitle>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold border border-rose-200">
                  {exceptions.length} Urgent
                </span>
              </div>
              <CardDescription>Predictive risk alerts requiring operational review</CardDescription>
            </div>
            <Link href="/exceptions">
              <Button variant="ghost" size="sm" className="text-xs text-amber-700 hover:text-amber-800">
                View All Exceptions <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {exceptions.map((exc) => (
              <div
                key={exc.id}
                className="p-3.5 rounded-lg border border-slate-200 bg-white shadow-2xs hover:border-blue-400 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900 truncate max-w-[240px]">
                    {exc.title}
                  </span>
                  <StatusBadge status={exc.severity} />
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{exc.description}</p>
                {exc.ai_recommendation && (
                  <div className="p-2 rounded bg-blue-50/80 border border-blue-200/60 text-[11px] text-blue-900 flex items-start gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-blue-700">Recommended AI Action: </span>
                      <span>{exc.ai_recommendation.recommended_action}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Operational Activity Stream */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Live Operational Audit Trail</CardTitle>
          <CardDescription>Real-time system events, carrier dispatches, and manager decisions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100">
            {activityLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                  <div>
                    <span className="font-semibold text-slate-800">{log.action}</span>
                    <span className="text-slate-400 ml-2">({log.entity_type} {log.entity_id})</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <span>{log.user_name}</span>
                  <span>{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
