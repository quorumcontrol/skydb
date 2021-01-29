import { CustomClientOptions } from "./client";
/**
 * Base custom options for methods hitting the API.
 *
 * @property [endpointPath] - The relative URL path of the portal endpoint to contact.
 */
export declare type BaseCustomOptions = CustomClientOptions & {
    endpointPath?: string;
};
/**
 * Parse skylink options.
 *
 * @property [fromSubdomain] - Whether to parse the skylink as a base32 subdomain in a URL.
 * @property [includePath] - Whether to include the path after the skylink, e.g. /<skylink>/foo/bar.
 * @property [onlyPath] - Whether to parse out just the path, e.g. /foo/bar. Will still return null if the string does not contain a skylink.
 */
export declare type ParseSkylinkOptions = {
    fromSubdomain?: boolean;
    includePath?: boolean;
    onlyPath?: boolean;
};
declare type ParseSkylinkBase32Options = {
    onlyPath?: boolean;
};
export declare const defaultSkynetPortalUrl = "https://siasky.net";
export declare const uriHandshakePrefix = "hns:";
export declare const uriHandshakeResolverPrefix = "hnsres:";
export declare const uriSkynetPrefix = "sia:";
/**
 * The maximum allowed value for an entry revision. Setting an entry revision to this value prevents it from being updated further.
 */
export declare const MAX_REVISION: bigint;
/**
 * Adds a subdomain to the given URL.
 *
 * @param url - The URL.
 * @param subdomain - The subdomain to add.
 * @returns - The final URL.
 */
export declare function addSubdomain(url: string, subdomain: string): string;
/**
 * Adds a query to the given URL.
 *
 * @param url - The URL.
 * @param query - The query parameters.
 * @returns - The final URL.
 */
export declare function addUrlQuery(url: string, query: Record<string, unknown>): string;
/**
 * Checks if the provided bigint can fit in a 64-bit unsigned integer.
 *
 * @param int - The provided integer.
 * @throws - Will throw if the int does not fit in 64 bits.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt/asUintN | MDN Demo}
 */
export declare function assertUint64(int: bigint): void;
/**
 * Converts the given base64 skylink to base32.
 *
 * @param skylink - The base64 skylink.
 * @returns - The converted base32 skylink.
 */
export declare function convertSkylinkToBase32(skylink: string): string;
/**
 * Returns the default base custom options for the given endpoint path.
 *
 * @param endpointPath - The endpoint path.
 * @returns - The base custom options.
 */
export declare function defaultOptions(endpointPath: string): CustomClientOptions & {
    endpointPath: string;
};
/**
 * Returns the default portal URL.
 *
 * @returns - The portal URL.
 */
export declare function defaultPortalUrl(): string;
/**
 * Formats the skylink by adding the sia: prefix.
 *
 * @param skylink - The skylink.
 * @returns - The formatted skylink.
 */
export declare function formatSkylink(skylink: string): string;
/**
 * Properly joins paths together to create a URL. Takes a variable number of
 * arguments.
 *
 * @param args - Array of URL parts to join.
 * @returns - Final URL constructed from the input parts.
 */
export declare function makeUrl(...args: string[]): string;
/**
 * Parses the given string for a base64 skylink, or base32 if opts.fromSubdomain is given.
 *
 * @param skylinkUrl - Plain skylink, skylink with URI prefix, or URL with skylink as the first path element.
 * @param [opts] - Additional settings that can optionally be set.
 * @returns - The base64 (or base32) skylink, optionally with the path included.
 * @throws - Will throw on invalid combination of options.
 */
export declare function parseSkylink(skylinkUrl: string, opts?: ParseSkylinkOptions): string | null;
/**
 * Parses the given string for a base32 skylink.
 *
 * @param skylinkUrl - Base32 skylink.
 * @param [opts] - Additional settings that can optionally be set.
 * @returns - The base32 skylink.
 */
export declare function parseSkylinkBase32(skylinkUrl: string, opts?: ParseSkylinkBase32Options): string | null;
/**
 * Removes a prefix from the beginning of the string.
 *
 * @param str - The string to process.
 * @returns - The processed string.
 */
export declare function trimForwardSlash(str: string): string;
/**
 * Removes a prefix from the beginning of the string.
 *
 * @param str - The string to process.
 * @param prefix - The prefix to remove.
 * @returns - The processed string.
 */
export declare function trimPrefix(str: string, prefix: string): string;
/**
 * Removes a URI prefix from the beginning of the string.
 *
 * @param str - The string to process.
 * @param prefix - The prefix to remove.
 * @returns - The processed string.
 */
export declare function trimUriPrefix(str: string, prefix: string): string;
/**
 * Converts a string to a uint8 array.
 *
 * @param str - The string to convert.
 * @returns - The uint8 array.
 * @throws - Will throw if the input is not a string.
 */
export declare function stringToUint8Array(str: string): Uint8Array;
/**
 * Converts a hex encoded string to a uint8 array
 *
 * @param str - The string to convert.
 * @returns - The uint8 array.
 * @throws - Will throw if the input is not a valid hex-encoded string.
 */
export declare function hexToUint8Array(str: string): Uint8Array;
/**
 * Returns true if the input is a valid hex-encoded string.
 *
 * @param str - The input string.
 * @returns - True if the input is hex-encoded.
 * @throws - Will throw if the input is not a string.
 */
export declare function isHexString(str: string): boolean;
/**
 * Convert a byte array to a hex string.
 *
 * @param byteArray - The byte array to convert.
 * @returns - The hex string.
 * @see {@link https://stackoverflow.com/a/44608819|Stack Overflow}
 */
export declare function toHexString(byteArray: Uint8Array): string;
export {};
//# sourceMappingURL=utils.d.ts.map