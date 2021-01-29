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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getSkylinkUrl = exports.getFileContentRequest = exports.getFileContent = void 0;
var utils_1 = require("./utils");
var defaultDownloadOptions = __assign({}, utils_1.defaultOptions("/"));
var defaultDownloadHnsOptions = __assign(__assign({}, utils_1.defaultOptions("/hns")), { hnsSubdomain: "hns" });
var defaultResolveHnsOptions = __assign({}, utils_1.defaultOptions("/hnsres"));
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
function getFileContent(skylinkUrl, customOptions) {
    return __awaiter(this, void 0, void 0, function () {
        var opts, url;
        return __generator(this, function (_a) {
            /* istanbul ignore next */
            if (typeof skylinkUrl !== "string") {
                throw new Error("Expected parameter skylinkUrl to be type string, was type " + typeof skylinkUrl);
            }
            opts = __assign(__assign(__assign({}, defaultDownloadOptions), this.customOptions), customOptions);
            url = this.getSkylinkUrl(skylinkUrl, opts);
            return [2 /*return*/, this.getFileContentRequest(url, opts)];
        });
    });
}
exports.getFileContent = getFileContent;
/**
 * Does a GET request of the skylink, returning the data property of the response.
 *
 * @param this - SkynetClient
 * @param url - URL.
 * @param [customOptions] - Additional settings that can optionally be set.
 * @returns - An object containing the data of the file, the content-type, metadata, and the file's skylink.
 * @throws - Will throw if the request does not succeed or the response is missing data.
 */
function getFileContentRequest(url, customOptions) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var opts, response, contentType, metadata, skylink;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    opts = __assign(__assign(__assign({}, defaultDownloadOptions), this.customOptions), customOptions);
                    return [4 /*yield*/, this.executeRequest(__assign(__assign({}, opts), { method: "get", url: url }))];
                case 1:
                    response = _b.sent();
                    if (typeof response.data === "undefined") {
                        throw new Error("Did not get 'data' in response despite a successful request. Please try again and report this issue to the devs if it persists.");
                    }
                    if (typeof response.headers === "undefined") {
                        throw new Error("Did not get 'headers' in response despite a successful request. Please try again and report this issue to the devs if it persists.");
                    }
                    contentType = (_a = response.headers["content-type"]) !== null && _a !== void 0 ? _a : "";
                    metadata = response.headers["skynet-file-metadata"]
                        ? JSON.parse(response.headers["skynet-file-metadata"])
                        : {};
                    skylink = response.headers["skynet-skylink"]
                        ? utils_1.formatSkylink(response.headers["skynet-skylink"])
                        : "";
                    return [2 /*return*/, { data: response.data, contentType: contentType, metadata: metadata, skylink: skylink }];
            }
        });
    });
}
exports.getFileContentRequest = getFileContentRequest;
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
function getSkylinkUrl(skylinkUrl, customOptions) {
    var _a, _b;
    /* istanbul ignore next */
    if (typeof skylinkUrl !== "string") {
        throw new Error("Expected parameter skylinkUrl to be type string, was type " + typeof skylinkUrl);
    }
    var opts = __assign(__assign(__assign({}, defaultDownloadOptions), this.customOptions), customOptions);
    var query = (_a = opts.query) !== null && _a !== void 0 ? _a : {};
    if (opts.download) {
        // Set the "attachment" parameter.
        query.attachment = true;
    }
    if (opts.noResponseMetadata) {
        // Set the "no-response-metadata" parameter.
        query["no-response-metadata"] = true;
    }
    // URL-encode the path.
    var path = "";
    if (opts.path) {
        if (typeof opts.path !== "string") {
            throw new Error("opts.path has to be a string, " + typeof opts.path + " provided");
        }
        // Encode each element of the path separately and join them.
        //
        // Don't use encodeURI because it does not encode characters such as '?'
        // etc. These are allowed as filenames on Skynet and should be encoded so
        // they are not treated as URL separators.
        path = opts.path
            .split("/")
            .map(function (element) { return encodeURIComponent(element); })
            .join("/");
    }
    var url;
    if (opts.subdomain) {
        // Get the path from the skylink. Use the empty string if not found.
        var skylinkPath = (_b = utils_1.parseSkylink(skylinkUrl, { onlyPath: true })) !== null && _b !== void 0 ? _b : "";
        // Get just the skylink.
        var skylink = utils_1.parseSkylink(skylinkUrl);
        if (skylink === null) {
            throw new Error("Could not get skylink out of input '" + skylinkUrl + "'");
        }
        // Convert the skylink (without the path) to base32.
        skylink = utils_1.convertSkylinkToBase32(skylink);
        url = utils_1.addSubdomain(this.portalUrl, skylink);
        url = utils_1.makeUrl(url, skylinkPath, path);
    }
    else {
        // Get the skylink including the path.
        var skylink = utils_1.parseSkylink(skylinkUrl, { includePath: true });
        if (skylink === null) {
            throw new Error("Could not get skylink with path out of input '" + skylinkUrl + "'");
        }
        // Add additional path if passed in.
        url = utils_1.makeUrl(this.portalUrl, opts.endpointPath, skylink, path);
    }
    return utils_1.addUrlQuery(url, query);
}
exports.getSkylinkUrl = getSkylinkUrl;
