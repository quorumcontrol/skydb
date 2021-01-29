"use strict";
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
var chai_1 = require("chai");
require("mocha");
var client_1 = require("./client");
var crypto_1 = require("./crypto");
describe('Client', function () {
    var cli;
    var hiSkyUrl = 'sia:AAD6lqdEIKKvRXXg_AjEOCUFHW7oKpatxL53y0BSeIyJWg';
    beforeEach(function () {
        cli = new client_1.SkyDb();
        chai_1.expect(cli).to.not.be.undefined;
    });
    it('uploads', function () { return __awaiter(void 0, void 0, void 0, function () {
        var bits, resp, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bits = Buffer.from('hi');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, cli.uploadFile(bits)];
                case 2:
                    resp = _a.sent();
                    chai_1.expect(resp.skylink).to.equal(hiSkyUrl);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.error(err_1);
                    throw err_1;
                case 4: return [2 /*return*/];
            }
        });
    }); });
    it('downloads', function () { return __awaiter(void 0, void 0, void 0, function () {
        var resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cli.getFileContent(hiSkyUrl)];
                case 1:
                    resp = _a.sent();
                    chai_1.expect(resp.data).to.equal('hi');
                    return [2 /*return*/];
            }
        });
    }); });
    it('does registry', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, privateKey, publicKey, ret;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = crypto_1.genKeyPairAndSeed(), privateKey = _a.privateKey, publicKey = _a.publicKey;
                    return [4 /*yield*/, cli.registry.setEntry(privateKey, {
                            datakey: "helloworld",
                            data: hiSkyUrl,
                            revision: BigInt(0)
                        })];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, cli.registry.getEntry(publicKey, 'helloworld')];
                case 2:
                    ret = _c.sent();
                    chai_1.expect((_b = ret.entry) === null || _b === void 0 ? void 0 : _b.data).to.equal(hiSkyUrl);
                    return [2 /*return*/];
            }
        });
    }); });
    it('does skydb', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, privateKey, publicKey, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = crypto_1.genKeyPairAndSeed(), privateKey = _a.privateKey, publicKey = _a.publicKey;
                    return [4 /*yield*/, cli.db.setJSON(privateKey, 'hello', { bob: 'iscool' })];
                case 1:
                    _c.sent();
                    _b = chai_1.expect;
                    return [4 /*yield*/, cli.db.getJSON(publicKey, 'hello')];
                case 2:
                    _b.apply(void 0, [(_c.sent()).data]).to.have.property('bob', 'iscool');
                    return [2 /*return*/];
            }
        });
    }); });
});
