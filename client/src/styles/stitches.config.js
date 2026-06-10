import { createStitches, keyframes as stitchesKeyframes } from '@stitches/react';

export const fadeUp = stitchesKeyframes({
  '0%': { opacity: 0, transform: 'translateY(24px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

export const shimmer = stitchesKeyframes({
  '0%': { backgroundPosition: '-200% center' },
  '100%': { backgroundPosition: '200% center' },
});

export const {
  styled,
  css,
  globalCss,
  theme,
  createTheme,
  getCssText,
  keyframes,
} = createStitches({
  theme: {
    colors: {
      bg: '#0a0908',
      bgElevated: '#141210',
      bgCard: '#1a1714',
      bgHover: '#221e1a',
      gold: '#c9a962',
      goldLight: '#e8d5a3',
      goldDark: '#8a7340',
      cream: '#f5f0e8',
      creamMuted: '#b8b0a4',
      text: '#f5f0e8',
      textMuted: '#9a9288',
      border: 'rgba(201, 169, 98, 0.2)',
      borderStrong: 'rgba(201, 169, 98, 0.45)',
      success: '#6bcf8a',
      error: '#e85d5d',
      overlay: 'rgba(10, 9, 8, 0.85)',
    },
    fonts: {
      display: '"Cormorant Garamond", Georgia, serif',
      body: '"Outfit", system-ui, sans-serif',
    },
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '2rem',
      '4xl': '2.75rem',
      '5xl': '3.5rem',
      hero: 'clamp(2.5rem, 6vw, 4.5rem)',
    },
    space: {
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
    },
    radii: {
      sm: '6px',
      md: '12px',
      lg: '20px',
      xl: '28px',
      full: '9999px',
    },
    shadows: {
      glow: '0 0 40px rgba(201, 169, 98, 0.15)',
      card: '0 8px 32px rgba(0, 0, 0, 0.4)',
      elevated: '0 16px 48px rgba(0, 0, 0, 0.5)',
    },
  },
  media: {
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
  },
});

export const globalStyles = globalCss({
  '*, *::before, *::after': { boxSizing: 'border-box', margin: 0, padding: 0 },
  html: { scrollBehavior: 'smooth' },
  body: {
    fontFamily: '$body',
    backgroundColor: '$bg',
    color: '$text',
    lineHeight: 1.6,
    minHeight: '100vh',
    overflowX: 'hidden',
  },
  '#root': { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  '::selection': { background: '$gold', color: '$bg' },
  img: { maxWidth: '100%', display: 'block' },
  a: { color: 'inherit', textDecoration: 'none' },
  button: { fontFamily: 'inherit', cursor: 'pointer', border: 'none', background: 'none' },
  'input, select, textarea': { fontFamily: 'inherit' },
});
