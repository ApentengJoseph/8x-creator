# Architecture Decisions

Short record of trade-offs I made. Written for a future me or a teammate reading the code cold.

## State management: Zustand

**Chose:** Zustand with a single `submissionsStore`.

**Over:** Redux Toolkit (overkill), Context (re-render problems at list scale), Jotai (great but I haven't shipped with it).

**Why:** 4 screens, shared submission list, auto-transitioning statuses. Zustand's API fits the problem. ~1KB. No provider boilerplate.

## Routing: expo-router

**Chose:** File-based routing.

**Over:** React Navigation's stack API.

**Why:** Next.js-style conventions carry over. The structure self-documents. `app/campaign/[id].tsx` is obvious; `createNativeStackNavigator` with a dozen `Screen` entries is not.

## Styling: NativeWind

**Chose:** Tailwind-for-RN via NativeWind v4.

**Over:** StyleSheet.create, Restyle, styled-components.

**Why:** Fast iteration. Inline classes mean I can change padding without jumping files. Matches the Next.js codebase 8x uses on the web — consistent mental model.

**Trade-off:** Build-time config is finicky. I set it up once and haven't touched it.

## Data fetching: none

**Chose:** Mock data imported from `data/campaigns.ts`.

**Why:** Brief explicitly said mocked is fine. Real app would use TanStack Query (which 8x's stack uses). I structured the Zustand store to hide the data source, so swapping to TanStack Query is a ~20-line change.

## Video example playback: gradient thumbnails

**Chose:** Styled placeholders with play-button overlay.

**Over:** expo-av with real HLS streams.

**Why:** Real video = 60+ min for a demo feature. Thumbnails communicate "there are example videos here" clearly. I'd swap this for expo-av in week 1 of a real engagement.

## URL validation: naive

**Chose:** `url.includes('tiktok.com') && url.includes('/video/')` (and IG equivalent).

**Over:** A proper URL parser with regex.

**Why:** 95% coverage, zero edge-case bugs, readable. The real app will validate server-side against the actual platform APIs anyway.

## Testing: none in this submission

**Chose:** No tests.

**Why:** 5-hour budget. Writing tests for mock-data code is ceremony.

**What I would test:** Zustand store transitions, URL validators, currency/time formatters. Those are pure, deterministic, and the most likely to regress. ~30 min of Jest tests would cover the actual risk surface.

## Status transitions: timer-based

**Chose:** Pending submissions auto-transition to approved (or rejected, 30% chance) after 30s via a setTimeout in the store.

**Over:** A button to manually set status for demo.

**Why:** Manual buttons scream "demo". Timer-based transitions mean the reviewer submits and sees the real UX. The reviewer doesn't have to do anything — the system demonstrates itself.

**Downside:** If you navigate away immediately after submitting and come back in 2 min, you miss the transition. Acceptable for a demo. In production this would be a push notification.
