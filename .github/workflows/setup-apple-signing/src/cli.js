// @ts-check

export function parseArgs() {
    const args = process.argv.slice(2);
    const mode = args.shift();
    if (!mode) throw new Error('Missing arguments');

    if (args.length < 5) throw new Error('Missing arguments');
    const [certificateType, privKey, apiKey, apiKeyId, apiKeyIssuerId] = args;
    args.splice(0, 5);

    const validCertificateTypes = [
        'IOS_DEVELOPMENT',
        'IOS_DISTRIBUTION',
        'MAC_APP_DISTRIBUTION',
        'MAC_INSTALLER_DISTRIBUTION',
        'MAC_APP_DEVELOPMENT',
        'DEVELOPER_ID_KEXT',
        'DEVELOPER_ID_APPLICATION',
        'DEVELOPMENT',
        'DISTRIBUTION',
        'PASS_TYPE_ID',
        'PASS_TYPE_ID_WITH_NFC',
    ]
    if (!validCertificateTypes.includes(certificateType)) {
        throw new Error('Invalid certificate type');
    }

    if (mode === 'rotate') {
        if (args.length !== 0) throw new Error('Invalid number of arguments');
        return {
            /** @type {'rotate'} */
            mode: 'rotate',
            certificateType,
            privKey: Buffer.from(privKey, 'base64').toString(),
            apiKey: Buffer.from(apiKey, 'base64').toString(),
            apiKeyId,
            apiKeyIssuerId
        };
    } else if (mode === 'retrieve') {
        if (args.length !== 2) throw new Error('Invalid number of arguments');
        const [outFile, p12Password] = args;
        return {
            /** @type {'retrieve'} */
            mode: 'retrieve',
            certificateType,
            privKey: Buffer.from(privKey, 'base64').toString(),
            apiKey: Buffer.from(apiKey, 'base64').toString(),
            apiKeyId,
            apiKeyIssuerId,
            outFile,
            p12Password
        };
    } else {
        throw new Error('Invalid mode')
    }
}