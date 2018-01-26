let webpack = require('webpack');
const path = require('path');
const LIVE = process.env.NODE_ENV === 'live';
const PRODUCTION = process.env.NODE_ENV === 'production';
let DEBUG = true;

if (PRODUCTION || LIVE)
    DEBUG = false;

module.exports = {
    entry: {
        '/res/js/dist/AcfGutenberg': './res/js/src/AcfGutenberg.js'
    },
    output: {
        path : path.resolve(__dirname),
        filename: '[name].js'
    },
    devtool: (DEBUG) ? 'source-map' : 'none',
    module : {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: '/node_modules/',
            options: {
                presets: [
                    ['env', {
                        "modules": false,
                        "targets": {
                            "browsers": [
                                "last 2 Chrome versions",
                                "last 2 Firefox versions",
                                "last 2 Safari versions",
                                "last 2 iOS versions",
                                "last 1 Android version",
                                "last 1 ChromeAndroid version",
                                "ie 11"
                            ]
                        }
                    }],
                    'stage-2'
                ],
                "plugins": [
                    [ "transform-react-jsx", {
                        "pragma": "wp.element.createElement"
                    }],
                    "transform-decorators-legacy"
                ]
            }
        }]
    }
};
