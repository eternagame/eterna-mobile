const webpack = require('webpack');
const webpack_config = require('./webpack.config');

module.exports = context => {
    return new Promise((resolve, reject) => {
        webpack(webpack_config).run((err, stats) => {
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
