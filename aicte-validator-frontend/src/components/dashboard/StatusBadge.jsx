import React from 'react';

/**
 * StatusBadge Component
 * Standardized, accessible status pills for application statuses and alert categories.
 */
const StatusBadge = ({ status, className = '' }) => {
  // Normalize string for key mapping
  const normalized = (status || '').toLowerCase().trim();

  let style = 'bg-slate-100 text-slate-800 border-slate-200';
  let dotColor = 'bg-slate-500';

  if (normalized.includes('passed') || normalized.includes('completed') || normalized.includes('valid') || normalized.includes('active')) {
    style = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    dotColor = 'bg-emerald-600';
  } else if (normalized.includes('review required') || normalized.includes('missing') || normalized.includes('warning') || normalized.includes('pending')) {
    style = 'bg-amber-50 text-amber-900 border-amber-200';
    dotColor = 'bg-amber-600';
  } else if (normalized.includes('inconsistency') || normalized.includes('deficient') || normalized.includes('notice') || normalized.includes('danger')) {
    style = 'bg-red-50 text-red-800 border-red-200';
    dotColor = 'bg-red-600';
  } else if (normalized.includes('under review') || normalized.includes('processing') || normalized.includes('info')) {
    style = 'bg-blue-50 text-blue-900 border-blue-200';
    dotColor = 'bg-blue-600';
  }

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
