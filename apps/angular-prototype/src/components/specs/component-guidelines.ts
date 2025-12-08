/**
 * Component Design Guidelines
 * 
 * This file maps Supernova tokens to component specifications
 * Use this as a reference when building components
 */

import { DesignTokens } from '../../styles/tokens/tokens';

export const ComponentGuidelines = {
  // Button Specifications
  Button: {
    sizes: {
      small: {
        height: '32px',
        paddingX: '12px',
        paddingY: '6px',
        fontSize: '14px',
      },
      medium: {
        height: '40px',
        paddingX: '16px',
        paddingY: '8px',
        fontSize: '16px',
      },
      large: {
        height: '48px',
        paddingX: '24px',
        paddingY: '12px',
        fontSize: '18px',
      },
    },
    variants: {
      primary: {
        // Map to your Supernova tokens
        background: '#0066cc', // Update with actual token
        color: '#ffffff',
        border: 'none',
      },
      secondary: {
        background: '#6c757d',
        color: '#ffffff',
        border: 'none',
      },
      outline: {
        background: 'transparent',
        color: '#0066cc',
        border: '1px solid #0066cc',
      },
    },
    states: {
      hover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
      active: {
        transform: 'translateY(0)',
      },
      disabled: {
        opacity: '0.5',
        cursor: 'not-allowed',
      },
    },
  },

  // Input Field Specifications
  Input: {
    sizes: {
      small: {
        height: '32px',
        paddingX: '12px',
        paddingY: '6px',
        fontSize: '14px',
      },
      medium: {
        height: '40px',
        paddingX: '16px',
        paddingY: '8px',
        fontSize: '16px',
      },
      large: {
        height: '48px',
        paddingX: '20px',
        paddingY: '12px',
        fontSize: '18px',
      },
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '8px',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
    },
    states: {
      default: {
        border: '2px solid #e2e8f0',
        background: '#ffffff',
      },
      focus: {
        borderColor: '#0066cc',
        boxShadow: '0 0 0 3px rgba(0, 102, 204, 0.1)',
      },
      error: {
        borderColor: '#dc3545',
        boxShadow: '0 0 0 3px rgba(220, 53, 69, 0.1)',
      },
      disabled: {
        background: '#f5f5f5',
        cursor: 'not-allowed',
        opacity: '0.6',
      },
    },
  },

  // Checkbox Specifications
  Checkbox: {
    sizes: {
      small: {
        width: '16px',
        height: '16px',
      },
      medium: {
        width: '20px',
        height: '20px',
      },
      large: {
        width: '24px',
        height: '24px',
      },
    },
    label: {
      fontSize: '14px',
      marginLeft: '8px',
    },
    states: {
      default: {
        border: '2px solid #dee2e6',
        background: '#ffffff',
      },
      checked: {
        background: '#0066cc',
        borderColor: '#0066cc',
      },
      disabled: {
        opacity: '0.5',
        cursor: 'not-allowed',
      },
    },
  },

  // Avatar Specifications
  Avatar: {
    sizes: {
      xs: {
        width: '24px',
        height: '24px',
        fontSize: '12px',
      },
      small: {
        width: '32px',
        height: '32px',
        fontSize: '14px',
      },
      medium: {
        width: '40px',
        height: '40px',
        fontSize: '16px',
      },
      large: {
        width: '56px',
        height: '56px',
        fontSize: '20px',
      },
      xl: {
        width: '96px',
        height: '96px',
        fontSize: '32px',
      },
    },
    borderRadius: {
      square: '4px',
      rounded: '8px',
      circle: '50%',
    },
  },

  // Alert Banner Specifications
  AlertBanner: {
    variants: {
      info: {
        background: '#d1ecf1',
        color: '#0c5460',
        borderColor: '#bee5eb',
      },
      success: {
        background: '#d4edda',
        color: '#155724',
        borderColor: '#c3e6cb',
      },
      warning: {
        background: '#fff3cd',
        color: '#856404',
        borderColor: '#ffeeba',
      },
      error: {
        background: '#f8d7da',
        color: '#721c24',
        borderColor: '#f5c6cb',
      },
    },
    padding: '16px',
    borderRadius: '8px',
    borderWidth: '1px',
  },

  // Spacing Guidelines
  spacing: {
    component: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
    section: {
      sm: '24px',
      md: '48px',
      lg: '64px',
      xl: '96px',
    },
  },

  // Typography Guidelines
  typography: {
    heading: {
      h1: { fontSize: '48px', fontWeight: '700', lineHeight: '1.2' },
      h2: { fontSize: '32px', fontWeight: '700', lineHeight: '1.3' },
      h3: { fontSize: '24px', fontWeight: '600', lineHeight: '1.4' },
      h4: { fontSize: '20px', fontWeight: '600', lineHeight: '1.5' },
      h5: { fontSize: '18px', fontWeight: '600', lineHeight: '1.5' },
      h6: { fontSize: '16px', fontWeight: '600', lineHeight: '1.5' },
    },
    body: {
      large: { fontSize: '18px', lineHeight: '1.6' },
      normal: { fontSize: '16px', lineHeight: '1.5' },
      small: { fontSize: '14px', lineHeight: '1.5' },
      tiny: { fontSize: '12px', lineHeight: '1.4' },
    },
  },
} as const;

export type ComponentSize = 'small' | 'medium' | 'large';
export type ComponentVariant = 'primary' | 'secondary' | 'outline';
export type AlertVariant = 'info' | 'success' | 'warning' | 'error';


