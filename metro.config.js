const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
    resolver: {
        platforms: ['ios', 'android', 'web', 'native'],
    },
}

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
