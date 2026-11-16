'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Search,
  Filter,
  Plus,
  ArrowRight,
  MapPin,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle,
  Truck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/ui/badge';
import { tmsRepository } from '@/lib/services/tms-service';
import { CreateOrderDialog } from '@/components/orders/create-order-dialog';

export function OrdersView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const orders = tmsRepository.getOrders({
    search: searchTerm,
    status: statusFilter,
  });

  const handleOrderCreated = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Transportation Orders</h1>
          <p className="text-sm text-slate-500 mt-1">
            Enterprise consignment orders from ERP, manufacturing hubs, and customer logistics contracts.
          </p>
        </div>

        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>New Order</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order #, customer, lane..."
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
            >
              <option value="all">All Statuses ({orders.length})</option>
              <option value="confirmed">Confirmed (Unplanned)</option>
              <option value="planned">Planned into Load</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Corridor (Route)</TableHead>
                <TableHead>Cargo Details</TableHead>
                <TableHead>Vehicle Type</TableHead>
                <TableHead>Delivery SLA</TableHead>
                <TableHead>Est. Freight</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-slate-400">
                    No transportation orders found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                orders.slice(0, 25).map((order) => (
                  <TableRow key={order.id} className="hover:bg-slate-50/70">
                    <TableCell className="font-mono font-semibold text-blue-600 text-xs">
                      {order.order_number}
                    </TableCell>

                    <TableCell>
                      <div className="font-medium text-slate-900 text-xs">{order.customer_name}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                        {order.cargo_category}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-800">
                        <span>{order.origin_city}</span>
                        <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />
                        <span>{order.destination_city}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs font-medium text-slate-800">
                        {order.cargo_weight_kg.toLocaleString('en-IN')} kg
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {order.cargo_volume_cbm} CBM
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {order.required_vehicle_type}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span>{new Date(order.delivery_deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </TableCell>

                    <TableCell className="font-mono text-xs font-semibold text-slate-900">
                      ₹{order.estimated_freight_inr.toLocaleString('en-IN')}
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>

                    <TableCell className="text-right">
                      {order.shipment_id ? (
                        <Link href={`/shipments`}>
                          <Button size="sm" variant="ghost" className="text-xs text-blue-600 hover:text-blue-700">
                            View Shipment
                          </Button>
                        </Link>
                      ) : (
                        <Link href={`/planning`}>
                          <Button size="sm" variant="outline" className="text-xs border-blue-200 text-blue-600 hover:bg-blue-50">
                            Plan Load
                          </Button>
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateOrderDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onOrderCreated={handleOrderCreated}
      />
    </div>
  );
}
