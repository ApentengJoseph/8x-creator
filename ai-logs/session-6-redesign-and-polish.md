# Session 6 — Linktree Redesign, Real Images & Native Polish

Context: Previous sessions produced a working app. Feedback from a reviewer said it looked too generic. This session: full visual redesign, native-feel animations, real photos, and a live link-preview API on the submit flow.

---

**Me:** Can you totally change the design to look like a creator app — like Linktree?

**Claude:** [proposes Linktree light-theme palette and structural changes]

**Me:** Do it in great detail. Can you do the same to the rest of the pages — campaign details, submit video, and profile?

**Claude:** Full redesign across all screens:
1. Rewrites `constants/colors.ts` — Linktree palette (`#F7F7F5` bg, `#FFFFFF` cards, `#1E2330` Squid Ink, `#42E661` Pastel Green)
2. Hides tab bar (`tabBar={() => null}`) — combines Discover + My Work into one `index.tsx` with a segmented pill control
3. Adds profile avatar button to top-right header, routes to `/(tabs)/profile`
4. Rebuilds all five screens: home, campaign detail, submit, submissions, profile
5. CampaignCard and SubmissionCard rewritten as Linktree link-button rows

---

**Me:** Improve to have that native feel with motions and things like a real app. The submit video page not looking like it improved, can you redesign. Also the hand icon — replace with an avatar or free profile picture, and redesign profile and campaign details.

**Claude:**
- Creates `components/UserAvatar.tsx` — initials-based avatar (dark green circle, white text, green ring, online dot). Accepts `imageUrl` prop with error fallback to initials
- Replaces all 👋 emoji with `UserAvatar` throughout
- `profile.tsx` redesign: real Unsplash cover photo, avatar overlapping the cover edge (Instagram style), animated scale+fade on mount, press-scale spring on each settings row
- `campaign/[id].tsx` redesign: real banner photo, brand logo centered on banner, scroll-driven header title fade-in, parallax banner, spring-scale CTA
- `submit/[campaignId].tsx` redesign: numbered step labels (1/2/3), clean segmented platform toggle (no green), URL shake animation on invalid blur, animated preview card springs in, animated success screen with pulsing ring
- `index.tsx`: animated sliding pill indicator on segmented control using `useWindowDimensions`

---

**Me:** Android bundled — ERROR: Attempting to run JS driven animation on animated node that has been moved to "native" earlier.

**Claude:** Two root causes:
1. `profile.tsx` `MenuItem` used `Animated.parallel` mixing `useNativeDriver: true` (scale) and `useNativeDriver: false` (backgroundColor) on different values — React Native forbids this within a single parallel call. Fix: remove animated `backgroundColor`, use `activeOpacity` only, keep just the scale spring
2. `index.tsx` segmented control: conditional `{segWidth > 0 && <Animated.View>}` caused the native animation node to be registered, then unmounted, then re-attached — causing the "moved to native" conflict. Fix: replace `useState(0)` + `onLayout` with `useWindowDimensions()` so the indicator renders unconditionally

---

**Me:** Also use real images — for the TJ avatar and the campaigns.

**Claude:**
- Adds `logoUrl?` and `bannerImageUrl?` to `Campaign` type
- Updates `data/campaigns.ts` with Unsplash banner photos and Clearbit logo URLs for all 6 brands
- `UserAvatar` updated to render `<Image>` when `imageUrl` provided, with `onError` fallback to initials
- `CampaignCard` updated with `BrandLogo` component — shows brand logo in a rounded square, falls back to colored initials
- `campaign/[id].tsx` banner replaced with full-bleed `<Image>` + dark overlay, brand logo centered on top

---

**Me:** Update campaign logo URLs to use logo.dev API — `https://img.logo.dev/{domain}?token=...&retina=true`

**Claude:** [replaces all 6 `logo.clearbit.com` URLs with `img.logo.dev` equivalents using the provided token]

---

**Me:** The platform selection on submit video looks weirdly designed — the green is too much.

**Claude:** Replaces the two tall green card toggles with a clean segmented control: `C.bgDeep` container, active platform gets a white `C.card` pill with shadow, no green anywhere — just `C.text` vs `C.textDim` for active/inactive.

---

**Me:** Navigating back from campaign detail shows blank white.

**Claude:** Two fixes:
1. `app/(tabs)/_layout.tsx` — Tabs had no `contentStyle` background, so the Tabs layer showed white beneath the campaign card during the slide-back transition. Fix: add `contentStyle: { backgroundColor: '#F7F7F5' }`
2. `app/campaign/[id].tsx` — `Animated.ScrollView` with `useNativeDriver: true` registers native animation nodes that conflict with the screen unmount during back navigation, causing a white flash. Fix: replace with regular `ScrollView` + `onScroll` JS handler that triggers a short `Animated.timing` only on threshold crossings (90px)

---

**Me:** Use the LinkPreview API (my.linkpreview.net) on the submit video page to show real preview data.

**Claude:**
- API: `GET https://api.linkpreview.net/?q=<url>` with `X-Linkpreview-Api-Key` header
- Adds `LinkPreview` interface (`title`, `description`, `image`, `url`)
- Adds `preview`, `previewLoading` state and `lastFetchedUrl` ref (prevents duplicate fetches for same URL)
- `useEffect` watches `[isUrlValid, url]`: resets on invalid, fetches on new valid URL, aborts on cleanup
- Preview card: springs in as soon as URL is valid, shows animated skeleton rows + `ActivityIndicator` while loading, then swaps to thumbnail image (180px, cover), title, description, platform icon
- Clear/platform-switch resets preview and collapses card

---

**Me:** The "I confirm" checkbox looks too green.

**Claude:** Removes green background and border from the confirmation card container — card stays white with a subtle `C.border`. Only the checkbox square itself turns green when checked.

---

## Notes to self

- `Animated.parallel` with mixed `useNativeDriver` values is a hard error in RN — even on *different* `Animated.Value` instances within the same call. Keep all animations in a parallel on the same driver, or call `.start()` separately
- Conditional rendering of `Animated.View` after a native-driver animation has been registered causes the "moved to native" error — compute width from `useWindowDimensions` at render time instead of tracking it with `onLayout` state
- `Animated.ScrollView` + `useNativeDriver: true` + expo-router stack navigation = white flash on back. Switch to regular `ScrollView` with a JS threshold handler for header effects
- `Tabs` needs `contentStyle: { backgroundColor }` just like the root `Stack` — without it, tab screens are transparent during transitions
- `lastFetchedUrl` ref pattern prevents API hammering when a valid URL is already cached — cleaner than debounce for this use case since the URL is typically pasted all at once, not typed character by character
- logo.dev with `retina=true` gives 2x resolution logos — noticeably sharper on high-DPI screens than Clearbit
