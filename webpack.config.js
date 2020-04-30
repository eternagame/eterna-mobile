const CopyPlugin = require('copy-webpack-plugin');
const DotEnv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './src/main.ts',
    output: {
        path: path.resolve(__dirname, 'www'),
        filename: 'bundle.js?[chunkHash]',
        chunkFilename: '[name].js?[chunkHash]',
    },
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                }
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    'vue-style-loader',
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                  name: '[name].[ext]?[hash]',
                },
            },
        ],
    },
    plugins: [
        new DotEnv({
            defaults: './.env',
            path: './.env.local',
            silent: true,
        }),
        new HtmlWebpackPlugin({
            inject: false,
            meta: {
                viewport: 'initial-scale=1, width=device-width, viewport-fit=cover',
            },
        }),
        new VueLoaderPlugin(),
        new CopyPlugin([
            { context: 'eternajs/dist/dev/', from: '**/*', to: 'eternajs/'},
        ]),
    ],
};
