const runScript = require('@npmcli/run-script');

module.exports = async context => {
    if (context.opts.options.release) {
        // Production
        await runScript({
            event: 'prebuild:prod',
            path: '.'
        });
        await runScript({
            event: 'build:prod',
            path: '.',
        });
        await runScript({
            event: 'postbuild:prod',
            path: '.',
        });
    } else {
        // Development
        await runScript({
            event: 'prebuild:dev',
            path: '.',
        });
        await runScript({
            event: 'build:dev',
            path: '.',
        });
        await runScript({
            event: 'postbuild:dev',
            path: '.',
        });
    }
};
