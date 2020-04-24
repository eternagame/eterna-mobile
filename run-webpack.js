const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const runScript = require('@npmcli/run-script');

module.exports = context => {
    return new Promise(async (resolve, reject) => {
        await runScript({
            event: 'build:dev',
            path: 'eternajs',
        });
        await runScript({
            event: 'postbuild:dev',
            path: 'eternajs',
        })
        webpack(webpackConfig).run((err, stats) => {
            if (err) {
                console.error(err.stack || err);
                reject();
                return;
            }

            const info = stats.toJson();

            if (stats.hasErrors()) {
                console.error(info.errors);
            }

            if (stats.hasWarnings()) {
                console.warn(info.warnings);
            }

            resolve();
        });
    });
};
