import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import { tokens } from '../theme/tokens';

const spacingScale = Object.fromEntries(
  Object.entries(tokens.spacing).map(([key, value]) => [key.toString(), value])
);

const screens = {
  xs: tokens.breakpoints.xs,
  sm: tokens.breakpoints.sm,
  md: tokens.breakpoints.md,
  lg: tokens.breakpoints.lg,
  xl: tokens.breakpoints.xl,
};

const fontFamilySans = tokens.typography.fontFamilySans
  .split(',')
  .map((font) => font.trim().replace(/^['"](.*)['"]$/, '$1'));

const fontFamilyMono = tokens.typography.fontFamilyMono
  .split(',')
  .map((font) => font.trim().replace(/^['"](.*)['"]$/, '$1'));

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens,
    extend: {
      colors: {
        background: tokens.colors.background,
        foreground: tokens.colors.primary,
        primary: tokens.colors.primary,
        secondary: tokens.colors.secondary,
        muted: tokens.colors.muted,
        border: tokens.colors.border,
        success: tokens.colors.success,
        warning: tokens.colors.warning,
        error: tokens.colors.error,
        ring: tokens.colors.ring,
        neutral: tokens.colors.neutral,
        overlay: tokens.colors.heroOverlay,
        'background-secondary': tokens.colors.secondaryBackground,
      },
      spacing: spacingScale,
      borderRadius: {
        sm: tokens.radius.sm,
        md: tokens.radius.md,
        lg: tokens.radius.lg,
        xl: tokens.radius.xl,
        full: tokens.radius.full,
      },
      fontFamily: {
        sans: fontFamilySans,
        mono: fontFamilyMono,
      },
      fontWeight: {
        normal: tokens.typography.weightRegular,
        medium: tokens.typography.weightMedium,
        bold: tokens.typography.weightBold,
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ':root': {
          '--color-background': tokens.colors.background,
          '--color-foreground': tokens.colors.primary,
          '--color-secondary': tokens.colors.secondary,
          '--color-muted': tokens.colors.muted,
          '--color-border': tokens.colors.border,
          '--color-success': tokens.colors.success,
          '--color-warning': tokens.colors.warning,
          '--color-error': tokens.colors.error,
          '--color-ring': tokens.colors.ring,
          '--color-neutral': tokens.colors.neutral,
          '--overlay': tokens.colors.heroOverlay,
          '--font-line-height': tokens.typography.lineHeight,
        },
        body: {
          backgroundColor: tokens.colors.background,
          color: tokens.colors.primary,
          fontFamily: tokens.typography.fontFamilySans,
          lineHeight: tokens.typography.lineHeight,
        },
      });
    }),
  ],
};

export default config;
