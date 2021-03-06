import { SkyDb } from "./client";
import { CustomGetEntryOptions, CustomSetEntryOptions } from "./registry";
import { BaseCustomOptions } from "./utils";
import { CustomUploadOptions } from "./upload";
import { CustomDownloadOptions } from "./download";
/**
 * Custom get JSON options.
 */
export declare type CustomGetJSONOptions = BaseCustomOptions & CustomGetEntryOptions & CustomDownloadOptions;
/**
 * Custom set JSON options.
 */
export declare type CustomSetJSONOptions = BaseCustomOptions & CustomSetEntryOptions & CustomUploadOptions;
export declare type VersionedEntryData = {
    data: Record<string, unknown> | null;
    revision: bigint | null;
};
/**
 * Gets the JSON object corresponding to the publicKey and dataKey.
 *
 * @param this - SkynetClient
 * @param publicKey - The user public key.
 * @param dataKey - The key of the data to fetch for the given user.
 * @param [customOptions] - Additional settings that can optionally be set.
 * @returns - The returned JSON and revision number.
 * @throws - Will throw if the returned signature does not match the returned entry, or if the skylink in the entry is invalid.
 */
export declare function getJSON(this: SkyDb, publicKey: string, dataKey: string, customOptions?: CustomGetJSONOptions): Promise<VersionedEntryData>;
/**
 * Sets a JSON object at the registry entry corresponding to the publicKey and dataKey.
 *
 * @param this - SkynetClient
 * @param privateKey - The user private key.
 * @param dataKey - The key of the data to fetch for the given user.
 * @param json - The JSON data to set.
 * @param [revision] - The revision number for the data entry.
 * @param [customOptions] - Additional settings that can optionally be set.
 * @throws - Will throw if the given entry revision does not fit in 64 bits, or if the revision was not given, if the latest revision of the entry is the maximum revision allowed.
 */
export declare function setJSON(this: SkyDb, privateKey: string, dataKey: string, json: Record<string, unknown>, revision?: bigint, customOptions?: CustomSetJSONOptions): Promise<void>;
//# sourceMappingURL=skydb.d.ts.map