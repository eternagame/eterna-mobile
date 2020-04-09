const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './src/main.ts',
    output: {
        path: path.resolve(__dirname, 'www'),
        filename: 'bundle.js?[hash]',
        chunkFilename: '[name].js?[hash]',
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
        new HtmlWebpackPlugin({
            inject: false,
            meta: {
                viewport: 'initial-scale=1, width=device-width, viewport-fit=cover',
            },
        }),
        new VueLoaderPlugin(),
    ],
}
