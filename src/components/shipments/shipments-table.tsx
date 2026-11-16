'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  Search,
  Filter,
  ArrowRight,
  AlertTriangle,
  Play,
  CheckCircle2,
  Send,
  Eye,
  FileText,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { StatusBadge, Badge } from '@/components/ui/badge';
import { tmsRepository } from '@/lib/services/tms-service';
import { SimulateTrackingDialog } from '@/components/tracking/simulate-tracking-dialog';

interface ShipmentsTableProps {
  initialStatus?: string;
}

export function ShipmentsTable({ initialStatus = 'all' }: ShipmentsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [carrierFilter, setCarrierFilter] = useState('all');
  const [simulateOpen, setSimulateOpen] = useState(false);
  const [targetShipmentId, setTargetShipmentId] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const shipments = tmsRepository.getShipments({
    search: searchTerm,
    status: statusFilter,
    carrierId: carrierFilter,
  });

  const carriers = tmsRepository.getCarriers();

  const handleSimulate = (shipmentId: string) => {
    setTargetShipmentId(shipmentId);
    setSimulateOpen(true);
  };

  const handleDispatch = (shipmentId: string) => {
    tmsRepository.dispatchShipment(shipmentId);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Shipment Fleet Operations</h1>
          <p className="text-sm text-slate-500 mt-1">
            End-to-end multi-corridor transit tracking, predictive risk monitoring, and telematics simulation.
          </p>
        </div>

        <Link href="/planning">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-xs">
            Plan New Load
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search shipment #, tracking #, carrier, route..."
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
            >
              <option value="all">All States ({shipments.length})</option>
              <option value="dispatched">Dispatched</option>
              <option value="in_transit">In Transit</option>
              <option value="at_risk">At Risk (AI Flagged)</option>
              <option value="delayed">Delayed</option>
              <option value="delivered">Delivered</option>
              <option value="planned">Planned</option>
            </select>

            {/* Carrier Filter */}
            <select
              value={carrierFilter}
              onChange={(e) => setCarrierFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
            >
              <option value="all">All Carriers</option>
              {carriers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Shipments Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shipment #</TableHead>
                <TableHead>Corridor (Route)</TableHead>
                <TableHead>Carrier & Vehicle</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Weight / Vol</TableHead>
                <TableHead>Freight (INR)</TableHead>
                <TableHead>Est. Delivery</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-slate-400">
                    No shipments found matching criteria.
                  </TableCell>
                </TableRow>
              ) : (
                shipments.slice(0, 30).map((shp) => (
                  <TableRow key={shp.id} className="hover:bg-slate-50/70">
                    <TableCell>
                      <Link
                        href={`/shipments/${shp.id}`}
                        className="font-mono font-semibold text-blue-600 hover:underline text-xs flex items-center gap-1"
                      >
                        {shp.shipment_number}
                      </Link>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {shp.tracking_number}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                        <span>{shp.origin_city}</span>
                        <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />
                        <span>{shp.destination_city}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs font-medium text-slate-900">
                        {shp.carrier_name || 'Unassigned'}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {shp.vehicle_registration || shp.vehicle_type}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`h-2.5 w-2.5 rounded-full ${
                            shp.risk_score >= 80
                              ? 'bg-rose-500'
                              : shp.risk_score >= 50
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                        <span className="text-xs font-bold text-slate-800">{shp.risk_score}</span>
                        <span className="text-[10px] uppercase text-slate-400 font-semibold">
                          ({shp.risk_level})
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs font-medium text-slate-800">
                        {shp.total_weight_kg.toLocaleString('en-IN')} kg
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {shp.total_volume_cbm} CBM
                      </div>
                    </TableCell>

                    <TableCell className="font-mono text-xs font-semibold text-slate-900">
                      ₹{shp.agreed_freight_rate_inr.toLocaleString('en-IN')}
                    </TableCell>

                    <TableCell>
                      <div className="text-xs text-slate-700">
                        {new Date(shp.estimated_delivery_at).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(shp.estimated_delivery_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={shp.status} />
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {shp.status === 'carrier_assigned' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDispatch(shp.id)}
                            className="text-xs border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                          >
                            <Send className="h-3 w-3 mr-1" />
                            Dispatch
                          </Button>
                        )}

                        {['dispatched', 'in_transit', 'at_risk', 'delayed'].includes(shp.status) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSimulate(shp.id)}
                            className="text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
                            title="Simulate Checkpoint or Delay"
                          >
                            <Play className="h-3 w-3 mr-1 fill-blue-600 text-blue-600" />
                            Simulate
                          </Button>
                        )}

                        <Link href={`/shipments/${shp.id}`}>
                          <Button size="sm" variant="ghost" className="text-xs text-slate-600 hover:text-slate-900">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <SimulateTrackingDialog
        open={simulateOpen}
        onOpenChange={setSimulateOpen}
        shipmentId={targetShipmentId}
        onEventSimulated={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
}
