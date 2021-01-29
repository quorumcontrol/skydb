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
exports.setEntry = exports.getEntryUrl = exports.getEntry = exports.regexRevisionNoQuotes = exports.MAX_GET_ENTRY_TIMEOUT = void 0;
var node_forge_1 = require("node-forge");
var utils_1 = require("./utils");
var buffer_1 = require("buffer");
var crypto_1 = require("./crypto");
var defaultGetEntryOptions = __assign(__assign({}, utils_1.defaultOptions("/skynet/registry")), { timeout: 5 });
var defaultSetEntryOptions = __assign({}, utils_1.defaultOptions("/skynet/registry"));
exports.MAX_GET_ENTRY_TIMEOUT = 300; // 5 minutes
/**
 * Regex for JSON revision value without quotes.
 */
exports.regexRevisionNoQuotes = /"revision":\s*([0-9]+)/;
/**
 * Regex for JSON revision value with quotes.
 */
var regexRevisionWithQuotes = /"revision":\s*"([0-9]+)"/;
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
function getEntry(publicKey, dataKey, customOptions) {
    return __awaiter(this, void 0, void 0, function () {
        var opts, url, publicKeyBuffer, response, err_1, signedEntry;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    opts = __assign(__assign(__assign({}, defaultGetEntryOptions), this.customOptions), customOptions);
                    url = this.registry.getEntryUrl(publicKey, dataKey, opts);
                    publicKeyBuffer = buffer_1.Buffer.from(publicKey, "hex");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, this.executeRequest(__assign(__assign({}, opts), { url: url, method: "get", 
                            // Transform the response to add quotes, since uint64 cannot be accurately
                            // read by JS so the revision needs to be parsed as a string.
                            transformResponse: function (data) {
                                if (data === undefined) {
                                    return {};
                                }
                                // Change the revision value from a JSON integer to a string.
                                data = data.replace(exports.regexRevisionNoQuotes, '"revision":"$1"');
                                // Convert the JSON data to an object.
                                return JSON.parse(data);
                            } }))];
                case 2:
                    response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    // @ts-expect-error TS complains about err.response
                    if (err_1.response.status === 404) {
                        return [2 /*return*/, { entry: null, signature: null }];
                    }
                    // @ts-expect-error TS complains about err.response
                    throw new Error(err_1.response.data.message);
                case 4:
                    // Sanity check.
                    if (typeof response.data.data !== "string" ||
                        typeof response.data.revision !== "string" ||
                        typeof response.data.signature !== "string") {
                        throw new Error("Did not get a complete entry response despite a successful request. Please try again and report this issue to the devs if it persists.");
                    }
                    signedEntry = {
                        entry: {
                            datakey: dataKey,
                            data: buffer_1.Buffer.from(utils_1.hexToUint8Array(response.data.data)).toString(),
                            // Convert the revision from a string to bigint.
                            revision: BigInt(response.data.revision)
                        },
                        signature: buffer_1.Buffer.from(utils_1.hexToUint8Array(response.data.signature))
                    };
                    if (signedEntry &&
                        !node_forge_1.pki.ed25519.verify({
                            message: crypto_1.hashRegistryEntry(signedEntry.entry),
                            signature: signedEntry.signature,
                            publicKey: publicKeyBuffer
                        })) {
                        throw new Error("could not verify signature from retrieved, signed registry entry -- possible corrupted entry");
                    }
                    return [2 /*return*/, signedEntry];
            }
        });
    });
}
exports.getEntry = getEntry;
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
function getEntryUrl(publicKey, dataKey, customOptions) {
    /* istanbul ignore next */
    if (typeof publicKey !== "string") {
        throw new Error("Expected parameter publicKey to be type string, was type " + typeof publicKey);
    }
    /* istanbul ignore next */
    if (typeof dataKey !== "string") {
        throw new Error("Expected parameter dataKey to be type string, was type " + typeof dataKey);
    }
    var opts = __assign(__assign(__assign({}, defaultGetEntryOptions), this.customOptions), customOptions);
    var timeout = opts.timeout;
    if (!Number.isInteger(timeout) || timeout > exports.MAX_GET_ENTRY_TIMEOUT || timeout < 1) {
        throw new Error("Invalid 'timeout' parameter '" + timeout + "', needs to be an integer between 1s and " + exports.MAX_GET_ENTRY_TIMEOUT + "s");
    }
    // Trim the prefix if it was passed in.
    publicKey = utils_1.trimPrefix(publicKey, "ed25519:");
    if (!utils_1.isHexString(publicKey)) {
        throw new Error("Given public key '" + publicKey + "' is not a valid hex-encoded string or contains an invalid prefix");
    }
    var query = {
        publickey: "ed25519:" + publicKey,
        datakey: utils_1.toHexString(crypto_1.hashDataKey(dataKey)),
        timeout: timeout
    };
    var url = utils_1.makeUrl(this.portalUrl, opts.endpointPath);
    url = utils_1.addUrlQuery(url, query);
    return url;
}
exports.getEntryUrl = getEntryUrl;
/**
 * Sets the registry entry.
 *
 * @param this - SkyDb
 * @param privateKey - The user private key.
 * @param entry - The entry to set.
 * @param [customOptions] - Additional settings that can optionally be set.
 * @throws - Will throw if the entry revision does not fit in 64 bits or the given key is not valid.
 */
function setEntry(privateKey, entry, customOptions) {
    return __awaiter(this, void 0, void 0, function () {
        var opts, privateKeyBuffer, signature, publicKeyBuffer, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    /* istanbul ignore next */
                    if (typeof privateKey !== "string") {
                        throw new Error("Expected parameter privateKey to be type string, was type " + typeof privateKey);
                    }
                    if (!utils_1.isHexString(privateKey)) {
                        throw new Error("Expected parameter privateKey to be a hex-encoded string");
                    }
                    if (typeof entry !== "object" || entry === null) {
                        throw new Error("Expected parameter entry to be an object");
                    }
                    // Assert the input is 64 bits.
                    utils_1.assertUint64(entry.revision);
                    opts = __assign(__assign(__assign({}, defaultSetEntryOptions), this.customOptions), customOptions);
                    privateKeyBuffer = buffer_1.Buffer.from(privateKey, "hex");
                    signature = node_forge_1.pki.ed25519.sign({
                        message: crypto_1.hashRegistryEntry(entry),
                        privateKey: privateKeyBuffer
                    });
                    publicKeyBuffer = node_forge_1.pki.ed25519.publicKeyFromPrivateKey({ privateKey: privateKeyBuffer });
                    data = {
                        publickey: {
                            algorithm: "ed25519",
                            key: Array.from(publicKeyBuffer)
                        },
                        datakey: utils_1.toHexString(crypto_1.hashDataKey(entry.datakey)),
                        // Set the revision as a string here since the value may be up to 64 bits.
                        // We remove the quotes later in transformRequest.
                        revision: entry.revision.toString(),
                        data: Array.from(buffer_1.Buffer.from(entry.data)),
                        signature: Array.from(signature)
                    };
                    return [4 /*yield*/, this.executeRequest(__assign(__assign({}, opts), { method: "post", data: data, 
                            // Transform the request to remove quotes, since the revision needs to be
                            // parsed as a uint64 on the Go side.
                            transformRequest: function (data) {
                                // Convert the object data to JSON.
                                var json = JSON.stringify(data);
                                // Change the revision value from a string to a JSON integer.
                                return json.replace(regexRevisionWithQuotes, '"revision":$1');
                            } }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.setEntry = setEntry;
