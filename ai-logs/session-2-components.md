# Session 2 — Components

Date: [redacted]
Context: Data model done. Building the actual UI. Starting with campaign card since that's the highest-density component.

---

**Me:** Build me a CampaignCard component. It gets a Campaign object as a prop. Needs: brand avatar (initials), brand name, campaign title, payout (green pill), platform badge, campaign type, time remaining, and either "X accepted" or "Y spots left" based on spotsLeft <= 10.

Dark theme. Think Robinhood meets TikTok creator tools.

**Claude:** [generates 190-line component with lots of StyleSheet.create at the bottom]

**Me:** Too long, and I said NativeWind. Strip the StyleSheet.create — use inline styles for anything that changes based on props, and Tailwind classes for everything static. Also: I don't need onLongPress, tooltips, or accessibility labels for a demo. Remove that noise.

**Claude:** [trims to ~110 lines]

**Me:** Better. One issue — the payout pill uses `className="bg-green-900"` but that won't pick up the brand green I defined. Use inline style with the hex instead of the Tailwind class.

**Claude:** [fixes]

**Me:** Now the submission card. Three states: pending (amber pill + progress bar), approved (green border, payout shown), rejected (red pill + quoted feedback block + resubmit button). Same dark aesthetic.

**Claude:** [generates SubmissionCard with STATUS_CONFIG pattern]

**Me:** Good call on the STATUS_CONFIG map. I'd have done the same thing. One question — why did you put the card border color in STATUS_CONFIG vs computing it from status? Isn't that redundant with the pill color?

**Claude:** [explains tradeoff — could compute from status but STATUS_CONFIG makes all visual states scannable in one place, useful when you need to tweak one status without hunting through the JSX]

**Me:** Fair. Keeping it.

Now the URL validator. I want a function `validateVideoUrl(url: string, platform: Platform): boolean`. TikTok URLs contain `/video/`, IG contains `/reel/` or `/p/`. Don't over-engineer this — no regex unless necessary.

**Claude:** [writes naive includes-based validator]

**Me:** Exactly what I wanted. Add a second function `detectPlatformFromUrl` that returns 'tiktok' | 'instagram' | null. I'll use this to auto-select the platform toggle when a URL is pasted.

**Claude:** [adds detectPlatformFromUrl]

---

## Notes to self

- The STATUS_CONFIG pattern (all per-status styling in a lookup object) is cleaner than switch statements in JSX — worth remembering
- Pushing back on StyleSheet.create: the hybrid approach (Tailwind for static, inline for dynamic) is right for this project size
- AI instinctively adds a11y props I don't need for a demo — good to have a default mental filter for "remove demo noise"
