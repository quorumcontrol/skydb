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
exports.SkyDb = void 0;
var axios_1 = __importDefault(require("axios"));
var utils_1 = require("./utils");
var upload_1 = require("./upload");
var download_1 = require("./download");
var registry_1 = require("./registry");
var skydb_1 = require("./skydb");
var SkyDb = /** @class */ (function () {
    /**
     * The Skynet Client which can be used to access Skynet.
     *
     * @class
     * @param [portalUrl] The portal URL to use to access Skynet, if specified. To use the default portal while passing custom options, use ""
     * @param [customOptions] Configuration for the client.
     */
    function SkyDb(portalUrl, customOptions) {
        if (portalUrl === void 0) { portalUrl = utils_1.defaultPortalUrl(); }
        if (customOptions === void 0) { customOptions = {}; }
        this.uploadFile = upload_1.uploadFile;
        this.getSkylinkUrl = download_1.getSkylinkUrl;
        this.getFileContentRequest = download_1.getFileContentRequest;
        this.getFileContent = download_1.getFileContent;
        // SkyDB helpers
        this.registry = {
            getEntry: registry_1.getEntry.bind(this),
            getEntryUrl: registry_1.getEntryUrl.bind(this),
            setEntry: registry_1.setEntry.bind(this)
        };
        // SkyDB
        this.db = {
            getJSON: skydb_1.getJSON.bind(this),
            setJSON: skydb_1.setJSON.bind(this)
        };
        this.portalUrl = portalUrl;
        this.customOptions = customOptions;
    }
    /**
     * Creates and executes a request.
     *
     * @param config - Configuration for the request.
     * @returns - The response from axios.
     * @throws - Will throw if unimplemented options have been passed in.
     */
    SkyDb.prototype.executeRequest = function (config) {
        var _a, _b;
        if (config.skykeyName || config.skykeyId) {
            throw new Error("Unimplemented: skykeys have not been implemented in this SDK");
        }
        // Build the URL.
        var url = config.url;
        if (!url) {
            url = utils_1.makeUrl(this.portalUrl, config.endpointPath, (_a = config.extraPath) !== null && _a !== void 0 ? _a : "");
        }
        if (config.query) {
            url = utils_1.addUrlQuery(url, config.query);
        }
        var formHeaders = {};
        if ((_b = config.data) === null || _b === void 0 ? void 0 : _b.getHeaders) {
            formHeaders = config.data.getHeaders();
        }
        // Build headers.
        var headers = __assign(__assign({}, config.headers), formHeaders);
        if (config.customUserAgent) {
            headers["User-Agent"] = config.customUserAgent;
        }
        var auth = config.APIKey
            ? { username: "", password: config.APIKey }
            : undefined;
        /* istanbul ignore next */
        var onUploadProgress = config.onUploadProgress &&
            function (event) {
                var progress = event.loaded / event.total;
                // Need the if-statement or TS complains.
                if (config.onUploadProgress)
                    config.onUploadProgress(progress, event);
            };
        return axios_1["default"]({
            url: url,
            method: config.method,
            data: config.data,
            headers: headers,
            auth: auth,
            onUploadProgress: onUploadProgress,
            transformRequest: config.transformRequest,
            transformResponse: config.transformResponse,
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });
    };
    return SkyDb;
}());
exports.SkyDb = SkyDb;
