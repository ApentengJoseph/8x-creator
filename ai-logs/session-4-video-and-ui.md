# Session 4 — Video Playback & UI Overhaul

Context: Sessions 1–3 left the app with styled gradient thumbnails as placeholders.
This session: add real video playback, debug performance issues, redesign the UI.

---

**Me:** Can you use `npx expo install expo-av` to show videos in app and their thumbnails? Extracting the video metadata and reading it. Also improve the UI — make it more sleek with a light version, the dark theme doesn't feel right.

**Claude:** [installs expo-av, builds a VideoPlayer component with useVideoPlayer hook, adds inline playback with expand-to-fullscreen, switches to light theme with cream background `#f4f3f1`]

**Me:** Android Bundled 48ms — ERROR Received 3 arguments, but 1 was expected. [VideoPlayer crash]

**Claude:** [fixes argument mismatch in VideoView event handlers, expo-video v2 API changed from expo-av]

**Me:** The video is slightly cracking and the spinner keeps showing — I thought it's preloaded. Duration doesn't match and the tag shows "reels" or "tiktok" incorrectly.

**Claude:** [investigates — identifies `waitsToMinimizeStalling: false` as the cause of choppy decode start, increases buffer to 8s, fixes platform tag display]

**Me:** Why are the videos still playing very slow? Is it the player or the size of the videos? Also when I expand and then close, the video stops but I have to manually press the stop button before a new one plays.

**Claude:** The primary issue is file size — the source videos are 400MB+. Even with preloading, that's slow on a mobile network. Also the expand/collapse isn't stopping the player on close. Let me fix both: compress the videos with ffmpeg and add an explicit stop-on-close.

[runs ffmpeg-static compression: 422 MB → 27 MB across 4 videos, adds stop on modal dismiss]

**Me:** [pastes YouTube Shorts URLs] Let's try YouTube Shorts instead of local assets.

**Claude:** [integrates react-native-youtube-iframe with WebView, swaps campaign data to YouTube URLs]

**Me:** But video still playing slow and cracking — is it a rerendering issue? Can you debug why?

**Claude:** Yes, this is a re-render bug. `readyToPlay` fires on **every video loop**, not just the initial load. So every loop triggers `player.currentTime = 1` mid-playback — that's the cracking. Fix: add a `hasInit = useRef(false)` guard so we only seek and set state on the first `readyToPlay` event.

Also, YouTube Shorts via WebView is adding latency. The local compressed videos (27 MB total) are actually faster — I'd revert the YouTube integration.

**Me:** Revert back to local videos.

**Claude:** [removes react-native-youtube-iframe and react-native-webview, restores local asset references, applies the hasInit fix, sets `stopFnRef` pattern for stable cleanup across re-renders]

---

**Me:** Improve the discover page and campaign cards and the submit video page — make it sleek and professional. Right now too many colors. Use the right icons — TikTok icon not showing correctly.

**Claude:** [redesigns CampaignCard: flat white card, green payout badge, platform badge with proper icons — but uses dark `#18181b` header section]

**Me:** I don't like the dark card styling — use lively color like the rest of the app.

**Claude:** [reverts to gradient header]

**Me:** Keep the active campaign card simple and clean — remove the gradients, make it more simple. And the submit video platform card — keep it simple and lively but matching our colour palette.

**Claude:** [removes gradients entirely: flat white card, brand colour only on the avatar circle, thin 4px progress bar, neutral fill. For TikTok icon: Ionicons has no tiktok logo — switches to FontAwesome5 from @expo/vector-icons which includes `tiktok`]

**Me:** On the submit video platform card it looks too green — make it professional, not greeny.

**Claude:** [adjusts platform toggle to use `C.greenBorder` (the same border as the payout badge chip) instead of a green background fill — matches the design language without being "greeny"]

**Me:** The border can be that of the amount badge chip.

**Claude:** [confirms that's exactly what was just applied — `C.greenBorder` is the payout badge's border colour]

**Me:** Commit the changes.

**Claude:** [commits: "polish: clean up UI, fix icons, improve video playback"]

---

## Notes to self

- `readyToPlay` fires on every loop in expo-video — the fix is a `hasInit` ref, not a status flag, because status can change between loop iterations
- Ionicons doesn't have a TikTok icon. FontAwesome5 does. Worth knowing before spending time debugging icon names
- "Too greeny" is a valid design note — the fix was using the border colour rather than a fill, which matched the existing design token
- YouTube Shorts via WebView added latency without benefit over compressed local files at 27 MB — not worth the dependency
- Asking "is it the player or the file size?" was the right diagnostic question — the answer was both, and they had different fixes
