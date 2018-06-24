import { FedaPayObject } from './FedaPayObject';
import { Resource } from './Resource';
export declare class Account extends Resource {
    /**
     * @param {string|number} id
     * @param {Object|null} headers
     * @returns {Promise<Account>}
     */
    static retrieve(id: any, headers?: {}): Promise<Account>;
    /**
     * @param {Object|null} params
     * @param {Object|null} headers
     *
     * @returns {Promise<FedaPayObject>}
     */
    static all(params?: {}, headers?: {}): Promise<FedaPayObject>;
    /**
     * @param {Object|null} params
     * @param {Object|null} headers
     *
     * @returns {Promise<Account>}
     */
    static create(params?: {}, headers?: {}): Promise<Account>;
    /**
     * @param {string} id The ID of the acount to update.
     * @param {Object|null} params
     * @param {Object|null} headers
     *
     * @returns {Promise<Account>}
     */
    static update(id: any, params?: {}, headers?: {}): Promise<Account>;
    /**
     * @param {Object|string|null} headers
     *
     * @returns {Promise<Account>} The saved account.
     */
    save(headers?: {}): Promise<Account>;
    /**
     * @param {Object} headers
     *
     * @returns {<Promise<Account>>} Account The deleted account.
     */
    delete(headers?: {}): Promise<Account>;
}
