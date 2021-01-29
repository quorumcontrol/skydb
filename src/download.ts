import { SkyDb } from "./client";
import {
  addSubdomain,
  addUrlQuery,
  BaseCustomOptions,
  convertSkylinkToBase32,
  defaultOptions,
  formatSkylink,
  makeUrl,
  parseSkylink,
  trimUriPrefix,
  uriHandshakePrefix,
  uriHandshakeResolverPrefix,
} from "./utils";
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
export type CustomDownloadOptions = BaseCustomOptions & {
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
export type CustomHnsDownloadOptions = CustomDownloadOptions & {
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
export type GetFileContentResponse<T = unknown> = {
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
export type GetMetadataResponse = {
  contentType: string;
  metadata: Record<string, unknown>;
  skylink: string;
};

/**
 * The response for a resolve HNS request.
 *
 * @property skylink - 46-character skylink.
 */
export type ResolveHnsResponse = {
  skylink: string;
};

const defaultDownloadOptions = {
  ...defaultOptions("/"),
};
const defaultDownloadHnsOptions = {
  ...defaultOptions("/hns"),
  hnsSubdomain: "hns",
};
const defaultResolveHnsOptions = {
  ...defaultOptions("/hnsres"),
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
export async function getFileContent<T = unknown>(
  this: SkyDb,
  skylinkUrl: string,
  customOptions?: CustomDownloadOptions
): Promise<GetFileContentResponse<T>> {
  /* istanbul ignore next */
  if (typeof skylinkUrl !== "string") {
    throw new Error(
      `Expected parameter skylinkUrl to be type string, was type ${typeof skylinkUrl}`
    );
  }

  const opts = {
    ...defaultDownloadOptions,
    ...this.customOptions,
    ...customOptions,
  };
  const url = this.getSkylinkUrl(skylinkUrl, opts);

  return this.getFileContentRequest<T>(url, opts);
}

/**
 * Does a GET request of the skylink, returning the data property of the response.
 *
 * @param this - SkynetClient
 * @param url - URL.
 * @param [customOptions] - Additional settings that can optionally be set.
 * @returns - An object containing the data of the file, the content-type, metadata, and the file's skylink.
 * @throws - Will throw if the request does not succeed or the response is missing data.
 */
export async function getFileContentRequest<T = unknown>(
  this: SkyDb,
  url: string,
  customOptions?: CustomDownloadOptions
): Promise<GetFileContentResponse<T>> {
  const opts = {
    ...defaultDownloadOptions,
    ...this.customOptions,
    ...customOptions,
  };

  // GET request the data at the skylink.
  const response = await this.executeRequest({
    ...opts,
    method: "get",
    url,
  });

  if (typeof response.data === "undefined") {
    throw new Error(
      "Did not get 'data' in response despite a successful request. Please try again and report this issue to the devs if it persists."
    );
  }
  if (typeof response.headers === "undefined") {
    throw new Error(
      "Did not get 'headers' in response despite a successful request. Please try again and report this issue to the devs if it persists."
    );
  }

  // TODO: Return null instead if header not found?
  const contentType = response.headers["content-type"] ?? "";
  const metadata = response.headers["skynet-file-metadata"]
    ? JSON.parse(response.headers["skynet-file-metadata"])
    : {};
  const skylink = response.headers["skynet-skylink"]
    ? formatSkylink(response.headers["skynet-skylink"])
    : "";

  return { data: response.data, contentType, metadata, skylink };
}

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
export function getSkylinkUrl(
  this: SkyDb,
  skylinkUrl: string,
  customOptions?: CustomDownloadOptions
): string {
  /* istanbul ignore next */
  if (typeof skylinkUrl !== "string") {
    throw new Error(
      `Expected parameter skylinkUrl to be type string, was type ${typeof skylinkUrl}`
    );
  }

  const opts = {
    ...defaultDownloadOptions,
    ...this.customOptions,
    ...customOptions,
  };
  const query = opts.query ?? {};
  if (opts.download) {
    // Set the "attachment" parameter.
    query.attachment = true;
  }
  if (opts.noResponseMetadata) {
    // Set the "no-response-metadata" parameter.
    query["no-response-metadata"] = true;
  }

  // URL-encode the path.
  let path = "";
  if (opts.path) {
    if (typeof opts.path !== "string") {
      throw new Error(
        `opts.path has to be a string, ${typeof opts.path} provided`
      );
    }

    // Encode each element of the path separately and join them.
    //
    // Don't use encodeURI because it does not encode characters such as '?'
    // etc. These are allowed as filenames on Skynet and should be encoded so
    // they are not treated as URL separators.
    path = opts.path
      .split("/")
      .map((element: string) => encodeURIComponent(element))
      .join("/");
  }

  let url;
  if (opts.subdomain) {
    // Get the path from the skylink. Use the empty string if not found.
    const skylinkPath = parseSkylink(skylinkUrl, { onlyPath: true }) ?? "";
    // Get just the skylink.
    let skylink = parseSkylink(skylinkUrl);
    if (skylink === null) {
      throw new Error(`Could not get skylink out of input '${skylinkUrl}'`);
    }
    // Convert the skylink (without the path) to base32.
    skylink = convertSkylinkToBase32(skylink);
    url = addSubdomain(this.portalUrl, skylink);
    url = makeUrl(url, skylinkPath, path);
  } else {
    // Get the skylink including the path.
    const skylink = parseSkylink(skylinkUrl, { includePath: true });
    if (skylink === null) {
      throw new Error(
        `Could not get skylink with path out of input '${skylinkUrl}'`
      );
    }
    // Add additional path if passed in.
    url = makeUrl(this.portalUrl, opts.endpointPath, skylink, path);
  }
  return addUrlQuery(url, query);
}
