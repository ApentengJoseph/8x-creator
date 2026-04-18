import { ViewStyle } from 'react-native';

export const C = {
  // ─── Backgrounds ───────────────────────────────────────────────
  bg: '#000000',            // page background
  bg1: '#111111',           // card / surface
  bg2: '#1a1a1a',           // nested surface
  bg3: '#222222',           // deepest element (tags, icons bg)
  // legacy aliases kept so existing code compiles
  bgDeep: '#1a1a1a',
  card: '#111111',
  cardElevated: '#1a1a1a',

  // ─── Text ──────────────────────────────────────────────────────
  text: '#FFFFFF',
  textMid: 'rgba(255,255,255,0.6)',
  textDim: 'rgba(255,255,255,0.3)',

  // ─── Borders ───────────────────────────────────────────────────
  border: 'rgba(255,255,255,0.08)',
  borderMid: 'rgba(255,255,255,0.12)',
  borderStrong: 'rgba(255,255,255,0.18)',

  // ─── Accent — violet / pink gradient ──────────────────────────
  accent: '#a855f7',        // violet
  accentB: '#ec4899',       // pink
  accentGradStart: '#a855f7',
  accentGradEnd: '#ec4899',

  // ─── Legacy green aliases (submit / requirements UI) ──────────
  green: '#22c55e',
  greenDark: '#16a34a',
  greenBg: 'rgba(34,197,94,0.10)',
  greenBgMid: 'rgba(34,197,94,0.15)',
  greenBorder: 'rgba(34,197,94,0.30)',
  greenText: '#22c55e',

  // ─── Status — amber ────────────────────────────────────────────
  amber: '#f59e0b',
  amberBg: 'rgba(245,158,11,0.12)',
  amberBorder: 'rgba(245,158,11,0.30)',

  // ─── Status — red ──────────────────────────────────────────────
  red: '#ef4444',
  redBg: 'rgba(239,68,68,0.10)',
  redBorder: 'rgba(239,68,68,0.25)',

  // ─── Shadows ───────────────────────────────────────────────────
  shadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 3,
  } as ViewStyle,

  shadowMd: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 6,
  } as ViewStyle,

  shadowLg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 10,
  } as ViewStyle,

  // ─── Accent glow shadow ────────────────────────────────────────
  shadowAccent: {
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  } as ViewStyle,
};
