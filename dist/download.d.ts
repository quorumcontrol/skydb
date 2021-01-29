/// <reference types="node" />
import { SkyDb } from "./client";
import { BaseCustomOptions } from "./utils";
/**
 * Custom download options.
 *
 * @property [download=false] - Indicates to `getSkylinkUrl` whether the file should be downloaded (true) or opened in the browser (false). `downloadFile` and `openFile` override this value.
 * @property [noResponseMetadata=false] - Download without metadata in the response.
 * @property [path=""] - A path to append to the skylink, e.g. `dir1/dir2/file`. A Unix-style path is expected. Each path component will be URL-encoded.
 * @property [query={}] - A query object to convert to a query parameter string and append to the URL.
 * @property [subdomain=false] - Whether to return the final skylink in subdomain format.
 * @property [receiver=void] - Used for a node download to handle the actual bytes of the downloaded file
 */
export declare type CustomDownloadOptions = BaseCustomOptions & {
    download?: boolean;
    noResponseMetadata?: boolean;
    path?: string;
    query?: Record<string, unknown>;
    subdomain?: boolean;
    receiver?: (buf: Promise<Buffer>) => any;
};
/**
 * Custom HNS download options.
 *
 * @property [hnsSubdomain="hns"] - The name of the hns subdomain on the portal.
 */
export declare type CustomHnsDownloadOptions = CustomDownloadOptions & {
    hnsSubdomain?: string;
};
/**
 * The response for a get file content request.
 *
 * @property data - The returned file content. Its type is stored in contentType.
 * @property contentType - The type of the content.
 * @property metadata - The metadata in JSON format.
 * @property skylink - 46-character skylink.
 */
export declare type GetFileContentResponse<T = unknown> = {
    data: T;
    contentType: string;
    metadata: Record<string, unknown>;
    skylink: string;
};
/**
 * The response for a get metadata request.
 *
 * @property contentType - The type of the content.
 * @property metadata - The metadata in JSON format.
 * @property skylink - 46-character skylink.
 */
export declare type GetMetadataResponse = {
    contentType: string;
    metadata: Record<string, unknown>;
    skylink: string;
};
/**
 * The response for a resolve HNS request.
 *
 * @property skylink - 46-character skylink.
 */
export declare type ResolveHnsResponse = {
    skylink: string;
};
/**
 * Gets the contents of the file at the given skylink.
 *
 * @param this - SkynetClient
 * @param skylinkUrl - Skylink string. See `downloadFile`.
 * @param [customOptions] - Additional settings that can optionally be set.
 * @param [customOptions.endpointPath="/"] - The relative URL path of the portal endpoint to contact.
 * @returns - An object containing the data of the file, the content-type, metadata, and the file's skylink.
 * @throws - Will throw if the skylinkUrl does not contain a skylink or if the path option is not a string.
 */
export declare function getFileContent<T = unknown>(this: SkyDb, skylinkUrl: string, customOptions?: CustomDownloadOptions): Promise<GetFileContentResponse<T>>;
/**
 * Does a GET request of the skylink, returning the data property of the response.
 *
 * @param this - SkynetClient
 * @param url - URL.
 * @param [customOptions] - Additional settings that can optionally be set.
 * @returns - An object containing the data of the file, the content-type, metadata, and the file's skylink.
 * @throws - Will throw if the request does not succeed or the response is missing data.
 */
export declare function getFileContentRequest<T = unknown>(this: SkyDb, url: string, customOptions?: CustomDownloadOptions): Promise<GetFileContentResponse<T>>;
/**
 * Constructs the full URL for the given skylink.
 *
 * @param this - SkynetClient
 * @param skylinkUrl - Skylink string. See `downloadFile`.
 * @param [customOptions] - Additional settings that can optionally be set.
 * @param [customOptions.endpointPath="/"] - The relative URL path of the portal endpoint to contact.
 * @returns - The full URL for the skylink.
 * @throws - Will throw if the skylinkUrl does not contain a skylink or if the path option is not a string.
 */
export declare function getSkylinkUrl(this: SkyDb, skylinkUrl: string, customOptions?: CustomDownloadOptions): string;
//# sourceMappingURL=download.d.ts.map