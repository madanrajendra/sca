import React from 'react';
import { AlertTriangle, Info, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from './Button';

interface AlertBannerProps {
  variant?: 'warning' | 'info' | 'success' | 'danger';
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  variant = 'warning',
  title,
  message,
  actionText,
  onAction,
  className = '',
}) => {
  const styles = {
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
      btn: 'outline' as const,
    },
    danger: {
      bg: 'bg-rose-50 border-rose-200 text-rose-900',
      icon: <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />,
      btn: 'danger' as const,
    },
    info: {
      bg: 'bg-blue-50 border-blue-200 text-blue-900',
      icon: <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />,
      btn: 'secondary' as const,
    },
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
      btn: 'success' as const,
    },
  };

  const curr = styles[variant];

  return (
    <div className={`p-4 rounded-xl border ${curr.bg} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${className}`}>
      <div className="flex items-start gap-3">
        {curr.icon}
        <div>
          <h4 className="text-sm font-semibold">{title}</h4>
          <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{message}</p>
        </div>
      </div>
      {actionText && onAction && (
        <Button onClick={onAction} size="sm" variant={curr.btn} className="shrink-0">
          {actionText}
        </Button>
      )}
    </div>
  );
};
