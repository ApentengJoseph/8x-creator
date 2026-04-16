export interface ParsedVideoUrl {
  platform: 'tiktok' | 'instagram';
  username?: string;
  videoId?: string;
  reelId?: string;
  displayUrl: string;
}

export function parseVideoUrl(url: string): ParsedVideoUrl | null {
  const trimmed = url.trim();

  // TikTok: https://www.tiktok.com/@username/video/1234567890123456789
  const ttMatch = trimmed.match(/tiktok\.com\/@([^/?#]+)\/video\/(\d+)/);
  if (ttMatch) {
    return {
      platform: 'tiktok',
      username: ttMatch[1],
      videoId: ttMatch[2],
      displayUrl: `@${ttMatch[1]} · ${ttMatch[2].slice(0, 8)}...`,
    };
  }

  // TikTok short link: https://vm.tiktok.com/XXXXXXXX/
  const ttShort = trimmed.match(/vm\.tiktok\.com\/([A-Za-z0-9]+)/);
  if (ttShort) {
    return {
      platform: 'tiktok',
      videoId: ttShort[1],
      displayUrl: `vm.tiktok.com/${ttShort[1]}`,
    };
  }

  // Instagram Reel: https://www.instagram.com/reel/ABC123DEF456/
  const igReel = trimmed.match(/instagram\.com\/reel\/([A-Za-z0-9_-]+)/);
  if (igReel) {
    return {
      platform: 'instagram',
      reelId: igReel[1],
      displayUrl: `instagram.com/reel/${igReel[1].slice(0, 10)}...`,
    };
  }

  // Instagram post: https://www.instagram.com/p/ABC123/
  const igPost = trimmed.match(/instagram\.com\/p\/([A-Za-z0-9_-]+)/);
  if (igPost) {
    return {
      platform: 'instagram',
      reelId: igPost[1],
      displayUrl: `instagram.com/p/${igPost[1].slice(0, 10)}...`,
    };
  }

  return null;
}
