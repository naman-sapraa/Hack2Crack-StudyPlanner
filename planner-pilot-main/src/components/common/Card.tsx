
import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  glass?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const Card = ({ 
  children, 
  className, 
  hoverable = false, 
  glass = false,
  onMouseEnter,
  onMouseLeave
}: CardProps) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6 shadow-sm",
        hoverable && "card-hover",
        glass && "glass-morphism",
        className
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
};

export default Card;
