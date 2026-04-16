# Reflection

Honest notes on the build. Not polished marketing — actual what-happened.

## Time spent

**~6 hours total.** 20% over the 5-hour target. I'd rather tell you the truth and let you weigh that than fake a number.

**Breakdown:**
- 0:30 — Scaffold, expo-router setup, NativeWind config
- 1:00 — Mock data (spent more time than expected making it feel real — specific brands, realistic payouts, believable briefs)
- 2:00 — Four screens, happy path working end-to-end
- 1:00 — Zustand store + status transition logic + URL validation
- 1:00 — Polish: skeleton states, haptics, the animated earnings counter, empty states
- 0:30 — Loom, README, this reflection, ai-logs cleanup

## What was easy

**expo-router and Zustand.** I've used both before. The routing structure maps cleanly to the product structure — `app/campaign/[id].tsx` is self-documenting. Zustand for 4 screens was the obvious call; I didn't overthink it.

**The visual design.** I committed to a direction early (dark-first, money-green accents, editorial type) and didn't let myself second-guess. The Gymshark → Celsius → Oura lineup came from actually thinking about what creators on 8x's platform would see, not from stock-brand-list-dot-com.

**URL validation.** `url.includes('tiktok.com/video') || url.includes('instagram.com/reel')` covers 95% of cases. I resisted the urge to write a proper parser.

## What was hard

**The submission status state machine.** I started with a naive `useState` in the submit screen, then realized the Submissions tab also needed the list, then realized statuses had to transition over time for the demo to feel alive. Refactored to Zustand at hour 2. If I'd drawn the data model on paper first — 15 minutes of thinking — I would have saved ~40 minutes of churn.

**The "watch these first" example videos.** The brief says show 1-2 example videos. A real video player with HLS streaming is a rabbit hole. I built styled gradient thumbnails with a play overlay — they look like videos in a TikTok-style grid. The tradeoff: they don't actually play. For the demo, I think this is the right call (time budget), but I'd want to flag it to the reviewer.

**Restraint.** I kept wanting to add more — a profile screen, earnings analytics, a brand browse page. I had to keep cutting. The thing that saved me was writing the feature list first and treating it as a contract.

## Process

I worked almost entirely in Cursor with Claude as the pair programmer. Workflow:

1. **Design first.** I sketched the four screens in Figma (rough wireframes, 20 min) before writing code. Having a visual target meant the build phase was execution, not exploration.
2. **Mock data before UI.** I wrote `data/campaigns.ts` second. Real-feeling data makes the UI easier to build because you can see it fail at realistic shapes (what if a brief is 400 chars? what if there are 2 example videos vs 1?).
3. **Happy path first, polish after.** All four screens worked crudely before I added a single animation. This is the biggest lesson I keep re-learning — polish is infinite, and it only pays off if the underlying flow works.
4. **AI for boilerplate, me for architecture.** See `/ai-logs/` — I used Claude heavily for component scaffolding, formatter functions, validation regex. But the data model, state management choice, and design system calls were mine. The logs show the split clearly.

## What I'd do with more time (ranked by impact)

1. **Real video player in campaign detail** — the example videos are the most important UX element for creators (they replicate them). Right now they're thumbnails. `expo-av` + 2 sample videos = 1 hour well spent.
2. **Onboarding state for empty submissions** — first-time creator opens the app, has 0 submissions. The empty state should sell them on the earning potential. Current empty state is fine; great empty state would convert.
3. **A "similar campaigns" rail at the bottom of campaign detail** — drives deeper exploration and is the obvious next step once a creator rejects a specific brief.
4. **Filter + search on campaigns list** — 6 campaigns doesn't need it, 60 would. Easy to add later, but the information architecture should support it from day one (category field on Campaign type is there for this reason).
5. **AI scoring preview in the submit flow** — this is where 8x's platform thesis becomes product. As the creator pastes the URL, a background job could score the video against the brief *before* they submit, showing "Your hook is at 3.2s — try cutting the first second" inline. This is the feature I'd ship on day one if I joined full-time.

## What I'd change about my approach

**Draw the data model before building screens.** I already said this above. Writing it twice because it's the biggest delta.

**Time-box polish aggressively.** I went from "works" to "feels good" in an hour. I could have stopped 20 minutes in and used that time on item #5 above. Polish has sharply diminishing returns past a threshold.

**Record the Loom earlier, not last.** Rehearsing the walkthrough surfaces issues — "wait, why is this button here?" — that are easier to fix than to apologize for.

## Honest take on the brief

The brief is well-designed as an evaluation. The four screens cover enough surface area to reveal:
- Whether you can build UI that looks like a real product
- Whether you can manage shared state
- Whether you use AI like a tool or a crutch
- Whether you have product taste (mock data says a lot)
- Whether you can honor a timebox

I'd weight the AI logs and the reflection more than the code itself, because the code alone can be pristine through over-work. The logs and reflection show how you actually think.

## One thing that might be controversial

I didn't write tests. For a 5-hour take-home with zero backend, Jest tests for pure functions (validators, formatters) is maybe 15 minutes; component tests are a time sink that don't pay off at this scale. I documented the decision rather than pretending tests are free.

If this were production code for 8x, I'd write tests for the Zustand store transitions and the URL validators — those are the parts most likely to regress and most easily unit-testable. UI snapshot tests in RN are famously flaky and I'd skip them.
