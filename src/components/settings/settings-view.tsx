'use client';

import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Sliders,
  Database,
  Lock,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DEMO_USERS, ROLE_LABELS } from '@/lib/auth/roles';
import { tmsRepository } from '@/lib/services/tms-service';

export function SettingsView() {
  const [refreshKey, setRefreshKey] = useState(0);
  const approvals = tmsRepository.getApprovals();

  const handleApproval = (id: string, decision: 'approved' | 'rejected') => {
    tmsRepository.handleApproval(id, decision);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Organization Settings & Security</h1>
        <p className="text-sm text-slate-500 mt-1">
          Tenant organization profile, role-based access control (RBAC), and governance approvals queue.
        </p>
      </div>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList className="bg-slate-200/80 p-1">
          <TabsTrigger value="members">User Roles & Access</TabsTrigger>
          <TabsTrigger value="approvals">
            Approvals Queue ({approvals.filter((a) => a.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="organisation">Organization Profile</TabsTrigger>
          <TabsTrigger value="database">Database & RLS Policies</TabsTrigger>
        </TabsList>

        {/* Tab 1: Members & Roles */}
        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Active Organization Members</CardTitle>
              <CardDescription>
                5 verified operational personas configured with granular role-based permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User Persona</TableHead>
                    <TableHead>Work Email</TableHead>
                    <TableHead>Assigned Role</TableHead>
                    <TableHead>Operational Responsibilities</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DEMO_USERS.map((user) => (
                    <TableRow key={user.email} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="font-bold text-slate-900 text-xs">{user.name}</div>
                        <div className="text-[11px] text-slate-400">{user.title}</div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-blue-600">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] font-semibold">
                          {ROLE_LABELS[user.role]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 max-w-xs">
                        {user.description}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Active
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Approvals Queue */}
        <TabsContent value="approvals" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Executive & Manager Approvals Queue</CardTitle>
              <CardDescription>
                High-impact carrier overrides, emergency transshipments, and freight credit adjustments
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action Request</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Justification</TableHead>
                    <TableHead>Impact Summary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Decision</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvals.map((appr) => (
                    <TableRow key={appr.id} className="hover:bg-slate-50">
                      <TableCell className="font-bold text-slate-900 text-xs">
                        {appr.requested_action}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">
                        {appr.requested_by_name || 'Operations Lead'}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 max-w-xs">
                        {appr.justification}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-800">
                        {appr.impact_summary}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            appr.status === 'approved'
                              ? 'success'
                              : appr.status === 'rejected'
                              ? 'danger'
                              : 'warning'
                          }
                          className="text-[10px]"
                        >
                          {appr.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {appr.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApproval(appr.id, 'rejected')}
                              className="text-xs text-red-600 border-red-200 hover:bg-red-50 h-7 px-2"
                            >
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApproval(appr.id, 'approved')}
                              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white h-7 px-2"
                            >
                              Approve
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">
                            Reviewed by {appr.approved_by_name || 'Admin'}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Organization Profile */}
        <TabsContent value="organisation" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Tenant Organization Master</CardTitle>
              <CardDescription>Corporate legal identity and tax compliance details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Organization Legal Name</Label>
                  <Input defaultValue="Apex Distribution India Pvt Ltd" readOnly className="bg-slate-50" />
                </div>
                <div className="space-y-1">
                  <Label>GSTIN Registration Number</Label>
                  <Input defaultValue="27AAACA1234F1Z8" readOnly className="bg-slate-50 font-mono" />
                </div>
                <div className="space-y-1">
                  <Label>Enterprise System Code</Label>
                  <Input defaultValue="APEX-IN" readOnly className="bg-slate-50 font-mono" />
                </div>
                <div className="space-y-1">
                  <Label>Headquarters Corporate Address</Label>
                  <Input defaultValue="Plot 45, Sector 18, Udyog Vihar Phase IV, Gurgaon, Haryana 122015" readOnly className="bg-slate-50" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Database & Security */}
        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <CardTitle className="text-base font-semibold">Supabase PostgreSQL Architecture</CardTitle>
              </div>
              <CardDescription>
                Multi-tenant row-level security (RLS) enforcement verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 font-mono text-[11px]">
                <div className="text-slate-800 font-bold">PostgreSQL Security Extensions:</div>
                <p className="text-slate-600">✓ uuid-ossp, pgcrypto enabled</p>
                <p className="text-slate-600">✓ 20 Tenant-Owned Tables Protected by RLS</p>
                <p className="text-slate-600">✓ Non-recursive function: public.get_user_organisation_ids()</p>
                <p className="text-slate-600">✓ Private Storage: shipment-documents with authenticated signed access</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
