import { ViewStyle } from 'react-native';

export const C = {
  // ─── Backgrounds ───────────────────────────────────────────────
  bg: '#F7F7F5',            // Linktree warm off-white page background
  bgDeep: '#EDEDE9',        // slightly deeper — inputs, nested surfaces
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',

  // ─── Text ──────────────────────────────────────────────────────
  text: '#1E2330',          // Linktree Squid Ink — near-black
  textMid: '#737373',       // mid-grey secondary
  textDim: '#AAAAAA',       // light grey tertiary

  // ─── Borders ───────────────────────────────────────────────────
  border: 'rgba(0,0,0,0.07)',
  borderMid: 'rgba(0,0,0,0.12)',
  borderStrong: 'rgba(0,0,0,0.18)',

  // ─── Green — Linktree Pastel Green #42E661 ────────────────────
  green: '#42E661',         // button fills, active states
  greenDark: '#1A7A2C',
  greenBg: 'rgba(66,230,97,0.09)',
  greenBgMid: 'rgba(66,230,97,0.15)',
  greenBorder: 'rgba(66,230,97,0.40)',
  greenText: '#1A7A2C',     // dark green text on white — AA accessible

  // ─── Status — amber ────────────────────────────────────────────
  amber: '#FF9500',
  amberBg: 'rgba(255,149,0,0.08)',
  amberBorder: 'rgba(255,149,0,0.28)',

  // ─── Status — red ──────────────────────────────────────────────
  red: '#FF3B30',
  redBg: 'rgba(255,59,48,0.06)',
  redBorder: 'rgba(255,59,48,0.22)',

  // ─── Shadows (minimal — Linktree style) ────────────────────────
  shadow: {
    shadowColor: '#1E2330',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  } as ViewStyle,

  shadowMd: {
    shadowColor: '#1E2330',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  } as ViewStyle,

  shadowLg: {
    shadowColor: '#1E2330',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 22,
    elevation: 6,
  } as ViewStyle,
};
