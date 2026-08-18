import React from 'react';

export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}> = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden ${
        hover ? 'card-hover' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`p-5 pb-3 border-b border-slate-100 flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
  subtitle?: string;
}> = ({ children, className = '', subtitle }) => {
  return (
    <div>
      <h3 className={`text-base font-semibold text-slate-900 tracking-tight ${className}`}>
        {children}
      </h3>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  );
};

export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return <div className={`p-5 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
};
