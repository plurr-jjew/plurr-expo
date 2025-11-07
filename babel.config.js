module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel'
    ],
    plugins: [
      ['module-resolver', {
        root: ['./src'],
        alias: {
          '@components': './src/components',
        },
        extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.json', '.tsx', '.ts'],
      }],
      '@babel/plugin-proposal-export-namespace-from',
      'react-native-worklets/plugin',
    ],
  };
};
