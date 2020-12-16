const runScript = require('@npmcli/run-script');

module.exports = async context => {
    const env = context.opts.options.release ? 'prod' : 'dev';
    console.log(`Running build scripts for env ${env}`);
    await runScript({
        event: `prebuild:${env}`,
        path: '.'
    });
    await runScript({
        event: `build:${env}`,
        path: '.',
    });
    await runScript({
        event: `postbuild:${env}`,
        path: '.',
    });
};
