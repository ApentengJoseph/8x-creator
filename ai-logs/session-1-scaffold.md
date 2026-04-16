# Session 1 — Scaffold & Architecture

Date: [redacted]
Context: Starting fresh. Have the brief open in another tab. Goal for this session: working skeleton with navigation and mock data.

---

**Me:** I'm building a take-home for a founding engineer role at a creator marketing startup called 8x Social. The task is a mobile submission flow for creators — 4 screens. Expo + RN. Stack flexible beyond that. 5-hour budget.

Before I write any code — argue for and against the following routing/state choices:
- expo-router vs React Navigation
- Zustand vs Context vs Redux Toolkit
- NativeWind vs StyleSheet.create

I want the trade-offs, not a recommendation yet.

**Claude:** [gives structured comparison of each]

**Me:** Good. One thing you missed on expo-router — what happens if I need deep linking later? Is that harder or easier than RN's Linking config?

**Claude:** [explains that expo-router auto-generates the deep link routes from file structure]

**Me:** Ok. Going with expo-router, Zustand, NativeWind. Don't argue back — I've shipped with all three and the problem size fits. Set up the project.

```bash
npx create-expo-app@latest 8x-creator --template blank-typescript
```

What's next — nativewind v4 setup, right?

**Claude:** Yes. Here's the minimal config... [provides tailwind.config.js, metro.config.js, babel.config.js changes]

**Me:** Give me the app/ structure I should create. I want:
- tabs for discover and submissions (earnings placeholder)
- campaign/[id] detail route
- submit/[campaignId] with a success screen

**Claude:** [generates the folder tree with empty files]

**Me:** Before you write any screens — what should go in `data/campaigns.ts`? I want the mock data to feel real. Not "Brand A, Campaign 1". Creators on this platform are UGC folks doing TikTok/Reels for DTC brands. Suggest 6 brands and campaign concepts that would actually run on a platform like this.

**Claude:** [suggests Gymshark, Nike, Alo, Celsius, HelloFresh, Notion, Oura, etc. with realistic payouts]

**Me:** Drop Nike — too big, they don't run on creator platforms like this. Keep the rest. Payouts look right. Now give me the full TypeScript types first, then the data.

[... continues with data model refinement ...]

**Me:** Ok stop. You're overengineering the Campaign type. I don't need `targetAudience`, `campaignGoals`, or `kpiTargets` — the creator doesn't see those. Strip it to what renders on the card and the detail screen.

**Claude:** [simplifies]

**Me:** Good. Save that. Session 2 will be building the actual components.

---

## Notes to self

- Pushing back on overengineered types saved probably 30 min of refactoring later
- Asking Claude to argue both sides before deciding is a good pattern — the sides it presents reveal what it thinks matters, which is useful even when I disagree
- Need to be explicit about what "real" means in mock data — first pass was generic, second pass after I specified "UGC creators, DTC brands" was much better
