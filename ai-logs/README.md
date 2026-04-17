# AI Logs

How I worked with AI on this build. Five sessions captured here, plus this meta-note.

## Tools used

- **Claude Code** (VS Code extension, Claude Sonnet 4.6) — primary coding environment throughout

## Philosophy

AI is a force multiplier, not a ghostwriter. My rough rule:

**Delegate to AI:**

- Component scaffolding once I know what I want
- Boilerplate (types, mock data shapes, formatter functions)
- Debugging specific errors (RN quirks especially)
- Generating variants to pick from

**Keep for myself:**

- Data model and state architecture
- Design direction (aesthetic calls, when to polish vs ship)
- Product trade-offs (what to cut, what to build)
- Naming things (Claude is fine at this but I want the codebase to feel like mine)

## Session files

- [`session-1-scaffold.md`](./session-1-scaffold.md) — Expo setup, routing structure, first pass at components
- [`session-2-components.md`](./session-2-components.md) — Campaign card, submission card, URL validator
- [`session-3-polish.md`](./session-3-polish.md) — Status transitions, animations, edge cases
- [`session-4-video-and-ui.md`](./session-4-video-and-ui.md) — Real video playback (expo-video), UI redesign, TikTok icon fix
- [`session-5-testing-and-bestpractices.md`](./session-5-testing-and-bestpractices.md) — 53 unit tests, watch gate, best-practices audit

## What the logs show (deliberately)

Read them and you'll see:

1. **I push back on AI output.** When Claude proposed using Redux Toolkit, I said no and explained why Zustand fit the problem size better. When it generated a 200-line campaign card, I cut it in half and explained what was noise.

2. **I use AI for architecture discussions, not just codegen.** Session 1 has me asking Claude to argue for and against NativeWind vs StyleSheet before I chose. That's the kind of usage I find highest-leverage.

3. **I verify.** Session 3 shows me catching a bug where the status transition timer was leaking when the user navigated away. Claude didn't catch it until I pointed it out. Fresh eyes matter — AI's and mine.

4. **I prompt with context.** Most of my prompts include what I've already tried, what constraints matter, and what "done" looks like. One-shot ambiguous prompts produce mediocre output; I've learned to front-load the setup.
