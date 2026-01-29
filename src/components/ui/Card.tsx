import React, { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glass?: boolean;
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, glass = false, hover = false, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-xl p-4',
          glass ? 'glass' : 'bg-card border border-border',
          hover && 'hover-lift cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
