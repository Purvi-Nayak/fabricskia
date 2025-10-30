const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './web/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules\/(?!(@react-native|react-native|@shopify\/react-native-skia|react-native-reanimated))/,
                use: {
                    loader: 'babel-loader',
                    // Use the project's babel config
                },
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ],
    },
    resolve: {
        extensions: ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', '.js', '.jsx', '.ts', '.tsx'],
        alias: {
            'react-native$': 'react-native-web',
            'react-native/Libraries/EventEmitter/NativeEventEmitter':
                'react-native-web/dist/vendor/react-native/NativeEventEmitter',
            'react-native/Libraries/vendor/emitter/EventEmitter':
                'react-native-web/dist/vendor/react-native/emitter/EventEmitter',
            'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter':
                'react-native-web/dist/vendor/react-native/NativeEventEmitter',
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './web/index.html',
            inject: true,
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        port: 3000,
        hot: true,
        historyApiFallback: true,
    },
};