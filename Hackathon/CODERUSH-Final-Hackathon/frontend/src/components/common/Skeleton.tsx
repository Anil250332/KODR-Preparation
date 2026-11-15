import React from 'react';

export const Skeleton: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = '',
  style,
}) => {
  return (
    <div
      className={`animate-pulse bg-slate-200/70 rounded-xl ${className}`}
      style={{ animationDuration: '1.5s', ...style }}
    />
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between ${className}`}>
      <div className="space-y-3 w-3/4">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-2.5 w-32" />
      </div>
      <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
    </div>
  );
};

export const SkeletonTableRow: React.FC<{ cols?: number }> = ({ cols = 5 }) => {
  return (
    <tr className="border-b border-slate-100">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-6">
          <Skeleton className={`h-4 ${i === 0 ? 'w-28' : i === 1 ? 'w-36' : 'w-20'}`} />
        </td>
      ))}
    </tr>
  );
};

export const SkeletonRequestCard: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3.5">
          <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-3.5 w-52" />
          </div>
        </div>
        <Skeleton className="h-4 w-28" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <Skeleton className="h-10 rounded-2xl" />
        <Skeleton className="h-10 rounded-2xl" />
        <Skeleton className="h-10 rounded-2xl" />
      </div>
    </div>
  );
};

export const SkeletonStaffCard: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      <div className="pt-2 space-y-2 border-t border-slate-100">
        <Skeleton className="h-3.5 w-40" />
        <Skeleton className="h-3.5 w-32" />
      </div>

      <div className="pt-2 flex justify-between items-center">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-24 rounded-xl" />
      </div>
    </div>
  );
};

export const SkeletonGridCard: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col justify-between">
      <div className="p-6 bg-slate-100/70 relative space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-10 h-10 rounded-2xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-2.5 w-16" />
              <Skeleton className="h-6 w-12" />
            </div>
          </div>
          <Skeleton className="w-7 h-7 rounded-full" />
        </div>
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-5 w-12" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-5 w-12" />
          </div>
        </div>
        <Skeleton className="h-8 w-full rounded-2xl" />
      </div>
    </div>
  );
};

export const SkeletonListItem: React.FC = () => {
  return (
    <div className="py-3.5 flex items-center justify-between">
      <div className="flex items-center space-x-3 w-3/4">
        <Skeleton className="w-10 h-10 rounded-2xl shrink-0" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-3.5 w-1/2" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
      <Skeleton className="h-7 w-16 rounded-xl shrink-0" />
    </div>
  );
};
