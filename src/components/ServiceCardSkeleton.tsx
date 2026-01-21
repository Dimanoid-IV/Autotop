import React from 'react';

const ServiceCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col bg-white rounded-xl shadow-soft border border-border-light overflow-hidden animate-pulse">
      <div className="h-40 bg-slate-200" />
      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div className="h-5 w-3/4 bg-slate-200 rounded" />
          <div className="h-4 w-10 bg-slate-200 rounded" />
        </div>
        <div className="h-3 w-1/2 bg-slate-100 rounded" />
        <div className="space-y-2 mt-2">
          <div className="h-3 w-full bg-slate-100 rounded" />
          <div className="h-3 w-full bg-slate-100 rounded" />
        </div>
        <div className="flex items-center justify-end pt-3 mt-auto border-t border-border-light">
          <div className="h-8 w-24 bg-slate-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default ServiceCardSkeleton;
