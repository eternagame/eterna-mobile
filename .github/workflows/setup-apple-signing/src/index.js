// @ts-check
import { writeFile } from "fs/promises";
import { AppStoreApi } from "./app-store-api.js";
import { createCsr, createP12 } from "./certutil.js";
import { parseArgs } from "./cli.js";

const args = parseArgs();
const appStoreApi = new AppStoreApi(args.apiKey, args.apiKeyId, args.apiKeyIssuerId);

const currentCert = await appStoreApi.getCertificateForKey(args.certificateType, args.privKey);

if (args.mode === 'rotate') {
    if (currentCert) appStoreApi.revokeCertificate(currentCert.id);
    const csr = await createCsr(args.privKey, `Eterna CI Apple ${args.certificateType}`);
    appStoreApi.createCertificate(args.certificateType, csr);
}

if (args.mode === 'retrieve') {
    if (!currentCert) throw new Error('No certificate available - you probably need to run the rotate-apple-keys workflow');
    const p12 = await createP12(
        Buffer.from(currentCert.attributes.certificateContent, 'base64'),
        args.privKey,
        args.p12Password
    );
    await writeFile(args.outFile, p12);
}
