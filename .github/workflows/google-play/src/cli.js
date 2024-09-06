// @ts-check

export function parseArgs() {
    const args = process.argv.slice(2);
    const mode = args.shift();
    if (!mode) throw new Error('Missing arguments');

    if (mode === 'upload') {
        if (args.length < 2) throw new Error('Missing arguments');
        const [apiKey, bundlePath] = args;
        return {
            /** @type {'upload'} */
            mode: 'upload',
            apiKey: JSON.parse(Buffer.from(apiKey, 'base64').toString()),
            bundlePath
        };
    } else {
        throw new Error('Invalid mode')
    }
}