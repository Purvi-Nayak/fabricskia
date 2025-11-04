module.exports = function (api) {
    api.cache(true);

    const presets = [
        'module:@react-native/babel-preset'
    ];

    const plugins = [
        '@babel/plugin-transform-runtime',
        'react-native-reanimated/plugin',
    ];

    return {
        presets,
        plugins,
    };
};
