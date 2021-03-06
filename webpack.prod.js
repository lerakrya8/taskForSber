const path = require('path');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const common = require('./webpack.common');

module.exports = env => {
    return merge(common(env), {
    
        mode: 'production',
    
        devtool: 'source-map',
    
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].[contenthash].bundle.js'
        },
    
        plugins: [
            new CleanWebpackPlugin(),
        ]
    
    });
};