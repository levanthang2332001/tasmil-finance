import { ThemeVars } from '@mysten/dapp-kit';

export const customTheme: ThemeVars = {
  blurs: {
    modalOverlay: 'blur(8px)',
  },
  backgroundColors: {
    primaryButton: 'hsl(var(--primary))',
    primaryButtonHover: 'hsl(var(--primary) / 0.9)',
    outlineButtonHover: 'hsl(var(--accent))',
    modalOverlay: 'rgba(24, 36, 53, 0.2)',
    modalPrimary: 'hsl(var(--card))',
    modalSecondary: 'hsl(var(--secondary))',
    iconButton: 'transparent',
    iconButtonHover: 'hsl(var(--accent))',
    dropdownMenu: 'hsl(var(--card))',
    dropdownMenuSeparator: 'hsl(var(--border))',
    walletItemSelected: 'hsl(var(--secondary))',
    walletItemHover: 'hsl(var(--accent))',
  },
  borderColors: {
    outlineButton: 'hsl(var(--input))',
  },
  colors: {
    primaryButton: 'hsl(var(--primary-foreground))',
    outlineButton: 'hsl(var(--primary))',
    iconButton: 'hsl(var(--foreground))',
    body: 'hsl(var(--foreground))',
    bodyMuted: 'hsl(var(--muted-foreground))',
    bodyDanger: 'hsl(var(--destructive))',
  },
  radii: {
    small: '0.375rem',
    medium: '0.5rem',
    large: '0.75rem',
    xlarge: '0.75rem',
  },
  shadows: {
    primaryButton: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    walletItemSelected: '0px 2px 6px rgba(0, 0, 0, 0.05)',
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    bold: '600',
  },
  fontSizes: {
    small: '0.875rem',
    medium: '0.875rem',
    large: '1rem',
    xlarge: '1.125rem',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontStyle: 'normal',
    lineHeight: '1.3',
    letterSpacing: '1',
  },
}; 