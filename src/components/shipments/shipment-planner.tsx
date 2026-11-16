'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Route,
  CheckCircle2,
  AlertTriangle,
  Truck,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Layers,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { tmsRepository } from '@/lib/services/tms-service';
import { calculateCarrierScores } from '@/lib/services/carrier-scoring';

export function ShipmentPlanner() {
  const router = useRouter();
  const unplannedOrders = tmsRepository.getOrders({ status: 'confirmed' });
  const vehicles = tmsRepository.getVehicles().filter((v) => v.current_status === 'available');
  const carriers = tmsRepository.getCarriers();
  const lanes = tmsRepository.getLanes();

  // Selected orders for load consolidation
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>(
    unplannedOrders.length > 0 ? [unplannedOrders[0].id] : []
  );

  // Selected vehicle & carrier
  const [selectedVehicleId, setSelectedVehicleId] = useState(
    vehicles.length > 0 ? vehicles[0].id : ''
  );
  const [selectedCarrierId, setSelectedCarrierId] = useState(
    carriers.length > 0 ? carriers[0].id : ''
  );
  const [scheduledPickup, setScheduledPickup] = useState(
    new Date(Date.now() + 24 * 3600000).toISOString().slice(0, 16)
  );
  const [estimatedDelivery, setEstimatedDelivery] = useState(
    new Date(Date.now() + 72 * 3600000).toISOString().slice(0, 16)
  );
  const [overrideReason, setOverrideReason] = useState('');

  // Calculations
  const selectedOrders = unplannedOrders.filter((o) => selectedOrderIds.includes(o.id));
  const totalWeightKg = selectedOrders.reduce((sum, o) => sum + o.cargo_weight_kg, 0);
  const totalVolumeCbm = selectedOrders.reduce((sum, o) => sum + o.cargo_volume_cbm, 0);

  const vehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];
  const maxWeightKg = vehicle ? vehicle.max_weight_kg : 18500;
  const maxVolumeCbm = vehicle ? vehicle.max_volume_cbm : 68;

  const weightUtilization = Math.round((totalWeightKg / (maxWeightKg || 1)) * 100);
  const volumeUtilization = Math.round((totalVolumeCbm / (maxVolumeCbm || 1)) * 100);
  const isOverweight = totalWeightKg > maxWeightKg;
  const isOverVolume = totalVolumeCbm > maxVolumeCbm;

  // Selected corridor
  const primaryLane = selectedOrders.length > 0
    ? lanes.find(
        (l) =>
          l.origin_city.toLowerCase() === selectedOrders[0].origin_city.toLowerCase() &&
          l.destination_city.toLowerCase() === selectedOrders[0].destination_city.toLowerCase()
      ) || lanes[0]
    : lanes[0];

  // Carrier Recommendation Scores
  const carrierScores = calculateCarrierScores(
    carriers,
    primaryLane,
    totalWeightKg || 8000,
    totalVolumeCbm || 30,
    vehicle?.vehicle_type || '19ft Container',
    tmsRepository.getWeights()
  );

  const topCarrier = carrierScores[0];

  const toggleOrderSelection = (id: string) => {
    if (selectedOrderIds.includes(id)) {
      setSelectedOrderIds(selectedOrderIds.filter((item) => item !== id));
    } else {
      setSelectedOrderIds([...selectedOrderIds, id]);
    }
  };

  const handleConfirmPlan = () => {
    if (selectedOrderIds.length === 0) return;
    if (isOverweight || isOverVolume) {
      alert('Cannot confirm plan: Total load exceeds vehicle payload or volumetric limit!');
      return;
    }

    const carrierToAssign = selectedCarrierId || topCarrier?.carrier.id;
    const quote = carrierScores.find((c) => c.carrier.id === carrierToAssign)?.quoteAmountInr || primaryLane.standard_rate_inr;

    const plannedShipment = tmsRepository.planShipment({
      orderIds: selectedOrderIds,
      carrierId: carrierToAssign,
      vehicleId: selectedVehicleId,
      scheduledPickup: new Date(scheduledPickup).toISOString(),
      estimatedDelivery: new Date(estimatedDelivery).toISOString(),
      agreedRateInr: quote,
    });

    if (overrideReason) {
      tmsRepository.assignCarrier(plannedShipment.id, carrierToAssign, quote, overrideReason);
    }

    router.push('/shipments');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Shipment Planning & Load Builder</h1>
        <p className="text-sm text-slate-500 mt-1">
          Consolidate compatible customer orders into optimal truckloads, validate vehicle axle limits, and procure best-fit carriers.
        </p>
      </div>

      {/* Capacity & Load Consolidation Status Bar */}
      <Card className={isOverweight || isOverVolume ? 'border-red-400 bg-red-50/20' : 'border-blue-200 bg-blue-50/20'}>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-slate-900">Consolidated Load Summary</span>
                <Badge variant={isOverweight || isOverVolume ? 'danger' : 'info'}>
                  {selectedOrders.length} Order(s) Selected
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Route: <span className="font-semibold text-slate-800">{primaryLane.origin_city} → {primaryLane.destination_city}</span> ({primaryLane.distance_km} km)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-500">Weight Payload</span>
                  <span className={`font-semibold ${isOverweight ? 'text-red-600' : 'text-slate-800'}`}>
                    {totalWeightKg.toLocaleString('en-IN')} / {maxWeightKg.toLocaleString('en-IN')} kg ({weightUtilization}%)
                  </span>
                </div>
                <div className="w-40 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isOverweight ? 'bg-red-500' : 'bg-blue-600'}`}
                    style={{ width: `${Math.min(100, weightUtilization)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-500">Volumetric Fill</span>
                  <span className={`font-semibold ${isOverVolume ? 'text-red-600' : 'text-slate-800'}`}>
                    {totalVolumeCbm} / {maxVolumeCbm} CBM ({volumeUtilization}%)
                  </span>
                </div>
                <div className="w-40 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isOverVolume ? 'bg-red-500' : 'bg-indigo-600'}`}
                    style={{ width: `${Math.min(100, volumeUtilization)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {(isOverweight || isOverVolume) && (
            <div className="mt-3 p-2.5 rounded bg-red-100 border border-red-300 text-red-800 text-xs flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
              <span>
                <strong>Warning: Capacity Limit Exceeded!</strong> Motor Vehicles Act prohibits highway dispatch exceeding rated vehicle payload. Please select a larger vehicle (e.g. 32ft Multi-Axle) or uncheck orders to resolve.
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Unplanned Orders Selection Queue */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">1. Select Unplanned Orders to Consolidate</CardTitle>
              <CardDescription>
                Check orders destined for the same freight corridor to build a full truckload (FTL)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">Select</TableHead>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>SLA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unplannedOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-slate-400">
                        All orders are currently planned into shipments.
                      </TableCell>
                    </TableRow>
                  ) : (
                    unplannedOrders.slice(0, 10).map((ord) => {
                      const isSelected = selectedOrderIds.includes(ord.id);
                      return (
                        <TableRow
                          key={ord.id}
                          onClick={() => toggleOrderSelection(ord.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-50/70' : 'hover:bg-slate-50'
                          }`}
                        >
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="rounded border-slate-300 text-blue-600 cursor-pointer"
                            />
                          </TableCell>
                          <TableCell className="font-mono text-xs font-semibold text-blue-600">
                            {ord.order_number}
                          </TableCell>
                          <TableCell className="text-xs font-medium text-slate-800">
                            {ord.customer_name}
                          </TableCell>
                          <TableCell className="text-xs text-slate-600">
                            {ord.origin_city} → {ord.destination_city}
                          </TableCell>
                          <TableCell className="text-xs font-semibold text-slate-900">
                            {ord.cargo_weight_kg.toLocaleString('en-IN')} kg
                          </TableCell>
                          <TableCell className="text-xs text-slate-600">
                            {ord.cargo_volume_cbm} CBM
                          </TableCell>
                          <TableCell className="text-xs text-slate-500">
                            {new Date(ord.delivery_deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Vehicle Allocation Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">2. Select Dedicated Vehicle</CardTitle>
              <CardDescription>
                Assign available vehicle matching your consignment volumetric profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vehicles.slice(0, 6).map((v) => {
                  const isSelected = selectedVehicleId === v.id;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVehicleId(v.id)}
                      className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/40 text-blue-900 shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold font-mono text-slate-900">{v.registration_number}</span>
                        <Badge variant="outline" className="text-[10px]">{v.vehicle_type}</Badge>
                      </div>
                      <div className="mt-1 text-slate-500">
                        Driver: <span className="font-medium text-slate-700">{v.driver_name}</span>
                      </div>
                      <div className="mt-1 flex justify-between text-[11px] text-slate-600 font-medium">
                        <span>Max Payload: {v.max_weight_kg.toLocaleString('en-IN')} kg</span>
                        <span>{v.max_volume_cbm} CBM</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Intelligent Carrier Procurement & Recommendation (Section 6D) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-blue-300 shadow-md">
            <CardHeader className="bg-slate-900 text-white rounded-t-xl pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AI Carrier Procurement Engine</span>
                </span>
                <Badge variant="success" className="text-[10px]">Explainable Scoring</Badge>
              </div>
              <CardTitle className="text-base text-white mt-1">
                Recommended Carrier: {topCarrier?.carrier.name}
              </CardTitle>
              <CardDescription className="text-slate-300 text-xs">
                {topCarrier?.recommendationReason}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Score Breakdown Bars */}
              {topCarrier && (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900 pb-1 border-b border-slate-200">
                    <span>Overall Procurement Score</span>
                    <span className="text-blue-600 text-sm">{topCarrier.scoreOverall} / 100</span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Freight Cost (35% Weight)</span>
                      <span className="font-semibold text-slate-800">{topCarrier.scoreCost}/100 (₹{topCarrier.quoteAmountInr.toLocaleString('en-IN')})</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">On-Time Performance (30% Weight)</span>
                      <span className="font-semibold text-slate-800">{topCarrier.scoreOtp}/100 ({topCarrier.carrier.on_time_percentage}% OTP)</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Capacity & Fleet Match (15% Weight)</span>
                      <span className="font-semibold text-slate-800">{topCarrier.scoreCapacity}/100</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Damage & Incident Rate (10% Weight)</span>
                      <span className="font-semibold text-slate-800">{topCarrier.scoreIncident}/100</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Lane Experience (10% Weight)</span>
                      <span className="font-semibold text-slate-800">{topCarrier.scoreLaneExp}/100 ({topCarrier.carrier.total_shipments_completed} trips)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Carrier Selection Radio List */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700">Available Carrier Bids & Ranks</span>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {carrierScores.slice(0, 5).map((score) => {
                    const isSelected = (selectedCarrierId || topCarrier?.carrier.id) === score.carrier.id;
                    return (
                      <div
                        key={score.carrier.id}
                        onClick={() => setSelectedCarrierId(score.carrier.id)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-400 font-mono">#{score.rank}</span>
                          <div>
                            <div className="font-semibold text-slate-900">{score.carrier.name}</div>
                            <div className="text-[11px] text-slate-500">
                              {score.carrier.on_time_percentage}% OTP • {score.estimatedTransitHours}h Transit
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-slate-900">₹{score.quoteAmountInr.toLocaleString('en-IN')}</div>
                          <div className="text-[10px] text-blue-600 font-semibold">Score: {score.scoreOverall}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Manual Override Reason (Audit Trail) */}
              {selectedCarrierId && selectedCarrierId !== topCarrier?.carrier.id && (
                <div className="space-y-1 p-2.5 rounded bg-amber-50 border border-amber-200">
                  <span className="text-xs font-semibold text-amber-900">Carrier Override Audit Reason</span>
                  <input
                    type="text"
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="e.g. Mandatory customer SLA requires dedicated GPS lock"
                    className="w-full text-xs bg-white border border-amber-300 rounded p-1.5 text-slate-800"
                  />
                </div>
              )}

              {/* Schedule pickup & delivery */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block mb-1 font-medium">Pickup Appointment</span>
                  <input
                    type="datetime-local"
                    value={scheduledPickup}
                    onChange={(e) => setScheduledPickup(e.target.value)}
                    className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white"
                  />
                </div>
                <div>
                  <span className="text-slate-500 block mb-1 font-medium">Delivery Deadline</span>
                  <input
                    type="datetime-local"
                    value={estimatedDelivery}
                    onChange={(e) => setEstimatedDelivery(e.target.value)}
                    className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-slate-50 p-4 border-t border-slate-200">
              <Button
                onClick={handleConfirmPlan}
                disabled={selectedOrderIds.length === 0 || isOverweight || isOverVolume}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 shadow-xs"
              >
                Confirm Shipment Plan & Assign Carrier
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
