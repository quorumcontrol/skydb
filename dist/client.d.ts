import { AxiosResponse } from "axios";
import type { Method } from "axios";
import { uploadFile } from './upload';
import { getSkylinkUrl, getFileContent, getFileContentRequest } from './download';
import FormData from 'form-data';
/**
 * Custom client options.
 *
 * @property [APIKey] - Authentication password to use.
 * @property [customUserAgent] - Custom user agent header to set.
 * @property [onUploadProgress] - Optional callback to track upload progress.
 */
export declare type CustomClientOptions = {
    APIKey?: string;
    customUserAgent?: string;
    onUploadProgress?: (progress: number, event: ProgressEvent) => void;
};
/**
 * Config options for a single request.
 *
 * @property [data] - The data for a POST request.
 * @property [url] - The full url to contact. Will be computed from the portalUrl and endpointPath if not provided.
 * @property [method] - The request method.
 * @property [query] - Query parameters.
 * @property [timeout] - Request timeout. May be deprecated.
 * @property [extraPath] - An additional path to append to the URL, e.g. a 46-character skylink.
 */
export declare type RequestConfig = CustomClientOptions & {
    endpointPath: string;
    data?: FormData | Record<string, unknown>;
    url?: string;
    method?: Method;
    query?: Record<string, unknown>;
    timeout?: number;
    extraPath?: string;
    skykeyName?: string;
    skykeyId?: string;
    headers?: Record<string, unknown>;
    transformRequest?: (data: unknown) => string;
    transformResponse?: (data: string) => Record<string, unknown>;
};
export declare class SkyDb {
    portalUrl: string;
    customOptions: CustomClientOptions;
    uploadFile: typeof uploadFile;
    getSkylinkUrl: typeof getSkylinkUrl;
    getFileContentRequest: typeof getFileContentRequest;
    getFileContent: typeof getFileContent;
    registry: {
        getEntry: (publicKey: string, dataKey: string, customOptions?: import("./registry").CustomGetEntryOptions) => Promise<import("./registry").SignedRegistryEntry>;
        getEntryUrl: (publicKey: string, dataKey: string, customOptions?: import("./registry").CustomGetEntryOptions) => string;
        setEntry: (privateKey: string, entry: import("./registry").RegistryEntry, customOptions?: import("./utils").BaseCustomOptions) => Promise<void>;
    };
    db: {
        getJSON: (publicKey: string, dataKey: string, customOptions?: import("./skydb").CustomGetJSONOptions) => Promise<import("./skydb").VersionedEntryData>;
        setJSON: (privateKey: string, dataKey: string, json: Record<string, unknown>, revision?: bigint, customOptions?: import("./upload").CustomUploadOptions) => Promise<void>;
    };
    /**
     * The Skynet Client which can be used to access Skynet.
     *
     * @class
     * @param [portalUrl] The portal URL to use to access Skynet, if specified. To use the default portal while passing custom options, use ""
     * @param [customOptions] Configuration for the client.
     */
    constructor(portalUrl?: string, customOptions?: CustomClientOptions);
    /**
     * Creates and executes a request.
     *
     * @param config - Configuration for the request.
     * @returns - The response from axios.
     * @throws - Will throw if unimplemented options have been passed in.
     */
    executeRequest(config: RequestConfig): Promise<AxiosResponse>;
}
//# sourceMappingURL=client.d.ts.map