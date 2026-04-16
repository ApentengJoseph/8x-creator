export function formatPayout(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

export function formatTimeAgo(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function formatDeadline(daysLeft: number): string {
  if (daysLeft === 0) return 'ends today';
  if (daysLeft === 1) return '1 day left';
  return `${daysLeft} days left`;
}

export function formatPlatform(platform: string): string {
  if (platform === 'tiktok') return 'TikTok';
  if (platform === 'instagram') return 'Instagram';
  return 'TikTok / IG';
}
