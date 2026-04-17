# Session 3 — Polish, State Machine, Edge Cases

Date: [redacted]
Context: Happy path working. Spend remaining time on the things that separate a demo from a product.

---

**Me:** The submission status auto-transition is leaking. I navigate away from the submissions tab and come back — the timer still fires but the UI doesn't update because the component remounted and the old store reference is stale.

Actually wait, I'm wrong. Zustand is a singleton — the store persists across remounts. Let me check the actual bug.

**Claude:** You're right to re-examine. With Zustand outside React's lifecycle, the setTimeout in addSubmission will fire regardless of component mount state and update the store correctly. The issue might be something else — can you share the actual behavior you're seeing?

**Me:** Never mind, it's actually working. I was confused because I submitted and immediately hard-refreshed the Expo app in dev mode, which resets JS state. Not a bug.

**Claude:** Yep — dev mode JS reload is a common source of "bugs" that aren't bugs. Worth noting: in production with expo-updates, you'd never hit this. Only something to handle if you add persistence (AsyncStorage / MMKV).

**Me:** Good call. Not adding persistence for a demo — adds complexity and the reviewer will be running in dev anyway.

Now: animated earnings counter. When totalEarnings increases in the store (approval fires), I want the number to count up smoothly. I'm using Animated.Value — what's the cleanest pattern?

**Claude:** [suggests Animated.timing on a numeric value, with useEffect watching totalEarnings, and interpolating to a formatted string]

**Me:** The interpolate-to-string approach feels fragile — what if the value gets large and the easing overshoots? Let me try a different approach: just track displayEarnings in local state and update it via requestAnimationFrame over 600ms.

**Claude:** That's cleaner for this case. Here's the rAF pattern...

**Me:** Actually Animated.timing with useNativeDriver: false is fine here and avoids the rAF cleanup complexity. The overshooting isn't a real concern for dollar values. Let me just do the Animated.Value approach you originally suggested.

**Claude:** Makes sense. The original suggestion stands — here's the cleaned-up version...

**Me:** One more thing: the success screen after submit has confetti. I don't want to add a library for demo confetti. What's the least-code approach?

**Claude:** [suggests absolutely-positioned View dots with random colors]

**Me:** Yes, exactly that. Five dots, hardcoded positions, done. I'd rather it look slightly geometric than spend 30 minutes on a particle system.

---

## Notes to self

- Worth double-checking "bugs" before fixing them — two in this session turned out to be dev-mode artifacts
- The rAF vs Animated.Value debate: for short-lived UI transitions (< 1s), Animated is almost always right because it handles cleanup automatically
- "Least code that communicates the idea" is a valid design constraint for demo features. Geometric confetti > no confetti > 30 minutes on particles
