import { SkyDb } from "./client";
import { BaseCustomOptions } from "./utils";
import { Signature } from "./crypto";
/**
 * Custom get entry options.
 *
 * @property [timeout=5] - The custom timeout for getting an entry, in seconds. The maximum value allowed is 300.
 */
export declare type CustomGetEntryOptions = BaseCustomOptions & {
    timeout?: number;
};
/**
 * Custom set entry options.
 */
export declare type CustomSetEntryOptions = BaseCustomOptions;
export declare const MAX_GET_ENTRY_TIMEOUT = 300;
/**
 * Regex for JSON revision value without quotes.
 */
export declare const regexRevisionNoQuotes: RegExp;
/**
 * Registry entry.
 *
 * @property datakey - The key of the data for the given entry.
 * @property data - The data stored in the entry.
 * @property revision - The revision number for the entry.
 */
export declare type RegistryEntry = {
    datakey: string;
    data: string;
    revision: bigint;
};
/**
 * Signed registry entry.
 *
 * @property entry - The registry entry.
 * @property signature - The signature of the registry entry.
 */
export declare type SignedRegistryEntry = {
    entry: RegistryEntry | null;
    signature: Signature | null;
};
/**
 * Gets the registry entry corresponding to the publicKey and dataKey.
 *
 * @param this - SkyDb
 * @param publicKey - The user public key.
 * @param dataKey - The key of the data to fetch for the given user.
 * @param [customOptions] - Additional settings that can optionally be set.
 * @returns - The signed registry entry.
 * @throws - Will throw if the returned signature does not match the returned entry or the provided timeout is invalid or the given key is not valid.
 */
export declare function getEntry(this: SkyDb, publicKey: string, dataKey: string, customOptions?: CustomGetEntryOptions): Promise<SignedRegistryEntry>;
/**
 * Gets the registry entry URL corresponding to the publicKey and dataKey.
 *
 * @param this - SkyDb
 * @param publicKey - The user public key.
 * @param dataKey - The key of the data to fetch for the given user.
 * @param [customOptions] - Additional settings that can optionally be set.
 * @returns - The full get entry URL.
 * @throws - Will throw if the provided timeout is invalid or the given key is not valid.
 */
export declare function getEntryUrl(this: SkyDb, publicKey: string, dataKey: string, customOptions?: CustomGetEntryOptions): string;
/**
 * Sets the registry entry.
 *
 * @param this - SkyDb
 * @param privateKey - The user private key.
 * @param entry - The entry to set.
 * @param [customOptions] - Additional settings that can optionally be set.
 * @throws - Will throw if the entry revision does not fit in 64 bits or the given key is not valid.
 */
export declare function setEntry(this: SkyDb, privateKey: string, entry: RegistryEntry, customOptions?: CustomSetEntryOptions): Promise<void>;
//# sourceMappingURL=registry.d.ts.map