/**
 * Dashboard Section Component
 * Reusable section wrapper with consistent styling
 */

'use client';

import React, { ReactNode } from 'react';

export interface DashboardSectionProps {
  title?: string;
  subtitle?: string;
  icon?: string;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'card' | 'bordered';
  headerActions?: ReactNode;
}

export function DashboardSection({
  title,
  subtitle,
  icon,
  children,
  className = '',
  variant = 'card',
  headerActions,
}: DashboardSectionProps) {
  const baseClasses = 'rounded-lg';
  
  const variantClasses = {
    card: 'bg-white shadow-sm border border-gray-200 p-6',
    bordered: 'border border-gray-200 p-6',
    default: 'p-4',
  };

  return (
    <section className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {(title || subtitle || icon || headerActions) && (
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {icon && <span className="text-2xl mr-2">{icon}</span>}
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 inline">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          {headerActions && <div className="ml-4">{headerActions}</div>}
        </div>
      )}
      <div>{children}</div>
    </section>
  );
}

/**
 * Dashboard Grid Layout
 * Responsive grid for dashboard content
 */
export interface DashboardGridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
  smCols?: 1 | 2 | 3 | 4; // Small screens (640px+)
  mdCols?: 1 | 2 | 3 | 4; // Medium screens (768px+)
  lgCols?: 1 | 2 | 3 | 4; // Large screens (1024px+)
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function DashboardGrid({
  children,
  cols = 2,
  smCols,
  mdCols,
  lgCols,
  gap = 'md',
  className = '',
}: DashboardGridProps) {
  // Build responsive column classes
  const getColClasses = () => {
    // If no custom breakpoints, use default responsive behavior
    if (!smCols && !mdCols && !lgCols) {
      const defaultClasses: Record<number, string> = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
      };
      return defaultClasses[cols] || defaultClasses[2];
    }
    
    // Custom breakpoints - build class string
    const classes: string[] = [];
    
    // Base (mobile)
    if (cols === 1) classes.push('grid-cols-1');
    else if (cols === 2) classes.push('grid-cols-2');
    else if (cols === 3) classes.push('grid-cols-3');
    else if (cols === 4) classes.push('grid-cols-4');
    
    // Small screens
    if (smCols === 1) classes.push('sm:grid-cols-1');
    else if (smCols === 2) classes.push('sm:grid-cols-2');
    else if (smCols === 3) classes.push('sm:grid-cols-3');
    else if (smCols === 4) classes.push('sm:grid-cols-4');
    
    // Medium screens
    if (mdCols === 1) classes.push('md:grid-cols-1');
    else if (mdCols === 2) classes.push('md:grid-cols-2');
    else if (mdCols === 3) classes.push('md:grid-cols-3');
    else if (mdCols === 4) classes.push('md:grid-cols-4');
    
    // Large screens
    if (lgCols === 1) classes.push('lg:grid-cols-1');
    else if (lgCols === 2) classes.push('lg:grid-cols-2');
    else if (lgCols === 3) classes.push('lg:grid-cols-3');
    else if (lgCols === 4) classes.push('lg:grid-cols-4');
    
    return classes.join(' ') || 'grid-cols-1';
  };

  const gapClasses = {
    sm: 'gap-2 sm:gap-3',
    md: 'gap-3 sm:gap-4',
    lg: 'gap-4 sm:gap-6',
  };

  return (
    <div className={`grid ${getColClasses()} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}

