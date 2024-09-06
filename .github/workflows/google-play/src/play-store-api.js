// @ts-check
import { readFile } from 'fs/promises';
import jwt from 'jsonwebtoken';

export class PlayStoreApi {
    /**
     * @param {string} accessToken 
     * @access private
     */
    constructor(accessToken) {
      this.accessToken = accessToken;
    }

    /**
     * @param {{
     *  type: string;
     *  project_id: string;
     *  private_key_id: string;
     *  private_key: string;
     *  client_email: string;
     *  client_id: string;
     *  auth_uri: string;
     *  token_uri: string;
     *  auth_provider_x509_cert_url: string;
     *  client_x509_cert_url: string;
     *  universe_domain: string;
     * }} apiKey
     */
    static async create(apiKey) {
      const authToken = jwt.sign({
        scope: 'https://www.googleapis.com/auth/androidpublisher'
      }, apiKey['private_key'], {
        algorithm: 'RS256',
        keyid: apiKey['private_key_id'],
        issuer: apiKey['client_email'],
        audience: apiKey['token_uri'],
        expiresIn: '5m',
      });
      const res = await fetch(apiKey['token_uri'], {
        method: 'POST',
        body: new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: authToken
        }).toString()
      });
      const parsed = await res.json();
      return new PlayStoreApi(parsed['access_token']);
    }

    /**
     * @param {string} packageName
     * @returns {Promise<string>} edit ID
     */
    async insertEdit(packageName) {
      const res = await fetch(`https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/edits`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      });
      const parsed = await res.json();
      return parsed['id'];
    }

    /**
     * @param {string} packageName 
     * @param {string} editId 
     * @param {string} bundlePath
     */
    async uploadBundle(packageName, editId, bundlePath) {
      const bundle = await readFile(bundlePath);
      await fetch(`https://androidpublisher.googleapis.com/upload/androidpublisher/v3/applications/${packageName}/edits/${editId}/bundles?uploadType=media`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/octet-stream',
          'Content-Length': bundle.length.toString(),
        },
        body: bundle
      });
    }

    async commitEdit(packageName, editId) {
      await fetch(`https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/edits/${editId}:commit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
    }
}