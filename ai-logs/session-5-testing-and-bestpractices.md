# Session 5 — Testing, Best Practices & Watch Gate

Context: App is visually polished. This session: code quality pass, add unit tests,
and gate the submit CTA behind watching an example video.

---

**Me:** Cross-check the codebase and double-check we're following best practices and add testing to it. And on the campaign details, check if they have watched an example video before allowing them to submit.

**Claude:** [audits codebase — finds: `key={i}` on requirements list (should be `key={req}`), no test setup at all, unused YouTube deps still in package.json]

Running fixes:
1. Removes `react-native-youtube-iframe` and `react-native-webview` from package.json (leftover from the reverted YouTube experiment)
2. Fixes `key={i}` → `key={req}` on requirements
3. Installs jest, jest-expo, @types/jest
4. Adds watch gate: `const [watchedAny, setWatchedAny] = useState(false)` and `onPlayStart` prop on VideoPlayer that bubbles up to the campaign detail screen
5. Writes 5 test suites: formatters, urlValidator, urlParser, videoPlayback singleton, submissionsStore — 53 tests total

**Me:** [tests fail to run]

**Claude:** Two separate issues blocking the test runner:

First: `babel-preset-expo v55` unconditionally loads the `react-native-reanimated` Babel plugin, which requires `react-native-worklets/plugin` — not installed. Fix: create a stub at `node_modules/react-native-worklets/plugin.js`.

Second: `jest-expo`'s setup file calls `require('expo/src/winter')` which installs lazy getters for globals like `__ExpoImportMetaRegistry`. When these getters fire during test execution, Jest throws "You are trying to import a file outside of the scope of the test code" — because Node.js doesn't support ESM (`vm.SourceTextModule` requires `--experimental-vm-modules`), so `supportsDynamicImport = false`, and Jest's `_execModule` throws whenever `isInsideTestCode === false`.

Fix: add `moduleNameMapper` in the jest config to point `expo/src/winter` at an empty stub. This prevents the lazy getters from being installed entirely — safe because our tests are pure TypeScript with no React Native dependencies.

Also needed: `testEnvironment: 'node'` and `"types": ["jest"]` in tsconfig.json so IDE globals (`describe`, `jest`, `expect`) resolve without errors.

**Me:** [all 53 tests pass, no warnings]

---

**Me:** Change name on profile to Theo.

**Claude:** [updates `app/(tabs)/index.tsx` and `app/(tabs)/profile.tsx` — "Maya Johnson" → "Theo Johnson"]

**Me:** Commit.

**Claude:** [commits "chore: rename user from Maya to Theo"]

---

**Me:** Commit the testing + best practices changes.

**Claude:** [commits: "feat: add test suite, watch-gate CTA, and best-practice fixes" — 12 files, 462 insertions]

---

## Notes to self

- `jest-expo` + Expo SDK 54 + Node 24 has a specific incompatibility: the `expo/src/winter` lazy getters can't fire in Jest because `vm.SourceTextModule` isn't available without `--experimental-vm-modules`. The fix is a one-line `moduleNameMapper` entry — not obvious from the error message
- The `readyToPlay` loop bug from session 4 and the `key={i}` list bug are the same class of issue: firing on every iteration when you only want the first. A code review pass found the second one that the tests would have caught
- The watch gate (`onPlayStart` prop → `watchedAny` state → locked CTA) is a clean pattern — single prop, one callback, no global state needed
- Removing leftover deps from a reverted feature (YouTube) is worth doing immediately, not "later" — they were still in package.json two sessions after the revert
- Writing the test for `scheduleTransition`'s `setTimeout` required `jest.useFakeTimers()`, otherwise the 30s timer leaked and Jest had to force-kill the worker process
