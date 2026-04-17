# 8x Creator

Creator-side submission flow for 8x Social. Built as a take-home project.

## What it is

A React Native mobile app (Expo) where creators can:

1. **Discover** active brand campaigns — payout, deadline, platform, scarcity
2. **Read the brief** — brand context, requirements, and example videos to watch and replicate
3. **Submit** a TikTok or Instagram video URL with live validation
4. **Track** submission status — pending, approved, rejected — with automatic status transitions (30s for demo purposes)

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Expo SDK 54 | Fastest path to a real device |
| Routing | expo-router | File-based, self-documenting |
| State | Zustand | 4 screens, no boilerplate |
| Styling | NativeWind v4 | Tailwind mental model, fast iteration |
| Video | expo-video v2 | Native playback with texture view on Android |
| Haptics | expo-haptics | Tactile feedback on key interactions |
| Gradients | expo-linear-gradient | Hero cards |
| Testing | jest-expo + Jest 30 | Unit tests for store and utilities |

## Running locally

```bash
cd 8x-creator
npm install
npx expo start
```

Then scan the QR code with **Expo Go** on your phone, or press `a` for Android emulator / `i` for iOS simulator.

> **Note:** Built and tested on iOS. Android should work but hasn't been verified.

## Running tests

```bash
npm test
```

53 tests across 5 suites — formatters, URL validator, URL parser, video playback singleton, and the Zustand submissions store.

## Project structure

```
app/
  _layout.tsx               # Root layout, wraps in Stack
  (tabs)/
    _layout.tsx             # Tab bar — Discover / My Work / Profile
    index.tsx               # Discover screen — campaign list with skeleton loader
    submissions.tsx         # Submissions screen — filter chips, status cards
    profile.tsx             # Profile overview with earnings summary
  campaign/[id].tsx         # Campaign detail — brief, requirements, example videos, CTA
  submit/[campaignId].tsx   # Submit flow — platform toggle, URL input, validation

components/
  CampaignCard.tsx          # Card with brand avatar, payout badge, platform icon
  VideoPlayer.tsx           # Inline + expandable video player (expo-video, loop)
  SubmissionCard.tsx        # Status-aware card (pending / approved / rejected)
  EarningsCard.tsx          # Animated earnings summary
  SkeletonCard.tsx          # Pulsing skeleton for initial load state
  FloatingTabBar.tsx        # Custom tab bar

data/
  campaigns.ts              # 6 mock campaigns (Gymshark, Celsius, Oura, etc.)

store/
  submissionsStore.ts       # Zustand — submission list, status transitions, earnings

types/
  index.ts                  # Campaign, Submission, Platform, SubmissionStatus

utils/
  formatters.ts             # formatPayout, formatDeadline, formatTimeAgo, formatPlatform
  urlValidator.ts           # validateVideoUrl, detectPlatformFromUrl
  urlParser.ts              # extractVideoId, normaliseUrl
  videoPlayback.ts          # Singleton — one active player at a time

__tests__/
  store/submissionsStore.test.ts
  utils/formatters.test.ts
  utils/urlValidator.test.ts
  utils/urlParser.test.ts
  utils/videoPlayback.test.ts

ai-logs/                    # Session logs from the build
```

## Key behaviors

**Video gate:** The "Submit your video" CTA on the campaign detail screen is locked until the creator watches at least one example video. This ensures creators understand what the brief is asking for before submitting.

**Video playback:** Example videos in campaign detail play inline with a tap, expand to full-screen on a second tap, and are compressed to ~27 MB total. Only one video plays at a time — the `videoPlayback` singleton stops the previous player when a new one claims playback.

**Status transitions:** Submissions auto-transition from pending → approved (70%) or rejected (30%) after 30 seconds. This demos the state machine without requiring manual action from the reviewer.

**Earnings counter:** Updates via `Animated.timing` whenever a submission is approved.

**Haptic feedback:** Fires on tab switch, URL validation success, submit, and pull-to-refresh.

## What I'd build next

1. **AI scoring preview in the submit flow** — as the creator pastes a URL, a background job scores the video against the brief before they hit submit ("your hook is at 3.2s — try cutting the first second"). This is the core 8x product thesis as a UX feature.
2. **Onboarding state for empty submissions** — first-time creator opens the app with 0 submissions; the empty state should sell them on earning potential, not just say "nothing here".
3. **Similar campaigns rail** on the campaign detail — drives deeper exploration once a creator passes on a brief.
4. **Filter + search on the campaign list** — 6 campaigns doesn't need it, 60 would. The data model supports it (category field is on the `Campaign` type).
5. **Push notifications for status transitions** — right now the 30s timer is fine for a demo, but in production a creator won't be staring at the screen.
