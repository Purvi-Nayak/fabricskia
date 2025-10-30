module.exports = function(api) {
  api.cache(true);
  
  const presets = [
    ['@babel/preset-env', { loose: true }],
    '@babel/preset-react',
    '@babel/preset-typescript',
    'module:@react-native/babel-preset',
  ];
  
  const plugins = [
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-transform-runtime',
    'react-native-reanimated/plugin',
  ];

  return {
    presets,
    plugins,
  };
};
