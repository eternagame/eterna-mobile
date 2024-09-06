// @ts-check
import jwt from 'jsonwebtoken';
import { getModulus } from './certutil.js';

export class AppStoreApi {
    /**
     * @param {string} apiKey 
     * @param {string} keyid 
     * @param {string} issuer 
     */
    constructor(apiKey, keyid, issuer) {
        this.token = jwt.sign({}, apiKey, {
            algorithm: 'ES256',
            keyid,
            issuer,
            audience: 'appstoreconnect-v1',
            expiresIn: '5m',
        });
    }

    /**
     * @param {string} certificateType 
     * @returns {Promise<{id: string; attributes: {name: string; certificateContent: string; expirationDate: string; certificateType: string;}}[]>}
     */
    async getCertificates(certificateType) {
        const res = await fetch(
            `https://api.appstoreconnect.apple.com/v1/certificates?filter[certificateType]=${certificateType}`,
            {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }
        );
        const body = await res.json();
        return body.data;
    }

    /**
     * @param {string} certificateType 
     * @param {string} key 
     */
    async getCertificateForKey(certificateType, key) {
        const currentCerts = await this.getCertificates(certificateType);
        const keyModulus = await  getModulus('rsa', key);
        for (const cert of currentCerts) {
            const certContent = Buffer.from(cert.attributes.certificateContent, 'base64');
            const certModulus = await getModulus('x509', certContent);
            if (keyModulus === certModulus) return cert;
        }
        return null;
    }

    /**
     * @param {string} id 
     */
    async revokeCertificate(id) {
        await fetch(
            `https://api.appstoreconnect.apple.com/v1/certificates/${id}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                }
            }
        );
    }

    /**
     * @param {string} certificateType 
     * @param {string} csrContent 
     * @returns {Promise<{id: string; attributes: {name: string; certificateContent: string; expirationDate: string; certificateType: string;}}>}
     */
    async createCertificate(certificateType, csrContent) {
        const res = await fetch(
            'https://api.appstoreconnect.apple.com/v1/certificates',
            {
                method: 'POST',
                body: JSON.stringify({
                    data: {
                        type: 'certificates',
                        attributes: {
                            certificateType,
                            csrContent
                        }
                    }
                }),
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        const body = await res.json();
        return body.data;
    }
}