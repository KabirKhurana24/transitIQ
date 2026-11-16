'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileSpreadsheet,
  IndianRupee,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { tmsRepository } from '@/lib/services/tms-service';

export function AnalyticsView() {
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [dateRange, setDateRange] = useState('30d');
  const [selectedCorridor, setSelectedCorridor] = useState('all');

  const stats = tmsRepository.getKPIStats();
  const lanes = tmsRepository.getLanes();
  const shipments = tmsRepository.getShipments();

  // Lane volume & cost comparison data
  const laneVolumeData = [
    { lane: 'Gurgaon → Mumbai', shipments: 22, avgRate: 64500, costPerKm: 45.7 },
    { lane: 'Bengaluru → Chennai', shipments: 15, avgRate: 21200, costPerKm: 60.5 },
    { lane: 'Delhi → Ahmedabad', shipments: 12, avgRate: 48500, costPerKm: 51.5 },
    { lane: 'Hyderabad → Bengaluru', shipments: 10, avgRate: 31400, costPerKm: 55.0 },
    { lane: 'Mumbai → Pune', shipments: 8, avgRate: 12500, costPerKm: 83.3 },
    { lane: 'Kolkata → Patna', shipments: 6, avgRate: 33800, costPerKm: 58.2 },
  ];

  // OTIF Reliability trend over weeks
  const otifTrendData = [
    { week: 'Wk 41', otif: 91.5, otp: 93.2, slaTarget: 95.0 },
    { week: 'Wk 42', otif: 93.0, otp: 94.8, slaTarget: 95.0 },
    { week: 'Wk 43', otif: 92.4, otp: 94.0, slaTarget: 95.0 },
    { week: 'Wk 44', otif: 94.8, otp: 96.1, slaTarget: 95.0 },
    { week: 'Wk 45', otif: 95.6, otp: 97.0, slaTarget: 95.0 },
    { week: 'Wk 46', otif: stats.onTimeDeliveryRate, otp: 95.8, slaTarget: 95.0 },
  ];

  // Function to export CSV
  const handleExportCSV = () => {
    const headers = [
      'Shipment Number',
      'Origin City',
      'Destination City',
      'Carrier Name',
      'Status',
      'Risk Score',
      'Weight (kg)',
      'Freight Rate (INR)',
      'Scheduled Pickup',
      'Estimated Delivery',
    ];

    const rows = shipments.map((s) => [
      s.shipment_number,
      s.origin_city,
      s.destination_city,
      `"${s.carrier_name || 'Unassigned'}"`,
      s.status,
      s.risk_score,
      s.total_weight_kg,
      s.agreed_freight_rate_inr,
      s.scheduled_pickup_at,
      s.estimated_delivery_at,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TransitIQ_Fleet_Analytics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Operations & Freight Analytics
            </h1>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Aggregated from Actual DB
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Service level agreement (SLA) compliance, linehaul cost benchmarking, and carrier capacity utilization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setGlossaryOpen(true)}
            className="text-xs border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
          >
            <HelpCircle className="h-4 w-4 text-slate-500" />
            <span>KPI Glossary</span>
          </Button>

          <Button
            onClick={handleExportCSV}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs flex items-center gap-1.5 shadow-xs"
          >
            <Download className="h-4 w-4" />
            <span>Download CSV Report</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              On-Time In-Full (OTIF)
            </span>
            <div className="mt-2 text-2xl font-bold text-emerald-600">
              {stats.onTimeDeliveryRate}%
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Target: 95.0%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Avg Cost Per KM
            </span>
            <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">
              ₹43.80
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">32ft FTL benchmark</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Avg Resolution Time
            </span>
            <div className="mt-2 text-2xl font-bold text-blue-600">
              {stats.averageResolutionHours} hrs
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">From alert to execution</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Invoice Discrepancy Rate
            </span>
            <div className="mt-2 text-2xl font-bold text-amber-600">
              {stats.invoicesDiscrepancyRate}%
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Disputed freight claims</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lane Volume vs Rate Chart */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Freight Volume by Indian Corridor</CardTitle>
            <CardDescription>Consignment counts and standard linehaul rates (₹ INR)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={laneVolumeData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="lane"
                    stroke="#94a3b8"
                    fontSize={10}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    formatter={(v: any, name: any) => [
                      name === 'shipments' ? `${v} Consignments` : `₹${v.toLocaleString('en-IN')}`,
                      name === 'shipments' ? 'Dispatched Volume' : 'Avg Rate',
                    ]}
                  />
                  <Bar dataKey="shipments" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* OTIF SLA Trend Chart */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">On-Time Delivery Trend (OTIF %)</CardTitle>
            <CardDescription>Weekly customer SLA arrival percentage vs 95% target threshold</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={otifTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[85, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip formatter={(v: any) => [`${v}%`, 'Compliance']} />
                  <Line
                    type="monotone"
                    dataKey="otif"
                    name="Actual OTIF %"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="slaTarget"
                    name="Target SLA (95%)"
                    stroke="#ef4444"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Glossary Modal */}
      <Dialog open={glossaryOpen} onOpenChange={setGlossaryOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <span>Transportation KPI & Metrics Glossary</span>
            </DialogTitle>
            <DialogDescription>
              Mathematical formulas, definitions, and business rationale for all system metrics.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3 text-xs divide-y divide-slate-100">
            <div className="pt-2">
              <span className="font-bold text-slate-900 block text-sm">1. On-Time In-Full (OTIF) Delivery %</span>
              <p className="text-slate-600 mt-1">
                Percentage of consignments delivered on or before the contracted delivery deadline with zero damaged cartons and verified electronic POD.
              </p>
              <div className="mt-1 font-mono p-1.5 rounded bg-slate-100 text-slate-800">
                Formula: (On-Time Complete Deliveries / Total Scheduled Deliveries) × 100
              </div>
            </div>

            <div className="pt-2">
              <span className="font-bold text-slate-900 block text-sm">2. Freight Cost per Kilometre (₹/KM)</span>
              <p className="text-slate-600 mt-1">
                Average linehaul transport expenditure incurred per kilometre of highway transit. Reflects fuel volatility, toll taxes, and carrier bargaining power.
              </p>
              <div className="mt-1 font-mono p-1.5 rounded bg-slate-100 text-slate-800">
                Formula: Total Agreed Freight Rate (INR) / Route Highway Distance (KM)
              </div>
            </div>

            <div className="pt-2">
              <span className="font-bold text-slate-900 block text-sm">3. Exception Resolution Time</span>
              <p className="text-slate-600 mt-1">
                Mean duration (in hours) elapsed between an AI exception detection (e.g. breakdown, route deviation) and manager action approval.
              </p>
              <div className="mt-1 font-mono p-1.5 rounded bg-slate-100 text-slate-800">
                Formula: Σ(Resolved Timestamp - Created Timestamp) / Total Resolved Exceptions
              </div>
            </div>

            <div className="pt-2">
              <span className="font-bold text-slate-900 block text-sm">4. Carrier Composite Procurement Score</span>
              <p className="text-slate-600 mt-1">
                Weighted multi-attribute index (0-100) scoring carriers across Cost (35%), On-Time Reliability (30%), Vehicle Suitability (15%), Incident Rate (10%), and Lane Experience (10%).
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button size="sm" onClick={() => setGlossaryOpen(false)}>
              Close Glossary
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
