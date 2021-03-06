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
exports.setJSON = exports.getJSON = void 0;
var node_forge_1 = require("node-forge");
var utils_1 = require("./utils");
var buffer_1 = require("buffer");
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
function getJSON(publicKey, dataKey, customOptions) {
    return __awaiter(this, void 0, void 0, function () {
        var opts, entry, skylink, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    opts = __assign(__assign({}, this.customOptions), customOptions);
                    return [4 /*yield*/, this.registry.getEntry(publicKey, dataKey, opts)];
                case 1:
                    entry = (_a.sent()).entry;
                    if (entry === null) {
                        return [2 /*return*/, { data: null, revision: null }];
                    }
                    skylink = entry.data;
                    return [4 /*yield*/, this.getFileContent(skylink, opts)];
                case 2:
                    data = (_a.sent()).data;
                    if (typeof data !== "object" || data === null) {
                        throw new Error("File data for the entry at data key '" + dataKey + "' is not JSON.");
                    }
                    return [2 /*return*/, { data: data, revision: entry.revision }];
            }
        });
    });
}
exports.getJSON = getJSON;
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
function setJSON(privateKey, dataKey, json, revision, customOptions) {
    return __awaiter(this, void 0, void 0, function () {
        var opts, privateKeyBuffer, publicKey, entry_1, file, skylink, entry;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    /* istanbul ignore next */
                    if (typeof privateKey !== "string") {
                        throw new Error("Expected parameter privateKey to be type string, was type " + typeof privateKey);
                    }
                    /* istanbul ignore next */
                    if (typeof dataKey !== "string") {
                        throw new Error("Expected parameter dataKey to be type string, was type " + typeof dataKey);
                    }
                    if (!utils_1.isHexString(privateKey)) {
                        throw new Error("Expected parameter privateKey to be a hex-encoded string");
                    }
                    if (typeof json !== "object" || json === null) {
                        throw new Error("Expected parameter json to be an object");
                    }
                    opts = __assign(__assign({}, this.customOptions), customOptions);
                    privateKeyBuffer = buffer_1.Buffer.from(privateKey, "hex");
                    if (!(revision === undefined)) return [3 /*break*/, 2];
                    publicKey = node_forge_1.pki.ed25519.publicKeyFromPrivateKey({ privateKey: privateKeyBuffer });
                    return [4 /*yield*/, this.registry.getEntry(utils_1.toHexString(publicKey), dataKey, opts)];
                case 1:
                    entry_1 = _a.sent();
                    if (entry_1.entry === null) {
                        revision = BigInt(0);
                    }
                    else {
                        revision = entry_1.entry.revision + BigInt(1);
                    }
                    // Throw if the revision is already the maximum value.
                    if (revision > utils_1.MAX_REVISION) {
                        throw new Error("Current entry already has maximum allowed revision, could not update the entry");
                    }
                    return [3 /*break*/, 3];
                case 2:
                    // Assert the input is 64 bits.
                    utils_1.assertUint64(revision);
                    _a.label = 3;
                case 3:
                    file = buffer_1.Buffer.from(JSON.stringify(json));
                    return [4 /*yield*/, this.uploadFile(file, __assign(__assign({}, opts), { customFilename: dataKey }))];
                case 4:
                    skylink = (_a.sent()).skylink;
                    entry = {
                        datakey: dataKey,
                        data: utils_1.trimUriPrefix(skylink, utils_1.uriSkynetPrefix),
                        revision: revision
                    };
                    // Update the registry.
                    return [4 /*yield*/, this.registry.setEntry(privateKey, entry)];
                case 5:
                    // Update the registry.
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.setJSON = setJSON;
