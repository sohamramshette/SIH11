import React from 'react';

/**
 * Reusable SectionHeading component placeholder
 */
const SectionHeading = ({
  badge,
  title,
  subtitle,
  align = 'center',
  className = '',
}) => {
  const alignmentClass = align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center mx-auto';

  return (
    <div className={`max-w-3xl mb-12 ${alignmentClass} ${className}`}>
      {badge && (
        <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-blue-900 uppercase bg-blue-100 rounded-full">
          {badge}
        </span>
      )}
      {title && (
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="mt-4 text-base text-slate-600 sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
