const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = (env) => {
    return merge(common(env), {
        mode: 'development',

        devtool: 'eval',

        output: {
            pathinfo: true,
            publicPath: '/',
            filename: '[name].bundle.js',
        },

        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            // compress: true,
            port: 9000,
            // process: true,
            historyApiFallback: true,
        },
    });
};