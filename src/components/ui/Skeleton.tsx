import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
}

export function Skeleton({ className, variant = 'rect' }: SkeletonProps) {
  const baseStyles = 'skeleton bg-muted animate-pulse';
  
  const variants = {
    text: 'h-4 w-full rounded',
    rect: 'w-full h-24 rounded-lg',
    circle: 'rounded-full',
  };

  return <div className={clsx(baseStyles, variants[variant], className)} />;
}

export function TrackSkeleton() {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg">
      <Skeleton variant="circle" className="w-12 h-12" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2 h-3" />
      </div>
      <Skeleton variant="text" className="w-12 h-4" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl bg-card p-4 space-y-3">
      <Skeleton className="w-full aspect-square rounded-lg" />
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="text" className="w-1/2 h-3" />
    </div>
  );
}
