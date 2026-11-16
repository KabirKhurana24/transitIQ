import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-slate-900 text-slate-50 shadow hover:bg-slate-900/80',
        secondary:
          'border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200',
        destructive:
          'border-transparent bg-red-500 text-white shadow hover:bg-red-600',
        outline: 'text-slate-950 border-slate-200',
        success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        warning: 'border-amber-200 bg-amber-50 text-amber-700',
        danger: 'border-rose-200 bg-rose-50 text-rose-700',
        info: 'border-blue-200 bg-blue-50 text-blue-700',
        indigo: 'border-indigo-200 bg-indigo-50 text-indigo-700',
        purple: 'border-purple-200 bg-purple-50 text-purple-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'delivered':
    case 'passed':
    case 'active':
    case 'approved':
    case 'resolved':
      return <Badge variant="success">{status.replace('_', ' ').toUpperCase()}</Badge>;
    case 'in_transit':
    case 'dispatched':
      return <Badge variant="info">{status.replace('_', ' ').toUpperCase()}</Badge>;
    case 'planned':
    case 'carrier_assigned':
    case 'confirmed':
      return <Badge variant="indigo">{status.replace('_', ' ').toUpperCase()}</Badge>;
    case 'at_risk':
    case 'action_recommended':
    case 'pending':
    case 'pending_review':
    case 'investigating':
      return <Badge variant="warning">{status.replace('_', ' ').toUpperCase()}</Badge>;
    case 'delayed':
    case 'discrepancy_flagged':
    case 'critical':
    case 'cancelled':
    case 'rejected':
      return <Badge variant="danger">{status.replace('_', ' ').toUpperCase()}</Badge>;
    default:
      return <Badge variant="secondary">{status.replace('_', ' ').toUpperCase()}</Badge>;
  }
}

export { Badge, badgeVariants };
