"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.toHexString = exports.isHexString = exports.hexToUint8Array = exports.stringToUint8Array = exports.trimUriPrefix = exports.trimPrefix = exports.trimForwardSlash = exports.parseSkylinkBase32 = exports.parseSkylink = exports.makeUrl = exports.formatSkylink = exports.defaultPortalUrl = exports.defaultOptions = exports.convertSkylinkToBase32 = exports.assertUint64 = exports.addUrlQuery = exports.addSubdomain = exports.MAX_REVISION = exports.uriSkynetPrefix = exports.uriHandshakeResolverPrefix = exports.uriHandshakePrefix = exports.defaultSkynetPortalUrl = void 0;
var base64_js_1 = __importDefault(require("base64-js"));
var base32_encode_1 = __importDefault(require("base32-encode"));
// import mimeDB from "mime-db";
var url_parse_1 = __importDefault(require("url-parse"));
var url_join_1 = __importDefault(require("url-join"));
var buffer_1 = require("buffer");
exports.defaultSkynetPortalUrl = "https://siasky.net";
exports.uriHandshakePrefix = "hns:";
exports.uriHandshakeResolverPrefix = "hnsres:";
exports.uriSkynetPrefix = "sia:";
/**
 * The maximum allowed value for an entry revision. Setting an entry revision to this value prevents it from being updated further.
 */
exports.MAX_REVISION = BigInt("18446744073709551615"); // max uint64
/**
 * Adds a subdomain to the given URL.
 *
 * @param url - The URL.
 * @param subdomain - The subdomain to add.
 * @returns - The final URL.
 */
function addSubdomain(url, subdomain) {
    var urlObj = new URL(url);
    urlObj.hostname = subdomain + "." + urlObj.hostname;
    var str = urlObj.toString();
    return trimSuffix(str, "/");
}
exports.addSubdomain = addSubdomain;
/**
 * Adds a query to the given URL.
 *
 * @param url - The URL.
 * @param query - The query parameters.
 * @returns - The final URL.
 */
function addUrlQuery(url, query) {
    var parsed = url_parse_1["default"](url, true);
    // Combine the desired query params with the already existing ones.
    query = __assign(__assign({}, parsed.query), query);
    parsed.set("query", query);
    return parsed.toString();
}
exports.addUrlQuery = addUrlQuery;
/**
 * Checks if the provided bigint can fit in a 64-bit unsigned integer.
 *
 * @param int - The provided integer.
 * @throws - Will throw if the int does not fit in 64 bits.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt/asUintN | MDN Demo}
 */
function assertUint64(int) {
    /* istanbul ignore next */
    if (typeof int !== "bigint") {
        throw new Error("Expected parameter int to be type bigint, was type " + typeof int);
    }
    if (int < BigInt(0)) {
        throw new Error("Argument " + int + " must be an unsigned 64-bit integer; was negative");
    }
    if (int > exports.MAX_REVISION) {
        throw new Error("Argument " + int + " does not fit in a 64-bit unsigned integer; exceeds 2^64-1");
    }
}
exports.assertUint64 = assertUint64;
/**
 * Converts the given base64 skylink to base32.
 *
 * @param skylink - The base64 skylink.
 * @returns - The converted base32 skylink.
 */
function convertSkylinkToBase32(skylink) {
    var decoded = base64_js_1["default"].toByteArray(skylink.padEnd(skylink.length + 4 - (skylink.length % 4), "="));
    return base32_encode_1["default"](decoded, "RFC4648-HEX", { padding: false }).toLowerCase();
}
exports.convertSkylinkToBase32 = convertSkylinkToBase32;
/**
 * Returns the default base custom options for the given endpoint path.
 *
 * @param endpointPath - The endpoint path.
 * @returns - The base custom options.
 */
function defaultOptions(endpointPath) {
    return {
        endpointPath: endpointPath,
        APIKey: "",
        customUserAgent: ""
    };
}
exports.defaultOptions = defaultOptions;
// TODO: This will be smarter. See
// https://github.com/NebulousLabs/skynet-docs/issues/21.
/**
 * Returns the default portal URL.
 *
 * @returns - The portal URL.
 */
function defaultPortalUrl() {
    return exports.defaultSkynetPortalUrl;
}
exports.defaultPortalUrl = defaultPortalUrl;
/**
 * Formats the skylink by adding the sia: prefix.
 *
 * @param skylink - The skylink.
 * @returns - The formatted skylink.
 */
function formatSkylink(skylink) {
    if (skylink == "") {
        return skylink;
    }
    if (!skylink.startsWith(exports.uriSkynetPrefix)) {
        skylink = "" + exports.uriSkynetPrefix + skylink;
    }
    return skylink;
}
exports.formatSkylink = formatSkylink;
// /**
//  * Gets the path for the file.
//  *
//  * @param file - The file.
//  * @returns - The path.
//  */
// function getFilePath(
//   file: File & {
//     webkitRelativePath?: string;
//     path?: string;
//   }
// ): string {
//   /* istanbul ignore next */
//   return file.webkitRelativePath || file.path || file.name;
// }
// /**
//  * Gets the file path relative to the root directory of the path, e.g. `bar` in `/foo/bar`.
//  *
//  * @param file - The input file.
//  * @returns - The relative file path.
//  */
// export function getRelativeFilePath(file: File): string {
//   const filePath = getFilePath(file);
//   const { root, dir, base } = path.parse(filePath);
//   const relative = path.normalize(dir).slice(root.length).split(path.sep).slice(1);
//   return path.join(...relative, base);
// }
// /**
//  * Gets the root directory of the file path, e.g. `foo` in `/foo/bar`.
//  *
//  * @param file - The input file.
//  * @returns - The root directory.
//  */
// export function getRootDirectory(file: File): string {
//   const filePath = getFilePath(file);
//   const { root, dir } = path.parse(filePath);
//   return path.normalize(dir).slice(root.length).split(path.sep)[0];
// }
/**
 * Properly joins paths together to create a URL. Takes a variable number of
 * arguments.
 *
 * @param args - Array of URL parts to join.
 * @returns - Final URL constructed from the input parts.
 */
function makeUrl() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args.reduce(function (acc, cur) { return url_join_1["default"](acc, cur); });
}
exports.makeUrl = makeUrl;
var SKYLINK_MATCHER = "([a-zA-Z0-9_-]{46})";
var SKYLINK_MATCHER_SUBDOMAIN = "([a-z0-9_-]{55})";
var SKYLINK_DIRECT_REGEX = new RegExp("^" + SKYLINK_MATCHER + "$");
var SKYLINK_PATHNAME_REGEX = new RegExp("^/?" + SKYLINK_MATCHER + "((/.*)?)$");
var SKYLINK_SUBDOMAIN_REGEX = new RegExp("^" + SKYLINK_MATCHER_SUBDOMAIN + "(\\..*)?$");
var SKYLINK_DIRECT_MATCH_POSITION = 1;
var SKYLINK_PATH_MATCH_POSITION = 2;
/**
 * Parses the given string for a base64 skylink, or base32 if opts.fromSubdomain is given.
 *
 * @param skylinkUrl - Plain skylink, skylink with URI prefix, or URL with skylink as the first path element.
 * @param [opts] - Additional settings that can optionally be set.
 * @returns - The base64 (or base32) skylink, optionally with the path included.
 * @throws - Will throw on invalid combination of options.
 */
function parseSkylink(skylinkUrl, opts) {
    if (opts === void 0) { opts = {}; }
    if (typeof skylinkUrl !== "string")
        throw new Error("Skylink has to be a string, " + typeof skylinkUrl + " provided");
    if (opts.includePath && opts.onlyPath) {
        throw new Error("The includePath and onlyPath options cannot both be set");
    }
    if (opts.includePath && opts.fromSubdomain) {
        throw new Error("The includePath and fromSubdomain options cannot both be set");
    }
    if (opts.fromSubdomain) {
        return parseSkylinkBase32(skylinkUrl, opts);
    }
    // Check for skylink prefixed with sia: or sia:// and extract it.
    // Example: sia:XABvi7JtJbQSMAcDwnUnmp2FKDPjg8_tTTFP4BwMSxVdEg
    // Example: sia://XABvi7JtJbQSMAcDwnUnmp2FKDPjg8_tTTFP4BwMSxVdEg
    skylinkUrl = trimUriPrefix(skylinkUrl, exports.uriSkynetPrefix);
    // Check for direct base64 skylink match.
    var matchDirect = skylinkUrl.match(SKYLINK_DIRECT_REGEX);
    if (matchDirect) {
        if (opts.onlyPath) {
            return "";
        }
        return matchDirect[SKYLINK_DIRECT_MATCH_POSITION];
    }
    // Check for skylink passed in an url and extract it.
    // Example: https://siasky.net/XABvi7JtJbQSMAcDwnUnmp2FKDPjg8_tTTFP4BwMSxVdEg
    // Example: https://bg06v2tidkir84hg0s1s4t97jaeoaa1jse1svrad657u070c9calq4g.siasky.net (if opts.fromSubdomain = true)
    // Pass empty object as second param to disable using location as base url
    // when parsing in browser.
    var parsed = url_parse_1["default"](skylinkUrl, {});
    var skylinkAndPath = trimSuffix(parsed.pathname, "/");
    var matchPathname = skylinkAndPath.match(SKYLINK_PATHNAME_REGEX);
    if (!matchPathname)
        return null;
    var path = matchPathname[SKYLINK_PATH_MATCH_POSITION];
    if (opts.includePath)
        return trimForwardSlash(skylinkAndPath);
    else if (opts.onlyPath)
        return path;
    else
        return matchPathname[SKYLINK_DIRECT_MATCH_POSITION];
}
exports.parseSkylink = parseSkylink;
/**
 * Parses the given string for a base32 skylink.
 *
 * @param skylinkUrl - Base32 skylink.
 * @param [opts] - Additional settings that can optionally be set.
 * @returns - The base32 skylink.
 */
function parseSkylinkBase32(skylinkUrl, opts) {
    if (opts === void 0) { opts = {}; }
    // Pass empty object as second param to disable using location as base url
    // when parsing in browser.
    var parsed = url_parse_1["default"](skylinkUrl, {});
    // Check if the hostname contains a skylink subdomain.
    var matchHostname = parsed.hostname.match(SKYLINK_SUBDOMAIN_REGEX);
    if (matchHostname) {
        if (opts.onlyPath) {
            return trimSuffix(parsed.pathname, "/");
        }
        return matchHostname[SKYLINK_DIRECT_MATCH_POSITION];
    }
    return null;
}
exports.parseSkylinkBase32 = parseSkylinkBase32;
/**
 * Removes a prefix from the beginning of the string.
 *
 * @param str - The string to process.
 * @returns - The processed string.
 */
function trimForwardSlash(str) {
    return trimPrefix(trimSuffix(str, "/"), "/");
}
exports.trimForwardSlash = trimForwardSlash;
/**
 * Removes a prefix from the beginning of the string.
 *
 * @param str - The string to process.
 * @param prefix - The prefix to remove.
 * @returns - The processed string.
 */
function trimPrefix(str, prefix) {
    while (str.startsWith(prefix)) {
        str = str.slice(prefix.length);
    }
    return str;
}
exports.trimPrefix = trimPrefix;
/**
 * Removes a suffix from the end of the string.
 *
 * @param str - The string to process.
 * @param suffix - The suffix to remove.
 * @returns - The processed string.
 */
function trimSuffix(str, suffix) {
    while (str.endsWith(suffix)) {
        str = str.substring(0, str.length - suffix.length);
    }
    return str;
}
/**
 * Removes a URI prefix from the beginning of the string.
 *
 * @param str - The string to process.
 * @param prefix - The prefix to remove.
 * @returns - The processed string.
 */
function trimUriPrefix(str, prefix) {
    var longPrefix = prefix + "//";
    if (str.startsWith(longPrefix)) {
        // longPrefix is exactly at the beginning
        return str.slice(longPrefix.length);
    }
    if (str.startsWith(prefix)) {
        // else prefix is exactly at the beginning
        return str.slice(prefix.length);
    }
    return str;
}
exports.trimUriPrefix = trimUriPrefix;
/**
 * Converts a string to a uint8 array.
 *
 * @param str - The string to convert.
 * @returns - The uint8 array.
 * @throws - Will throw if the input is not a string.
 */
function stringToUint8Array(str) {
    /* istanbul ignore next */
    if (typeof str !== "string") {
        throw new Error("Expected parameter str to be type string, was type " + typeof str);
    }
    return Uint8Array.from(buffer_1.Buffer.from(str));
}
exports.stringToUint8Array = stringToUint8Array;
/**
 * Converts a hex encoded string to a uint8 array
 *
 * @param str - The string to convert.
 * @returns - The uint8 array.
 * @throws - Will throw if the input is not a valid hex-encoded string.
 */
function hexToUint8Array(str) {
    if (!isHexString(str)) {
        throw new Error("Input string '" + str + "' is not a valid hex-encoded string");
    }
    var matches = str.match(/.{1,2}/g);
    if (matches === null) {
        throw new Error("Input string '" + str + "' is not a valid hex-encoded string");
    }
    return new Uint8Array(matches.map(function (byte) { return parseInt(byte, 16); }));
}
exports.hexToUint8Array = hexToUint8Array;
/**
 * Returns true if the input is a valid hex-encoded string.
 *
 * @param str - The input string.
 * @returns - True if the input is hex-encoded.
 * @throws - Will throw if the input is not a string.
 */
function isHexString(str) {
    /* istanbul ignore next */
    if (typeof str !== "string") {
        throw new Error("Expected parameter str to be type string, was type " + typeof str);
    }
    return /^[0-9A-Fa-f]*$/g.test(str);
}
exports.isHexString = isHexString;
/**
 * Convert a byte array to a hex string.
 *
 * @param byteArray - The byte array to convert.
 * @returns - The hex string.
 * @see {@link https://stackoverflow.com/a/44608819|Stack Overflow}
 */
function toHexString(byteArray) {
    var s = "";
    byteArray.forEach(function (byte) {
        s += ("0" + (byte & 0xff).toString(16)).slice(-2);
    });
    return s;
}
exports.toHexString = toHexString;
// /**
//  * Get the file mime type. In case the type is not provided, use mime-db and try
//  * to guess the file type based on the extension.
//  *
//  * @param file - The file.
//  * @returns - The mime type.
//  */
// export function getFileMimeType(file: File): string {
//   if (file.type) return file.type;
//   let { ext } = path.parse(file.name);
//   ext = trimPrefix(ext, ".");
//   if (ext !== "") {
//     for (const type in mimeDB) {
//       if (mimeDB[type]?.extensions?.includes(ext)) {
//         return type;
//       }
//     }
//   }
//   return "";
// }
