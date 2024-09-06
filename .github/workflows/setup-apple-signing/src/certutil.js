import { readFile, writeFile, rm } from "fs/promises";
import {promisify} from 'util';
import {exec as execCb} from 'child_process';
const exec = promisify(execCb);

const TEMPDIR = process.env.RUNNER_TEMP ?? '/tmp';

/**
 * @param {string} key
 * @param {string} commonName
 */
export async function createCsr(key, commonName) {
    await writeFile(`${TEMPDIR}/signing.key`, key);

    const csrCommand = `openssl req -new -key ${TEMPDIR}/signing.key -out ${TEMPDIR}/signing.csr`;
    const csrSubject = `'/emailAddress=webmaster@eternagame.org, CN="${commonName}", C=US'`
    await exec(`${csrCommand} -subj ${csrSubject}`);
    
    const csrContent = (await readFile(`${TEMPDIR}/signing.csr`)).toString();

    await rm(`${TEMPDIR}/signing.key`);
    await rm(`${TEMPDIR}/signing.csr`);

    return csrContent;
}

/**
 * @param {Buffer} cer 
 * @param {string} key 
 * @param {string} password
 */
export async function createP12(cer, key, password) {
    await writeFile(`${TEMPDIR}/signing.key`, key);
    await writeFile(`${TEMPDIR}/signing.cer`, cer);

    await exec(`openssl x509 -in ${TEMPDIR}/signing.cer -inform DER -out ${TEMPDIR}/signing.pem -outform PEM`);
    // Annoyingly Apple keychain doesn't properly support OpenSSL 3's defaults
    const legacyParams = '-certpbe PBE-SHA1-3DES -keypbe PBE-SHA1-3DES -macalg sha1';
    await exec(`openssl pkcs12 -export -inkey ${TEMPDIR}/signing.key -in ${TEMPDIR}/signing.pem -out ${TEMPDIR}/signing.p12 -passout pass:${password} ${legacyParams}`);

    const p12Content = await readFile(`${TEMPDIR}/signing.p12`);

    await rm(`${TEMPDIR}/signing.key`);
    await rm(`${TEMPDIR}/signing.cer`);
    await rm(`${TEMPDIR}/signing.p12`);

    return p12Content;
}

/**
 * @param {'x509' | 'rsa'} type 
 * @param {string | Buffer} material 
 */
export async function getModulus(type, material) {
    await writeFile(`${TEMPDIR}/signing-modulus-material`, material);
    const {stdout: modulus} = await exec(`openssl ${type} -modulus -noout -in ${TEMPDIR}/signing-modulus-material`);
    await rm(`${TEMPDIR}/signing-modulus-material`);
    return modulus;
}

