// Stub Expo's "winter" runtime globals that fail in a Jest/Node environment.
Object.defineProperty(global, '__ExpoImportMetaRegistry', {
  value: {},
  writable: true,
  configurable: true,
});
