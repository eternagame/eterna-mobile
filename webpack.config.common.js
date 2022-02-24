const CopyPlugin = require('copy-webpack-plugin');
const DotEnv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = function(mode, eternajs_copy) {
    return {
        mode: mode,
        devtool: 'inline-source-map',
        entry: './src/main.ts',
        output: {
            path: path.resolve(__dirname, 'www'),
            filename: 'bundle.js?[chunkHash]',
            chunkFilename: '[name].js?[chunkHash]',
            assetModuleFilename: '[name].[ext]?[hash]'
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
                    test: /\.(png|jpg|gif|svg|mp4)$/,
                    type: 'asset/resource'
                },
            ],
        },
        plugins: [
            new DotEnv({
                defaults: './.env',
                path: './.env.local',
                silent: true,
                systemvars: true
            }),
            new HtmlWebpackPlugin({
                inject: false,
                meta: {
                    viewport: 'initial-scale=1, maximum-scale=1, user-scalable=0, width=device-width, viewport-fit=cover',
                },
            }),
            new VueLoaderPlugin(),
            new CopyPlugin({patterns: [
                { context: eternajs_copy, from: '**/*', to: 'eternajs/'},
                { from: 'src/assets/favicon.ico', to: 'favicon.ico'},
            ]}),
        ],
    };
};
