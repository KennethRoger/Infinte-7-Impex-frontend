import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-slate-900/80 backdrop-blur-sm border border-slate-800/80 rounded-xl p-6 shadow-xl',
        hoverEffect && 'transition-all duration-300 hover:border-slate-700 hover:shadow-2xl hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
