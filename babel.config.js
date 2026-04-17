module.exports = function (api) {
  api.cache(true);
  // Use process.env directly — avoids conflict with api.cache(true) + api.env()
  const isTest = process.env.NODE_ENV === 'test';
  return {
    presets: [
      // In test env: no extra options so babel-preset-expo skips the reanimated
      // Babel plugin (requires react-native-worklets, not installed as a dep).
      ['babel-preset-expo', isTest ? {} : { jsxImportSource: 'nativewind' }],
      ...(isTest ? [] : ['nativewind/babel']),
    ],
    plugins: [],
  };
};
