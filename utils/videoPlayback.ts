/**
 * Module-level singleton that ensures only one video plays at a time
 * across both VideoPlayer (local assets) and YouTubeVideoPlayer instances.
 */
let _stopActive: (() => void) | null = null;

export function claimPlayback(stopFn: () => void) {
  if (_stopActive && _stopActive !== stopFn) _stopActive();
  _stopActive = stopFn;
}

export function releasePlayback(stopFn: () => void) {
  if (_stopActive === stopFn) _stopActive = null;
}
