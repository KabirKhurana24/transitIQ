'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Truck,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  ShieldCheck,
  AlertTriangle,
  Play,
  FileText,
  Package,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { tmsRepository } from '@/lib/services/tms-service';
import { SimulateTrackingDialog } from '@/components/tracking/simulate-tracking-dialog';

interface ShipmentDetailViewProps {
  shipmentId: string;
}

export function ShipmentDetailView({ shipmentId }: ShipmentDetailViewProps) {
  const router = useRouter();
  const [simulateOpen, setSimulateOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const shipment = tmsRepository.getShipmentById(shipmentId);

  if (!shipment) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Shipment Not Found</h2>
        <p className="text-slate-500">The requested shipment ID does not exist in the database.</p>
        <Link href="/shipments">
          <Button variant="outline">Back to Shipments</Button>
        </Link>
      </div>
    );
  }

  const handleResolveException = (exceptionId: string) => {
    tmsRepository.resolveException(exceptionId, 'approve_recommendation', 'Approved by Operations Manager');
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-6">
      {/* Back button & Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/shipments">
            <Button variant="outline" size="sm" className="h-9 w-9 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-mono tracking-tight text-slate-900">
                {shipment.shipment_number}
              </h1>
              <StatusBadge status={shipment.status} />
              <Badge variant="outline" className="font-mono text-xs">
                {shipment.tracking_number}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Corridor: <span className="font-semibold text-slate-800">{shipment.origin_city} → {shipment.destination_city}</span> • Created on {new Date(shipment.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {['dispatched', 'in_transit', 'at_risk', 'delayed'].includes(shipment.status) && (
            <Button
              onClick={() => setSimulateOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              <span>Simulate Tracking Event</span>
            </Button>
          )}

          <Link href={`/copilot?query=Why is shipment ${shipment.shipment_number} delayed?`}>
            <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Ask Copilot About Load</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Risk Alert Banner if At Risk or Delayed */}
      {shipment.risk_score >= 50 && (
        <Card className={`border-l-4 ${shipment.risk_score >= 80 ? 'border-l-rose-500 bg-rose-50/30 border-rose-200' : 'border-l-amber-500 bg-amber-50/30 border-amber-200'}`}>
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className={`h-5 w-5 shrink-0 ${shipment.risk_score >= 80 ? 'text-rose-600' : 'text-amber-600'}`} />
            <div className="flex-1 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span>AI Risk Assessment: Risk Score {shipment.risk_score}/100 ({shipment.risk_level.toUpperCase()})</span>
              </div>
              <p className="text-slate-600 mt-1">
                Telemetry indicates active delays or mechanical exceptions. Review recommended AI actions below to prevent breach of SLA.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid: Left Column (Route, Carrier, Cargo) & Right Column (Tracking Timeline & Exceptions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Shipment Specs & Master Entities (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Route & Schedule */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Corridor & Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-3 w-3 rounded-full bg-blue-600 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-800">Origin Loading Facility</span>
                  <p className="text-slate-600">{shipment.origin_city} Hub</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Pickup Scheduled: {new Date(shipment.scheduled_pickup_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                  {shipment.actual_pickup_at && (
                    <p className="text-[11px] text-emerald-600 font-medium">
                      Departed: {new Date(shipment.actual_pickup_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                <div className="mt-1 h-3 w-3 rounded-full bg-emerald-600 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-800">Destination Delivery Facility</span>
                  <p className="text-slate-600">{shipment.destination_city} Central Dock</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Estimated Delivery: {new Date(shipment.estimated_delivery_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                  {shipment.actual_delivery_at && (
                    <p className="text-[11px] text-emerald-600 font-bold">
                      Delivered: {new Date(shipment.actual_delivery_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carrier & Vehicle Assigned */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Carrier & Fleet Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-slate-500">Transporter / Carrier</span>
                <span className="font-bold text-slate-900">{shipment.carrier_name || 'Unassigned'}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-slate-500">Vehicle Registration</span>
                <span className="font-mono font-semibold text-blue-600">
                  {shipment.vehicle_registration || 'Dedicated Fleet Pending'}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-slate-500">Vehicle Category</span>
                <span className="font-medium text-slate-800">{shipment.vehicle_type}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-slate-500">Assigned Dispatcher</span>
                <span className="font-medium text-slate-800">{shipment.dispatcher_name || 'Amit Patel'}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Agreed Linehaul Rate</span>
                <span className="font-mono font-bold text-slate-900">
                  ₹{shipment.agreed_freight_rate_inr.toLocaleString('en-IN')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Linked Order & Cargo Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Consignment Specs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Consolidated Orders</span>
                <span className="font-mono font-medium text-slate-800">
                  {shipment.orders.map((o) => o.order_number).join(', ') || 'ORD-5001'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Gross Weight</span>
                <span className="font-bold text-slate-900">{shipment.total_weight_kg.toLocaleString('en-IN')} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Volumetric Payload</span>
                <span className="font-medium text-slate-800">{shipment.total_volume_cbm} CBM</span>
              </div>
            </CardContent>
          </Card>

          {/* Associated Documents */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Freight Documents & POD</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {shipment.documents.length === 0 ? (
                <p className="text-slate-400">No documents uploaded for this consignment yet.</p>
              ) : (
                shipment.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <div>
                        <span className="font-medium text-slate-900 block truncate max-w-[180px]">{doc.file_name}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-mono">{doc.document_type.replace('_', ' ')}</span>
                      </div>
                    </div>
                    {doc.verified ? (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                        <CheckCircle2 className="h-3 w-3" /> Verified
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-600 font-medium">Pending Audit</span>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Interactive Tracking Timeline & AI Exception Manager (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Exceptions & AI Recommendations for this shipment */}
          {shipment.exceptions.length > 0 && (
            <Card className="border-amber-300 bg-amber-50/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <CardTitle className="text-sm font-bold text-slate-900">
                    Operational Exceptions ({shipment.exceptions.length})
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {shipment.exceptions.map((exc) => (
                  <div key={exc.id} className="p-3.5 rounded-lg border border-slate-200 bg-white shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{exc.title}</span>
                      <StatusBadge status={exc.severity} />
                    </div>
                    <p className="text-xs text-slate-600">{exc.description}</p>

                    {exc.ai_recommendation && (
                      <div className="p-3 rounded bg-blue-50 border border-blue-200 text-xs space-y-2">
                        <div className="flex items-center justify-between text-blue-900 font-bold">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                            <span>Prescribed AI Corrective Action</span>
                          </span>
                          <span className="text-[10px] font-mono text-blue-700">
                            Confidence: {Math.round(exc.ai_recommendation.confidence_level * 100)}%
                          </span>
                        </div>
                        <p className="text-blue-900 font-medium">
                          {exc.ai_recommendation.recommended_action}
                        </p>
                        <p className="text-[11px] text-blue-800">
                          <strong>Expected Outcome: </strong> {exc.ai_recommendation.expected_outcome}
                        </p>

                        {exc.status !== 'resolved' && (
                          <div className="pt-2 flex justify-end gap-2 border-t border-blue-200">
                            <Button
                              size="sm"
                              onClick={() => handleResolveException(exc.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7 px-3"
                            >
                              Approve & Execute Action
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Telematics Checkpoint Timeline */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm font-semibold">Live Telemetry & Checkpoint History</CardTitle>
                <CardDescription>
                  Automated FASTag toll stamps, GPS geofences, and road milestones
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-600">
                {shipment.trackingEvents.length} Recorded Pings
              </Badge>
            </CardHeader>
            <CardContent>
              {shipment.trackingEvents.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No tracking events recorded yet. Click "Simulate Tracking Event" above to inject milestone pings.
                </div>
              ) : (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {shipment.trackingEvents.map((ev, index) => {
                    const isLatest = index === shipment.trackingEvents.length - 1;
                    return (
                      <div key={ev.id} className="relative group">
                        {/* Dot */}
                        <div
                          className={`absolute -left-[23px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white ${
                            ev.event_type === 'delivered'
                              ? 'bg-emerald-600 ring-2 ring-emerald-200'
                              : ev.event_type === 'breakdown_reported'
                              ? 'bg-rose-600 ring-2 ring-rose-200'
                              : ev.event_type === 'delay_reported'
                              ? 'bg-amber-600 ring-2 ring-amber-200'
                              : 'bg-blue-600'
                          }`}
                        />

                        <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-2xs transition-all space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                              <span>{ev.location_name}</span>
                              <span className="text-[10px] font-normal text-slate-400">({ev.city})</span>
                            </div>
                            <span className="text-[11px] font-mono text-slate-400">
                              {new Date(ev.event_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <p className="text-xs text-slate-700">{ev.description}</p>

                          <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-mono">
                            <span>Event: {ev.event_type.replace('_', ' ').toUpperCase()}</span>
                            {ev.is_simulated && (
                              <span className="text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                                SIMULATED TELEMETRY
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <SimulateTrackingDialog
        open={simulateOpen}
        onOpenChange={setSimulateOpen}
        shipmentId={shipment.id}
        onEventSimulated={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
}
