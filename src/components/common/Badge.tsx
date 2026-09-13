import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'emerald' | 'amber' | 'rose' | 'sky';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';

  const variantStyles = {
    default: 'bg-slate-800 text-slate-300 border border-slate-700',
    emerald: 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60',
    amber: 'bg-amber-950/60 text-amber-300 border border-amber-800/60',
    rose: 'bg-rose-950/60 text-rose-300 border border-rose-800/60',
    sky: 'bg-sky-950/60 text-sky-300 border border-sky-800/60',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </span>
  );
};
