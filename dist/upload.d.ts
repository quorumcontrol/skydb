/// <reference types="node" />
import { AxiosResponse } from "axios";
import { SkyDb } from "./client";
import { BaseCustomOptions } from "./utils";
/**
 * Custom upload options.
 *
 * @property [portalFileFieldname="file"] - The file fieldname for uploading files on this portal.
 * @property [portalDirectoryfilefieldname="files[]"] - The file fieldname for uploading directories on this portal.
 * @property [customFilename] - The custom filename to use when uploading files.
 * @property [query] - Query parameters.
 */
export declare type CustomUploadOptions = BaseCustomOptions & {
    portalFileFieldname?: string;
    portalDirectoryFileFieldname?: string;
    customFilename?: string;
    query?: Record<string, unknown>;
};
/**
 * The response to an upload request.
 *
 * @property skylink - 46-character skylink.
 * @property merkleroot - The hash that is encoded into the skylink.
 * @property bitfield - The bitfield that gets encoded into the skylink. The bitfield contains a version, an offset and a length in a heavily compressed and optimized format.
 */
export declare type UploadRequestResponse = {
    skylink: string;
    merkleroot: string;
    bitfield: number;
};
/**
 * Uploads a file to Skynet.
 *
 * @param this - SkynetClient
 * @param file - The file to upload.
 * @param [customOptions] - Additional settings that can optionally be set.
 * @param [customOptions.endpointPath="/skynet/skyfile"] - The relative URL path of the portal endpoint to contact.
 * @returns - The returned skylink.
 * @throws - Will throw if the request is successful but the upload response does not contain a complete response.
 */
export declare function uploadFile(this: SkyDb, bits: Buffer, customOptions?: CustomUploadOptions): Promise<UploadRequestResponse>;
/**
 * Makes a request to upload a file to Skynet.
 *
 * @param this - SkynetClient
 * @param file - The file to upload.
 * @param [customOptions] - Additional settings that can optionally be set.
 * @param [customOptions.endpointPath="/skynet/skyfile"] - The relative URL path of the portal endpoint to contact.
 * @returns - The upload response.
 */
export declare function uploadFileRequest(cli: SkyDb, bits: Buffer, customOptions?: CustomUploadOptions): Promise<AxiosResponse>;
//# sourceMappingURL=upload.d.ts.map