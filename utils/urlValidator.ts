import { Platform } from '../types';

export function validateVideoUrl(url: string, platform: Platform): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;

  if (platform === 'tiktok') {
    return trimmed.includes('tiktok.com') && trimmed.includes('/video/');
  }
  if (platform === 'instagram') {
    return trimmed.includes('instagram.com') && (trimmed.includes('/reel/') || trimmed.includes('/p/'));
  }
  // 'both' — accept either
  const isTikTok = trimmed.includes('tiktok.com') && trimmed.includes('/video/');
  const isIG = trimmed.includes('instagram.com') && (trimmed.includes('/reel/') || trimmed.includes('/p/'));
  return isTikTok || isIG;
}

export function detectPlatformFromUrl(url: string): Platform | null {
  if (url.includes('tiktok.com')) return 'tiktok';
  if (url.includes('instagram.com')) return 'instagram';
  return null;
}
