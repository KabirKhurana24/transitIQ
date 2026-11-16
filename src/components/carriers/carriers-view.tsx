'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Star,
  Award,
  Sliders,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Truck,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { tmsRepository } from '@/lib/services/tms-service';
import { calculateCarrierScores } from '@/lib/services/carrier-scoring';
import { ScoringWeights } from '@/types/tms';

export function CarriersView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLaneId, setSelectedLaneId] = useState('lane-01');
  const [weights, setWeights] = useState<ScoringWeights>(tmsRepository.getWeights());
  const [weightsSaved, setWeightsSaved] = useState(false);

  const carriers = tmsRepository.getCarriers().filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lanes = tmsRepository.getLanes();
  const selectedLane = lanes.find((l) => l.id === selectedLaneId) || lanes[0];

  // Run dynamic carrier procurement scoring engine
  const scores = calculateCarrierScores(
    carriers,
    selectedLane,
    14000,
    55,
    '32ft Multi-Axle',
    weights
  );

  const topPick = scores[0];

  const handleWeightChange = (key: keyof ScoringWeights, val: number) => {
    const updated = { ...weights, [key]: val / 100 };
    setWeights(updated);
    tmsRepository.updateWeights(updated);
    setWeightsSaved(true);
    setTimeout(() => setWeightsSaved(false), 2000);
  };

  const handleResetWeights = () => {
    const defaultW: ScoringWeights = {
      cost: 0.35,
      on_time: 0.30,
      capacity: 0.15,
      incident: 0.10,
      lane_experience: 0.10,
    };
    setWeights(defaultW);
    tmsRepository.updateWeights(defaultW);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Carrier Network & AI Procurement</h1>
          <p className="text-sm text-slate-500 mt-1">
            Audited road transport partners, dynamic multi-attribute carrier scoring, and tender rate optimization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            {carriers.length} Active Indian Transporters
          </Badge>
        </div>
      </div>

      {/* Procurement Simulator & Weight Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configurable Weighted Scoring Matrix (5 cols) */}
        <Card className="lg:col-span-5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-blue-600" />
                <CardTitle className="text-sm font-semibold">Configurable Algorithm Weights</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetWeights}
                className="text-[11px] text-slate-500 hover:text-slate-900 h-7 px-2"
              >
                <RefreshCw className="h-3 w-3 mr-1" /> Reset
              </Button>
            </div>
            <CardDescription className="text-xs">
              Adjust multi-criteria procurement priority percentages. Scores update in real time.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 text-xs">
            {/* Weight 1: Cost */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 mb-1">
                <span>1. Freight Linehaul Cost</span>
                <span className="text-blue-600">{Math.round(weights.cost * 100)}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="70"
                step="5"
                value={Math.round(weights.cost * 100)}
                onChange={(e) => handleWeightChange('cost', Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">Penalizes high quotes vs lowest spot quote</p>
            </div>

            {/* Weight 2: OTP */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 mb-1">
                <span>2. On-Time Delivery Performance (OTP)</span>
                <span className="text-blue-600">{Math.round(weights.on_time * 100)}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="70"
                step="5"
                value={Math.round(weights.on_time * 100)}
                onChange={(e) => handleWeightChange('on_time', Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">Prioritizes historical arrival compliance</p>
            </div>

            {/* Weight 3: Capacity */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 mb-1">
                <span>3. Capacity & Vehicle Suitability</span>
                <span className="text-blue-600">{Math.round(weights.capacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={Math.round(weights.capacity * 100)}
                onChange={(e) => handleWeightChange('capacity', Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">Evaluates dedicated vehicle fleet availability</p>
            </div>

            {/* Weight 4: Incident Rate */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 mb-1">
                <span>4. Damage & Cancellation History</span>
                <span className="text-blue-600">{Math.round(weights.incident * 100)}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                step="5"
                value={Math.round(weights.incident * 100)}
                onChange={(e) => handleWeightChange('incident', Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">Penalizes damaged carton claims & cancelled trips</p>
            </div>

            {/* Weight 5: Lane Experience */}
            <div>
              <div className="flex justify-between font-semibold text-slate-800 mb-1">
                <span>5. Regional Lane Experience</span>
                <span className="text-blue-600">{Math.round(weights.lane_experience * 100)}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                step="5"
                value={Math.round(weights.lane_experience * 100)}
                onChange={(e) => handleWeightChange('lane_experience', Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">Corridor trip volume and driver route familiarity</p>
            </div>

            {weightsSaved && (
              <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Procurement weights updated successfully.</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: Live Corridor Procurement Simulation (7 cols) */}
        <Card className="lg:col-span-7 border-blue-200">
          <CardHeader className="pb-3 bg-slate-900 text-white rounded-t-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-blue-400 flex items-center gap-1.5 uppercase">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Procurement Matcher</span>
                </span>
                <CardTitle className="text-base text-white mt-1">
                  Simulation: {selectedLane.origin_city} → {selectedLane.destination_city}
                </CardTitle>
              </div>

              {/* Lane Selector */}
              <select
                value={selectedLaneId}
                onChange={(e) => setSelectedLaneId(e.target.value)}
                className="text-xs bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {lanes.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.origin_city} → {l.destination_city} ({l.distance_km} km)
                  </option>
                ))}
              </select>
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-4">
            {/* Top Recommended Carrier Card */}
            {topPick && (
              <div className="p-4 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50/70 to-indigo-50/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Top Recommended</span>
                      <h3 className="text-base font-bold text-slate-900">{topPick.carrier.name}</h3>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-extrabold text-blue-600 font-mono">
                      {topPick.scoreOverall}
                    </span>
                    <span className="text-xs text-slate-400 block leading-none">Overall Score</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {topPick.recommendationReason}
                </p>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-blue-200/60 text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px]">Freight Quote</span>
                    <p className="font-bold text-slate-900 font-mono">₹{topPick.quoteAmountInr.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">On-Time Delivery</span>
                    <p className="font-bold text-emerald-600">{topPick.carrier.on_time_percentage}%</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Est. Transit Time</span>
                    <p className="font-bold text-slate-900">{topPick.estimatedTransitHours} hours</p>
                  </div>
                </div>
              </div>
            )}

            {/* Alternative Carrier Options Table */}
            <div>
              <span className="text-xs font-semibold text-slate-700 block mb-2">
                Comparative Carrier Bids (Ranked by Multi-Attribute Algorithm)
              </span>

              <div className="space-y-2">
                {scores.slice(1, 5).map((score) => (
                  <div
                    key={score.carrier.id}
                    className="p-3 rounded-lg border border-slate-200 bg-white hover:border-blue-400 transition-all flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-400 text-xs">#{score.rank}</span>
                      <div>
                        <div className="font-semibold text-slate-900">{score.carrier.name}</div>
                        <div className="text-[11px] text-slate-500">
                          OTP: {score.carrier.on_time_percentage}% • {score.carrier.avg_delay_hours}h avg delay
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold font-mono text-slate-900">
                        ₹{score.quoteAmountInr.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-blue-600 font-semibold block">
                        Score: {score.scoreOverall}/100
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comprehensive Master Carrier Directory */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-semibold">Master Road Carrier Fleet Directory</CardTitle>
            <CardDescription>Audited operational profiles, rating, insurance, and performance records</CardDescription>
          </div>
          <div className="w-64">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search carrier..."
              className="text-xs h-8"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Carrier Name & Code</TableHead>
                <TableHead>Contact Representative</TableHead>
                <TableHead>On-Time Delivery (OTP)</TableHead>
                <TableHead>Avg Delay</TableHead>
                <TableHead>Cancellation %</TableHead>
                <TableHead>Damage %</TableHead>
                <TableHead>Base Rate / KM</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carriers.map((c) => (
                <TableRow key={c.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div className="font-bold text-slate-900 text-xs">{c.name}</div>
                    <span className="font-mono text-[10px] text-slate-400">{c.code}</span>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-slate-800 font-medium">{c.contact_person}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{c.phone}</div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-bold text-emerald-600">{c.on_time_percentage}%</span>
                  </TableCell>
                  <TableCell className="text-xs text-slate-700 font-mono">
                    {c.avg_delay_hours} hrs
                  </TableCell>
                  <TableCell className="text-xs text-slate-700 font-mono">
                    {c.cancellation_rate}%
                  </TableCell>
                  <TableCell className="text-xs text-slate-700 font-mono">
                    {c.damage_incident_rate}%
                  </TableCell>
                  <TableCell className="text-xs font-mono font-semibold text-slate-900">
                    ₹{c.base_rate_per_km_inr} / km
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      <span>{c.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="success" className="text-[10px]">Active</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
