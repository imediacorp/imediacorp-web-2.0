/**
 * Dashboard Theme System
 * Centralized theme configuration for consistent styling across dashboards
 */

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    border: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: {
      sans: string;
      mono: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
  };
}

export const defaultTheme: ThemeConfig = {
  colors: {
    primary: '#3b82f6', // blue-500
    secondary: '#8b5cf6', // violet-500
    success: '#10b981', // emerald-500
    warning: '#f59e0b', // amber-500
    danger: '#ef4444', // red-500
    info: '#06b6d4', // cyan-500
    background: '#f9fafb', // gray-50
    surface: '#ffffff',
    text: {
      primary: '#111827', // gray-900
      secondary: '#4b5563', // gray-600
      muted: '#9ca3af', // gray-400
    },
    border: '#e5e7eb', // gray-200
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
  typography: {
    fontFamily: {
      sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
    },
  },
};

export const darkTheme: ThemeConfig = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    background: '#111827', // gray-900
    surface: '#1f2937', // gray-800
    text: {
      primary: '#f9fafb', // gray-50
      secondary: '#d1d5db', // gray-300
      muted: '#9ca3af', // gray-400
    },
    border: '#374151', // gray-700
  },
};

/**
 * Domain-specific theme variants
 */
export const domainThemes: Record<string, Partial<ThemeConfig>> = {
  'gas-vehicle': {
    colors: {
      primary: '#ef4444', // Red for combustion
      secondary: '#f59e0b', // Amber for heat
    },
  },
  'electric-vehicle': {
    colors: {
      primary: '#10b981', // Emerald for clean energy
      secondary: '#06b6d4', // Cyan for electric
    },
  },
  'grid': {
    colors: {
      primary: '#3b82f6', // Blue for power grid
      secondary: '#8b5cf6', // Violet for substation
    },
  },
  'industrial': {
    colors: {
      primary: '#6366f1', // Indigo for industrial
      secondary: '#8b5cf6', // Violet
    },
  },
  'medical': {
    colors: {
      primary: '#ec4899', // Pink for medical
      secondary: '#f43f5e', // Rose
    },
  },
};

/**
 * Get theme for a specific domain
 */
export function getThemeForDomain(domain: string, useDark = false): ThemeConfig {
  const baseTheme = useDark ? darkTheme : defaultTheme;
  const domainOverride = domainThemes[domain] || {};
  
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      ...domainOverride.colors,
    },
    ...Object.fromEntries(
      Object.entries(domainOverride).filter(([key]) => key !== 'colors')
    ),
  };
}

