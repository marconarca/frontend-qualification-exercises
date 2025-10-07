export type ColorTokens = {
  background: string;
  foreground: string;
  secondaryBackground: string;
  primary: string;
  secondary: string;
  muted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  ring: string;
  neutral: string;
  heroOverlay: string;
};

export type TypographyTokens = {
  fontFamilySans: string;
  fontFamilyMono: string;
  baseSize: string;
  lineHeight: string;
  weightRegular: number;
  weightMedium: number;
  weightBold: number;
};

export type RadiusTokens = {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
};

export type SpacingScale = {
  /** 0px */ 0: string;
  /** 4px */ 1: string;
  /** 8px */ 2: string;
  /** 12px */ 3: string;
  /** 16px */ 4: string;
  /** 20px */ 5: string;
  /** 24px */ 6: string;
  /** 32px */ 8: string;
  /** 40px */ 10: string;
  /** 48px */ 12: string;
  /** 64px */ 16: string;
};

export type BreakpointTokens = {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
};

export type ThemeTokens = {
  colors: ColorTokens;
  typography: TypographyTokens;
  radius: RadiusTokens;
  spacing: SpacingScale;
  breakpoints: BreakpointTokens;
};

export const tokens: ThemeTokens = {
  colors: {
    background: '#0A1117',
    foreground: '#0B1D26',
    primary: '#ffffff',
    secondary: '#FBBD2C',
    secondaryBackground: '#0C1820',
    muted: '#667085',
    border: '#0A1117',
    success: '#16a34a',
    warning: '#B93815',
    error: '#C01048',
    ring: '#55160C',
    neutral: '#CECFD2',
    heroOverlay: 'rgba(0,0,0,0.85)',
  },
  typography: {
    fontFamilySans:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    fontFamilyMono:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    baseSize: '16px',
    lineHeight: '1.6',
    weightRegular: 400,
    weightMedium: 500,
    weightBold: 700,
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
  },
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1440px',
  },
};
