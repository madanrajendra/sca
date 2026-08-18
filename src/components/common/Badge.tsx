import React from 'react';
import { MembershipStatus, PromotionStatus, ReferralStatus } from '../../types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral';
  status?: MembershipStatus | PromotionStatus | ReferralStatus | 'OPEN' | 'OCCUPIED' | 'SUSPENDED' | 'INACTIVE';
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant,
  status,
  className = '',
  size = 'md',
}) => {
  let resolvedVariant = variant || 'default';
  let label = children;

  if (status) {
    switch (status) {
      case 'ACTIVE':
      case 'LIVE':
      case 'WON':
      case 'OPEN':
        resolvedVariant = 'success';
        label = label || (status === 'OPEN' ? '○ Open Category' : status.replace('_', ' '));
        break;
      case 'PAYMENT_FAILED_VIEW_ONLY':
      case 'REJECTED':
      case 'LOST':
      case 'SUSPENDED':
        resolvedVariant = 'danger';
        label = label || (status === 'PAYMENT_FAILED_VIEW_ONLY' ? 'Payment Problem (View-Only)' : status.replace('_', ' '));
        break;
      case 'PENDING_APPROVAL':
      case 'PENDING':
      case 'IN_REVIEW':
      case 'APPROVED_PAYMENT_REQUIRED':
        resolvedVariant = 'warning';
        label = label || (status === 'APPROVED_PAYMENT_REQUIRED' ? 'Payment Required' : status.replace('_', ' '));
        break;
      case 'OCCUPIED':
        resolvedVariant = 'purple';
        label = label || '● Category Occupied';
        break;
      case 'DRAFT':
      case 'EXPIRED':
      case 'PAUSED':
      case 'LAPSED':
        resolvedVariant = 'neutral';
        label = label || status.replace('_', ' ');
        break;
      case 'SENT':
      case 'CONTACTED':
        resolvedVariant = 'info';
        label = label || status.replace('_', ' ');
        break;
      default:
        resolvedVariant = 'neutral';
        label = label || String(status);
    }
  }

  const variantStyles = {
    default: 'bg-slate-100 text-slate-800 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium',
    warning: 'bg-amber-50 text-amber-800 border-amber-200 font-medium',
    danger: 'bg-rose-50 text-rose-700 border-rose-200 font-medium',
    info: 'bg-blue-50 text-blue-700 border-blue-200 font-medium',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 font-medium',
    neutral: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${variantStyles[resolvedVariant]} ${sizeStyles[size]} ${className}`}
    >
      {label}
    </span>
  );
};
