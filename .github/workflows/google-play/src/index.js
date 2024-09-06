// @ts-check
import { parseArgs } from "./cli.js";
import { PlayStoreApi } from "./play-store-api.js";

const PACKAGE_NAME = 'org.eternagame.mob';

const args = parseArgs();
const playStoreApi = await PlayStoreApi.create(args.apiKey);
if (args.mode === 'upload') {
    console.log('Starting Upload')
    const editId = await playStoreApi.insertEdit(PACKAGE_NAME);
    await playStoreApi.uploadBundle(PACKAGE_NAME, editId, args.bundlePath);
    await playStoreApi.commitEdit(PACKAGE_NAME, editId);
}
