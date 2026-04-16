export type Platform = 'tiktok' | 'instagram' | 'both';

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface ExampleVideo {
  id: string;
  thumbnailColor: string; // fallback color while thumbnail loads
  duration: string; // e.g. "0:28"
  views: string; // e.g. "1.2M"
  creator: string;
  url: string; // TikTok or Instagram share URL
  videoUrl: string | number; // direct MP4 URL or local require() asset for expo-video playback
}

export interface Campaign {
  id: string;
  brandName: string;
  brandAvatar: string; // initials or emoji
  brandAvatarColor: string;
  title: string;
  type: string; // e.g. "UGC Haul", "Gym POV"
  platform: Platform;
  payout: number; // in dollars
  deadline: string; // ISO date string
  daysLeft: number;
  brief: string;
  requirements: string[];
  exampleVideos: ExampleVideo[];
  spotsTotal: number;
  spotsLeft: number;
  acceptedCount: number;
}

export interface Submission {
  id: string;
  campaignId: string;
  campaignTitle: string;
  brandName: string;
  payout: number;
  platform: Platform;
  url: string;
  status: SubmissionStatus;
  submittedAt: string; // ISO date string
  reviewFeedback?: string;
  transitionAt?: number; // timestamp when auto-transition fires
}
