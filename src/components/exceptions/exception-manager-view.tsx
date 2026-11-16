'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  ArrowRight,
  Filter,
  Check,
  X,
  FileText,
  UserCheck,
  Bot,
  ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShipmentException } from '@/types/tms';
import { tmsRepository } from '@/lib/services/tms-service';

export function ExceptionManagerView() {
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedException, setSelectedException] = useState<ShipmentException | null>(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve_recommendation' | 'reject_recommendation' | 'manual_resolve'>('approve_recommendation');
  const [actionNotes, setActionNotes] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const exceptions = tmsRepository.getExceptions({
    severity: severityFilter,
    status: statusFilter,
  });

  const openExceptionsCount = exceptions.filter((e) => e.status !== 'resolved' && e.status !== 'closed').length;
  const criticalCount = exceptions.filter((e) => e.severity === 'critical' && e.status !== 'resolved').length;

  const handleOpenActionModal = (exc: ShipmentException, type: 'approve_recommendation' | 'reject_recommendation' | 'manual_resolve') => {
    setSelectedException(exc);
    setActionType(type);
    setActionNotes(exc.ai_recommendation?.recommended_action || '');
    setActionModalOpen(true);
  };

  const handleExecuteAction = () => {
    if (!selectedException) return;

    tmsRepository.resolveException(
      selectedException.id,
      actionType,
      actionNotes,
      'Priya Sharma (Operations Manager)'
    );

    setActionModalOpen(false);
    setSelectedException(null);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              AI Exception Manager
            </h1>
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
              Human-in-the-Loop Safe Guarded
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Autonomous multi-signal risk detection, explainable impact analysis, and guided corrective prescriptions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-bold flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4" />
            <span>{criticalCount} Critical Exceptions</span>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-bold">
            {openExceptionsCount} Open Issues
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
            >
              <option value="all">All Statuses ({exceptions.length})</option>
              <option value="action_recommended">Action Recommended</option>
              <option value="open">Open / Unreviewed</option>
              <option value="investigating">Under Investigation</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical Severity</option>
              <option value="high">High Severity</option>
              <option value="medium">Medium Severity</option>
              <option value="low">Low Severity</option>
            </select>
          </div>

          <div className="text-xs text-slate-400">
            Rule Engine: Grounded Telematics + SLA Margin Analysis
          </div>
        </CardContent>
      </Card>

      {/* Exceptions Grid */}
      <div className="space-y-4">
        {exceptions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-slate-400 text-sm">
              No shipment exceptions found matching the selected filters.
            </CardContent>
          </Card>
        ) : (
          exceptions.map((exc) => {
            const isResolved = exc.status === 'resolved';

            return (
              <Card
                key={exc.id}
                className={`transition-all ${
                  isResolved
                    ? 'border-slate-200 bg-slate-50/50 opacity-80'
                    : exc.severity === 'critical'
                    ? 'border-rose-300 shadow-xs bg-white'
                    : 'border-slate-200 shadow-xs bg-white'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-2 rounded-lg ${
                          exc.severity === 'critical'
                            ? 'bg-rose-100 text-rose-700'
                            : exc.severity === 'high'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-sm font-bold text-slate-900">
                            {exc.title}
                          </CardTitle>
                          <StatusBadge status={exc.severity} />
                          <StatusBadge status={exc.status} />
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Corridor: {exc.evidence_data?.lane || 'National Highway'} • Carrier: {exc.evidence_data?.carrier || 'Fleet Transport'} • Recorded {new Date(exc.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {exc.shipment_id && (
                        <Link href={`/shipments/${exc.shipment_id}`}>
                          <Button size="sm" variant="outline" className="text-xs h-8 text-blue-600 border-blue-200 hover:bg-blue-50">
                            <span>Shipment Timeline</span>
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  <p className="text-xs text-slate-700 leading-relaxed">{exc.description}</p>

                  {/* AI Explainable Recommendation Box */}
                  {exc.ai_recommendation && (
                    <div className="p-4 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50/80 to-indigo-50/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-blue-600" />
                          <span className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                            AI Operational Recommendation & Impact Evaluation
                          </span>
                        </div>
                        <Badge variant="outline" className="bg-white text-blue-700 border-blue-200 text-[10px] font-mono">
                          Confidence: {Math.round(exc.ai_recommendation.confidence_level * 100)}%
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-blue-950 uppercase">Identified Problem</span>
                          <p className="text-slate-800">{exc.ai_recommendation.problem_identified}</p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-blue-950 uppercase">Ground Telematics Evidence</span>
                          <p className="text-slate-800">{exc.ai_recommendation.evidence}</p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-blue-950 uppercase">Recommended Action</span>
                          <p className="font-semibold text-blue-900">{exc.ai_recommendation.recommended_action}</p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-blue-950 uppercase">Expected Outcome</span>
                          <p className="text-slate-800">{exc.ai_recommendation.expected_outcome}</p>
                        </div>
                      </div>

                      {exc.ai_recommendation.requires_approval && (
                        <div className="flex items-center gap-1.5 text-[11px] text-amber-800 font-medium pt-1">
                          <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
                          <span>Requires Explicit Operations Manager or Admin Approval before database execution.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Resolution Notes if Resolved */}
                  {isResolved && exc.resolution_notes && (
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Resolved by {exc.resolved_by || 'Operations Lead'}: </span>
                        <span>{exc.resolution_notes}</span>
                        <span className="block text-[10px] text-emerald-600 mt-0.5">
                          Audit Timestamp: {exc.resolved_at ? new Date(exc.resolved_at).toLocaleString() : 'Just now'}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>

                {!isResolved && (
                  <CardFooter className="bg-slate-50/80 p-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">
                      Action Required: Evaluate AI guidance and confirm resolution
                    </span>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenActionModal(exc, 'reject_recommendation')}
                        className="text-xs text-slate-600 border-slate-300 hover:bg-slate-100"
                      >
                        <X className="h-3.5 w-3.5 mr-1" />
                        Reject Guidance
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => handleOpenActionModal(exc, 'approve_recommendation')}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs shadow-xs"
                      >
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Approve & Execute Action
                      </Button>
                    </div>
                  </CardFooter>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Action Approval Confirmation Dialog */}
      <Dialog open={actionModalOpen} onOpenChange={setActionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span>
                {actionType === 'approve_recommendation'
                  ? 'Approve & Execute AI Corrective Action'
                  : 'Reject AI Recommendation'}
              </span>
            </DialogTitle>
            <DialogDescription>
              This operational decision creates an immutable activity log entry and immediately executes workflow updates.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-700 block mb-1">Target Exception</span>
              <p className="text-slate-900 font-bold">{selectedException?.title}</p>
              <p className="text-slate-500 mt-1">{selectedException?.ai_recommendation?.problem_identified}</p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="actionNotes">Decision & Execution Notes</Label>
              <Input
                id="actionNotes"
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                required
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setActionModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleExecuteAction}
              className={
                actionType === 'approve_recommendation'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }
            >
              {actionType === 'approve_recommendation' ? 'Confirm Approval' : 'Confirm Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
