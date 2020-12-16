const runScript = require('@npmcli/run-script');

module.exports = async context => {
    const env = process.env.NODE_ENV ? process.env.NODE_ENV : context.opts.options.release ? 'prod' : 'dev';
    console.log(`Running build scripts for env ${env}`);
    await runScript({
        event: `prebuild:${env}`,
        path: '.',
        stdio: 'inherit',
    });
    await runScript({
        event: `build:${env}`,
        path: '.',
        stdio: 'inherit',
    });
    await runScript({
        event: `postbuild:${env}`,
        path: '.',
        stdio: 'inherit',
    });
};
