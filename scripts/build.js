const runScript = require('@npmcli/run-script');

module.exports = async context => {
    // In our GitHub actions, we'll handle these manually so we can parallelize
    if (process.env.PARALLEL_BUILD) return;

    const env = process.env.NODE_ENV ? process.env.NODE_ENV : context.opts.options.release ? 'prod' : 'dev';
    console.log(`Running build scripts for env ${env}`);
    await runScript({
        event: `build:${env}`,
        path: '.',
        stdio: 'inherit',
    });
    await runScript({
        event: `build:${env}`,
        path: './eternajs',
        stdio: 'inherit',
    });
};
