# 8x Creator

Creator-side submission flow for 8x Social. Built as a take-home project.

## What it is

A React Native mobile app (Expo) where creators can:

1. **Discover** active brand campaigns — payout, deadline, platform, scarcity
2. **Read the brief** — brand context, requirements, and example videos to replicate
3. **Submit** a TikTok or Instagram video URL with live validation
4. **Track** submission status — pending, approved, rejected — with automatic status transitions (30s for demo purposes)

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Expo SDK 54 | Fastest path to a real device |
| Routing | expo-router | File-based, self-documenting |
| State | Zustand | 4 screens, no boilerplate |
| Styling | NativeWind v4 | Tailwind mental model, fast iteration |
| Animations | React Native's `Animated` API | Built-in, no extra deps |
| Haptics | expo-haptics | Tactile feedback on key interactions |
| Gradients | expo-linear-gradient | Hero cards |

## Running locally

```bash
cd 8x-creator
npm install
npx expo start
```

Then scan the QR code with **Expo Go** on your phone, or press `a` for Android emulator / `i` for iOS simulator.

> **Note:** This was built and tested on iOS. Android should work but hasn't been verified.

## Project structure

```
app/
  _layout.tsx          # Root layout — imports global.css, wraps in Stack
  (tabs)/
    _layout.tsx        # Tab bar with Discover / My work / Profile
    index.tsx          # Discover screen — campaign list with skeleton loader
    submissions.tsx    # Submissions screen — filter chips, status cards
    profile.tsx        # Placeholder
  campaign/[id].tsx    # Campaign detail — brief, requirements, example videos, CTA
  submit/[campaignId].tsx  # Submit flow — URL input, validation, confirmation

components/
  CampaignCard.tsx     # Card with brand avatar, payout pill, platform badge
  SubmissionCard.tsx   # Status-aware card (pending/approved/rejected states)
  EarningsCard.tsx     # Animated earnings summary at top of Discover
  VideoThumbnail.tsx   # Styled placeholder for example videos (9:16, no playback)
  SkeletonCard.tsx     # Pulsing skeleton for initial load state

data/
  campaigns.ts         # 6 realistic mock campaigns (Gymshark, Celsius, Oura, etc.)

store/
  submissionsStore.ts  # Zustand — submission list, status transitions, earnings

types/
  index.ts             # Campaign, Submission, Platform, SubmissionStatus

utils/
  formatters.ts        # formatPayout, formatDeadline, formatTimeAgo
  urlValidator.ts      # validateVideoUrl, detectPlatformFromUrl

ai-logs/               # Session logs from the build
docs/                  # DECISIONS.md, REFLECTION.md
```

## Key behaviors

**Status transitions:** Submissions auto-transition from pending → approved (70%) or rejected (30%) after 30 seconds. This demos the state machine without requiring any manual action from the reviewer.

**URL validation:** `validateVideoUrl` checks for `tiktok.com` + `/video/` or `instagram.com` + `/reel/` — no regex, 95% coverage. Server-side validation against platform APIs would handle the edge cases in production.

**Earnings counter:** The earnings card at the top of Discover updates via `Animated.timing` whenever a submission is approved.

**Haptic feedback:** Fires on tab switch, URL validation success, submit, pull-to-refresh.

## What I'd build next

See [`docs/REFLECTION.md`](./docs/REFLECTION.md) — ranked list of what would add the most value with more time. The short version: real video playback for example videos, and an AI scoring preview in the submit flow (the core 8x product thesis as a UX feature).
