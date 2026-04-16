import { create } from 'zustand';
import { Submission, SubmissionStatus } from '../types';

interface SubmissionsState {
  submissions: Submission[];
  totalEarnings: number;
  addSubmission: (submission: Omit<Submission, 'id' | 'submittedAt' | 'status' | 'transitionAt'>) => void;
  updateStatus: (id: string, status: SubmissionStatus, feedback?: string) => void;
  getByStatus: (status: SubmissionStatus | 'all') => Submission[];
  scheduleTransition: (id: string) => void;
}

let idCounter = 1;

function generateId(): string {
  return `sub-${Date.now()}-${idCounter++}`;
}

const D = 24 * 60 * 60 * 1000; // one day in ms
const now = Date.now();

// Realistic seed data — makes the app look lived-in from the first open
const SEED: Submission[] = [
  {
    id: 'seed-001',
    campaignId: 'camp-001',
    campaignTitle: 'Show us your morning lift',
    brandName: 'Gymshark',
    payout: 180,
    platform: 'tiktok',
    url: 'https://www.tiktok.com/@fitwithmaya/video/7312891234567890123',
    status: 'approved',
    submittedAt: new Date(now - 22 * D).toISOString(),
  },
  {
    id: 'seed-002',
    campaignId: 'camp-003',
    campaignTitle: 'Wear your recovery data',
    brandName: 'Oura',
    payout: 220,
    platform: 'instagram',
    url: 'https://www.instagram.com/reel/DWy1p6vN-7V/',
    status: 'approved',
    submittedAt: new Date(now - 15 * D).toISOString(),
  },
  {
    id: 'seed-003',
    campaignId: 'camp-006',
    campaignTitle: 'The greens you\'ll actually drink',
    brandName: 'AG1',
    payout: 210,
    platform: 'tiktok',
    url: 'https://www.tiktok.com/@fitwithmaya/video/7321045678901234567',
    status: 'approved',
    submittedAt: new Date(now - 7 * D).toISOString(),
  },
  {
    id: 'seed-004',
    campaignId: 'camp-002',
    campaignTitle: 'Energy all day, no crash',
    brandName: 'Celsius',
    payout: 150,
    platform: 'tiktok',
    url: 'https://www.tiktok.com/@fitwithmaya/video/7305678901234567890',
    status: 'rejected',
    submittedAt: new Date(now - 18 * D).toISOString(),
    reviewFeedback: 'Hook needs to be faster — viewer dropped off at second 4. Try opening mid-action.',
  },
  {
    id: 'seed-005',
    campaignId: 'camp-004',
    campaignTitle: 'Flow into your practice',
    brandName: 'Alo Yoga',
    payout: 200,
    platform: 'instagram',
    url: 'https://www.instagram.com/reel/DZk9mB2N8xQ/',
    status: 'pending',
    submittedAt: new Date(now - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
  },
];

const SEED_EARNINGS = SEED
  .filter((s) => s.status === 'approved')
  .reduce((sum, s) => sum + s.payout, 0); // 180 + 220 + 210 = 610

export const useSubmissionsStore = create<SubmissionsState>((set, get) => ({
  submissions: SEED,
  totalEarnings: SEED_EARNINGS,

  addSubmission: (data) => {
    const id = generateId();
    const newSubmission: Submission = {
      ...data,
      id,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      transitionAt: Date.now() + 30_000,
    };

    set((state) => ({
      submissions: [newSubmission, ...state.submissions],
    }));

    get().scheduleTransition(id);
  },

  scheduleTransition: (id: string) => {
    setTimeout(() => {
      const submission = get().submissions.find((s) => s.id === id);
      if (!submission || submission.status !== 'pending') return;

      const approved = Math.random() > 0.3; // 70% approve

      const REJECTION_FEEDBACK = [
        'Hook needs to be faster — viewer dropped off at second 4. Try opening mid-action.',
        'Product visibility was too brief. We need the brand piece on screen for at least 3 seconds.',
        'Video length was outside spec (must be 20–45s). Please re-submit at the right length.',
        'Missing brand tag in caption. Please add @brand and re-submit.',
      ];

      get().updateStatus(
        id,
        approved ? 'approved' : 'rejected',
        approved ? undefined : REJECTION_FEEDBACK[Math.floor(Math.random() * REJECTION_FEEDBACK.length)],
      );
    }, 30_000);
  },

  updateStatus: (id, status, feedback) => {
    set((state) => {
      const updated = state.submissions.map((s) => {
        if (s.id !== id) return s;
        return { ...s, status, reviewFeedback: feedback };
      });

      const newEarnings = updated
        .filter((s) => s.status === 'approved')
        .reduce((sum, s) => sum + s.payout, 0);

      return { submissions: updated, totalEarnings: newEarnings };
    });
  },

  getByStatus: (filter) => {
    const { submissions } = get();
    if (filter === 'all') return submissions;
    return submissions.filter((s) => s.status === filter);
  },
}));
