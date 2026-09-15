import React from 'react';

export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}> = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`bg-[#0b0b0b] rounded-2xl border border-neutral-800 shadow-lg overflow-hidden text-neutral-100 ${
        hover ? 'hover:border-red-600/50 transition-all' : ''
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
    <div className={`p-5 pb-4 border-b border-neutral-900 flex items-center justify-between ${className}`}>
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
      <h3 className={`text-base font-bold uppercase tracking-tight text-white ${className}`}>
        {children}
      </h3>
      {subtitle && <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>}
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
    <div className={`p-4 bg-[#050505] border-t border-neutral-900 flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
};
