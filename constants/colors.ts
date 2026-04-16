import { ViewStyle } from 'react-native';

export const C = {
  // ─── Backgrounds ───────────────────────────────────────────────
  bg: '#f4f3f1',          // warm off-white
  bgDeep: '#eceae6',      // slightly deeper for nested surfaces
  card: '#ffffff',         // pure white card

  // ─── Text ──────────────────────────────────────────────────────
  text: '#18181b',         // near-black primary
  textMid: '#71717a',      // zinc-500 secondary
  textDim: '#a1a1aa',      // zinc-400 tertiary

  // ─── Borders ───────────────────────────────────────────────────
  border: 'rgba(0,0,0,0.06)',
  borderMid: 'rgba(0,0,0,0.10)',
  borderStrong: 'rgba(0,0,0,0.15)',

  // ─── Green accent ──────────────────────────────────────────────
  green: '#16a34a',
  greenDark: '#166534',
  greenBg: 'rgba(22,163,74,0.08)',
  greenBgMid: 'rgba(22,163,74,0.12)',
  greenBorder: 'rgba(22,163,74,0.22)',
  greenText: '#15803d',

  // ─── Status — amber ────────────────────────────────────────────
  amber: '#d97706',
  amberBg: 'rgba(217,119,6,0.08)',
  amberBorder: 'rgba(217,119,6,0.2)',

  // ─── Status — red ──────────────────────────────────────────────
  red: '#dc2626',
  redBg: 'rgba(220,38,38,0.06)',
  redBorder: 'rgba(220,38,38,0.18)',

  // ─── Shadows ───────────────────────────────────────────────────
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  } as ViewStyle,

  shadowMd: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 18,
    elevation: 6,
  } as ViewStyle,

  shadowLg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 10,
  } as ViewStyle,
};
