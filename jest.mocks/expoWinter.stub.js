// Stub for expo/src/winter — prevents the winter runtime's lazy getters
// (structuredClone, fetch, __ExpoImportMetaRegistry, etc.) from being
// installed in Jest's Node environment, where they trigger
// "You are trying to import a file outside of the scope of the test code."
