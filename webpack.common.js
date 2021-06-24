const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const dirNode = 'node_modules';
const dirApp = path.join(__dirname, 'src');

function srcPath(subdir) {
    return path.join(__dirname, "src", subdir);
}

module.exports = (env) => {
    const IS_DEV = !!env.dev;

    return {
        entry: {
            main: path.join(dirApp, 'index'),
        },

        plugins: [
            new webpack.DefinePlugin({ IS_DEV }),

            new HtmlWebpackPlugin({
                template: path.join(__dirname, 'index.ejs'),
            }),
        ],

        module: {
            rules: [
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                    ],
                },
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],

        },
        resolve: {
            modules: [dirNode, dirApp],

            extensions: [".ts", ".tsx", ".js", ".json"],
            alias: {
                api: srcPath('api'),
                App: srcPath('App'),
                constants: srcPath('constants'),
                pages: srcPath('pages'),
                types: srcPath('types'),
                store: srcPath('store'),
            }
        },
        optimization: {
            runtimeChunk: 'single',
        },
    }
};