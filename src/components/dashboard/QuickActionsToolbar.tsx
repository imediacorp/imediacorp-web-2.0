/**
 * Quick Actions Toolbar Component
 * Provides quick action buttons like Export Data, Compare Session, Add to Fleet
 */

'use client';

import React from 'react';

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

interface QuickActionsToolbarProps {
  actions: QuickAction[];
}

export function QuickActionsToolbar({ actions }: QuickActionsToolbarProps) {
  const getButtonClasses = (variant: QuickAction['variant'] = 'secondary', disabled?: boolean) => {
    const base = 'px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
    
    if (disabled) {
      return `${base} bg-gray-100 text-gray-400`;
    }

    switch (variant) {
      case 'primary':
        return `${base} bg-primary-600 text-white hover:bg-primary-700`;
      case 'danger':
        return `${base} bg-red-600 text-white hover:bg-red-700`;
      default:
        return `${base} bg-white text-gray-700 border border-gray-300 hover:bg-gray-50`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-sm font-semibold text-gray-700">Quick Actions</h3>
        <div className="flex items-center gap-2 flex-wrap">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              disabled={action.disabled}
              className={getButtonClasses(action.variant, action.disabled)}
            >
              <span className="mr-2">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

