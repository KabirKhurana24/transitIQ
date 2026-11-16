'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Receipt,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  IndianRupee,
  FileCheck,
  ArrowRight,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { tmsRepository } from '@/lib/services/tms-service';
import { FreightInvoice } from '@/types/tms';

export function FinanceView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [auditFilter, setAuditFilter] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);

  const invoices = tmsRepository.getInvoices({
    search: searchTerm,
    auditStatus: auditFilter,
  });

  const totalBilled = invoices.reduce((sum, inv) => sum + inv.billed_amount_inr, 0);
  const totalExpected = invoices.reduce((sum, inv) => sum + inv.expected_amount_inr, 0);
  const totalVariance = totalBilled - totalExpected;
  const flaggedCount = invoices.filter((inv) => inv.audit_status === 'discrepancy_flagged').length;

  const handleReconcile = (invoiceId: string, decision: 'passed' | 'approved' | 'rejected' | 'discrepancy_flagged') => {
    tmsRepository.reconcileInvoice(invoiceId, decision);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Freight Invoice Audit & Reconciliation
            </h1>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Automated 3-Way Match
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Compare carrier billed invoices against contracted lane rate cards, GPS mileage logs, and proof of delivery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 text-xs">
            {flaggedCount} Discrepancies Flagged
          </Badge>
        </div>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Contracted Freight
            </span>
            <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">
              ₹{(totalExpected / 100000).toFixed(2)}L
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Approved baseline quotes</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Carrier Billed Amount
            </span>
            <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">
              ₹{(totalBilled / 100000).toFixed(2)}L
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Gross billed by transporters</p>
          </CardContent>
        </Card>

        <Card className={totalVariance > 0 ? 'border-rose-200 bg-rose-50/20' : ''}>
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
              Audit Variance Detected
            </span>
            <div className="mt-2 text-2xl font-bold text-rose-600 font-mono">
              +₹{totalVariance.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-rose-600/80 mt-0.5">Disputed fuel & distance claims</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Discrepancy Rate
            </span>
            <div className="mt-2 text-2xl font-bold text-amber-600">
              {invoices.length > 0 ? Math.round((flaggedCount / invoices.length) * 100) : 0}%
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Industry avg ~18%</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search invoice #, shipment, carrier..."
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={auditFilter}
              onChange={(e) => setAuditFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
            >
              <option value="all">All Audit States ({invoices.length})</option>
              <option value="discrepancy_flagged">Discrepancy Flagged</option>
              <option value="passed">Passed Audit</option>
              <option value="approved">Approved for Payment</option>
              <option value="pending_review">Pending Review</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Freight Invoices Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Shipment</TableHead>
                <TableHead>Transporter / Carrier</TableHead>
                <TableHead>Expected Rate</TableHead>
                <TableHead>Billed Amount</TableHead>
                <TableHead>Variance</TableHead>
                <TableHead>Discrepancy Reason</TableHead>
                <TableHead>Audit Status</TableHead>
                <TableHead className="text-right">Reconciliation Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-slate-400">
                    No freight invoices found.
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((inv) => {
                  const hasVariance = inv.variance_amount_inr > 0;

                  return (
                    <TableRow key={inv.id} className="hover:bg-slate-50">
                      <TableCell className="font-mono font-semibold text-slate-900 text-xs">
                        {inv.invoice_number}
                        <span className="text-[10px] text-slate-400 block font-normal">
                          Due: {inv.due_date}
                        </span>
                      </TableCell>

                      <TableCell>
                        <Link
                          href={`/shipments`}
                          className="font-mono font-medium text-blue-600 hover:underline text-xs"
                        >
                          {inv.shipment_number}
                        </Link>
                      </TableCell>

                      <TableCell className="text-xs font-medium text-slate-800">
                        {inv.carrier_name}
                      </TableCell>

                      <TableCell className="font-mono text-xs text-slate-600">
                        ₹{inv.expected_amount_inr.toLocaleString('en-IN')}
                      </TableCell>

                      <TableCell className="font-mono text-xs font-bold text-slate-900">
                        ₹{inv.billed_amount_inr.toLocaleString('en-IN')}
                      </TableCell>

                      <TableCell>
                        {hasVariance ? (
                          <div className="text-xs font-bold text-rose-600 font-mono">
                            +₹{inv.variance_amount_inr.toLocaleString('en-IN')}
                            <span className="text-[10px] font-normal text-rose-500 block">
                              (+{inv.variance_percentage}%)
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-emerald-600 font-semibold font-mono">
                            ₹0 (Match)
                          </span>
                        )}
                      </TableCell>

                      <TableCell>
                        {inv.discrepancy_reason !== 'none' ? (
                          <span className="text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                            {inv.discrepancy_reason.replace(/_/g, ' ')}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">None (Verified)</span>
                        )}
                      </TableCell>

                      <TableCell>
                        <StatusBadge status={inv.audit_status} />
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {inv.audit_status === 'discrepancy_flagged' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReconcile(inv.id, 'rejected')}
                                className="text-xs text-red-600 border-red-200 hover:bg-red-50 h-7 px-2"
                              >
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleReconcile(inv.id, 'approved')}
                                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white h-7 px-2"
                              >
                                Approve
                              </Button>
                            </>
                          )}

                          {inv.audit_status === 'pending_review' && (
                            <Button
                              size="sm"
                              onClick={() => handleReconcile(inv.id, 'passed')}
                              className="text-xs bg-blue-600 hover:bg-blue-700 text-white h-7 px-2.5"
                            >
                              Verify & Pass
                            </Button>
                          )}

                          {(inv.audit_status === 'passed' || inv.audit_status === 'approved') && (
                            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Cleared
                            </span>
                          )}

                          {inv.audit_status === 'rejected' && (
                            <span className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                              <XCircle className="h-3.5 w-3.5" /> Disputed
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
