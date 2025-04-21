import { ThemeVars } from '@mysten/dapp-kit';

export const customTheme: ThemeVars = {
  blurs: {
    modalOverlay: 'blur(8px)',
  },
  backgroundColors: {
    primaryButton: 'hsl(var(--background))',
    primaryButtonHover: 'hsl(var(--secondary))',
    outlineButtonHover: 'hsl(var(--secondary))',
    modalOverlay: 'rgba(24, 36, 53, 0.2)',
    modalPrimary: 'hsl(var(--card))',
    modalSecondary: 'hsl(var(--secondary))',
    iconButton: 'transparent',
    iconButtonHover: 'hsl(var(--secondary))',
    dropdownMenu: 'hsl(var(--card))',
    dropdownMenuSeparator: 'hsl(var(--border))',
    walletItemSelected: 'hsl(var(--secondary))',
    walletItemHover: 'hsl(var(--secondary))',
  },
  borderColors: {
    outlineButton: 'hsl(var(--primary))',
  },
  colors: {
    primaryButton: 'hsl(var(--primary))',
    outlineButton: 'hsl(var(--primary))',
    iconButton: 'hsl(var(--foreground))',
    body: 'hsl(var(--foreground))',
    bodyMuted: 'hsl(var(--muted-foreground))',
    bodyDanger: 'hsl(var(--destructive))',
  },
  radii: {
    small: 'var(--radius)',
    medium: 'var(--radius)',
    large: 'var(--radius)',
    xlarge: 'var(--radius)',
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
    small: '14px',
    medium: '16px',
    large: '18px',
    xlarge: '20px',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontStyle: 'normal',
    lineHeight: '1.3',
    letterSpacing: '1',
  },
}; 