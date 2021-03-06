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
exports.genKeyPairFromSeed = exports.genKeyPairAndSeed = exports.deriveChildSeed = exports.encodeBigintAsUint64 = exports.hashRegistryEntry = exports.hashDataKey = exports.hashAll = void 0;
var node_forge_1 = require("node-forge");
var blakejs_1 = __importDefault(require("blakejs"));
var utils_1 = require("./utils");
var randombytes_1 = __importDefault(require("randombytes"));
/**
 * Returns a blake2b 256bit hasher. See `NewHash` in Sia.
 *
 * @returns - blake2b 256bit hasher.
 */
function newHash() {
    return blakejs_1["default"].blake2bInit(32, null);
}
/**
 * Takes all given arguments and hashes them.
 *
 * @param args - Byte arrays to hash.
 * @returns - The final hash as a byte array.
 */
function hashAll() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var hasher = newHash();
    for (var i = 0; i < args.length; i++) {
        blakejs_1["default"].blake2bUpdate(hasher, args[i]);
    }
    return blakejs_1["default"].blake2bFinal(hasher);
}
exports.hashAll = hashAll;
/**
 * Hash the given data key.
 *
 * @param datakey - Datakey to hash.
 * @returns - Hash of the datakey.
 */
function hashDataKey(datakey) {
    return hashAll(encodeString(datakey));
}
exports.hashDataKey = hashDataKey;
/**
 * Hashes the given registry entry.
 *
 * @param registryEntry - Registry entry to hash.
 * @returns - Hash of the registry entry.
 */
function hashRegistryEntry(registryEntry) {
    return hashAll(hashDataKey(registryEntry.datakey), encodeString(registryEntry.data), encodeBigintAsUint64(registryEntry.revision));
}
exports.hashRegistryEntry = hashRegistryEntry;
/**
 * Converts the given number into a uint8 array
 *
 * @param num - Number to encode.
 * @returns - Number encoded as a byte array.
 */
function encodeNumber(num) {
    var encoded = new Uint8Array(8);
    for (var index = 0; index < encoded.length; index++) {
        var byte = num & 0xff;
        encoded[index] = byte;
        num = num >> 8;
    }
    return encoded;
}
/**
 * Converts the given bigint into a uint8 array.
 *
 * @param int - Bigint to encode.
 * @returns - Bigint encoded as a byte array.
 * @throws - Will throw if the int does not fit in 64 bits.
 */
function encodeBigintAsUint64(int) {
    // Assert the input is 64 bits.
    utils_1.assertUint64(int);
    var encoded = new Uint8Array(8);
    for (var index = 0; index < encoded.length; index++) {
        var byte = int & BigInt(0xff);
        encoded[index] = Number(byte);
        int = int >> BigInt(8);
    }
    return encoded;
}
exports.encodeBigintAsUint64 = encodeBigintAsUint64;
/**
 * Converts the given string into a uint8 array.
 *
 * @param str - String to encode.
 * @returns - String encoded as a byte array.
 */
function encodeString(str) {
    var encoded = new Uint8Array(8 + str.length);
    encoded.set(encodeNumber(str.length));
    encoded.set(utils_1.stringToUint8Array(str), 8);
    return encoded;
}
/**
 * Derives a child seed from the given master seed and sub seed.
 *
 * @param masterSeed - The master seed to derive from.
 * @param seed - The sub seed for the derivation.
 * @returns - The child seed derived from `masterSeed` using `seed`.
 * @throws - Will throw if the inputs are not strings.
 */
function deriveChildSeed(masterSeed, seed) {
    /* istanbul ignore next */
    if (typeof masterSeed !== "string") {
        throw new Error("Expected parameter masterSeed to be type string, was type " + typeof masterSeed);
    }
    /* istanbul ignore next */
    if (typeof seed !== "string") {
        throw new Error("Expected parameter seed to be type string, was type " + typeof seed);
    }
    return utils_1.toHexString(hashAll(encodeString(masterSeed), encodeString(seed)));
}
exports.deriveChildSeed = deriveChildSeed;
/**
 * Generates a master key pair and seed.
 *
 * @param [length=64] - The number of random bytes for the seed. Note that the string seed will be converted to hex representation, making it twice this length.
 * @returns - The generated key pair and seed.
 */
function genKeyPairAndSeed(length) {
    if (length === void 0) { length = 64; }
    var seed = makeSeed(length);
    return __assign(__assign({}, genKeyPairFromSeed(seed)), { seed: seed });
}
exports.genKeyPairAndSeed = genKeyPairAndSeed;
/**
 * Generates a public and private key from a provided, secure seed.
 *
 * @param seed - A secure seed.
 * @returns - The generated key pair.
 * @throws - Will throw if the input is not a string.
 */
function genKeyPairFromSeed(seed) {
    /* istanbul ignore next */
    if (typeof seed !== "string") {
        throw new Error("Expected parameter seed to be type string, was type " + typeof seed);
    }
    // Get a 32-byte seed.
    seed = node_forge_1.pkcs5.pbkdf2(seed, "", 1000, 32, node_forge_1.md.sha256.create());
    var _a = node_forge_1.pki.ed25519.generateKeyPair({ seed: seed }), publicKey = _a.publicKey, privateKey = _a.privateKey;
    return { publicKey: utils_1.toHexString(publicKey), privateKey: utils_1.toHexString(privateKey) };
}
exports.genKeyPairFromSeed = genKeyPairFromSeed;
/**
 * Generates a random seed of the given length in bytes.
 *
 * @param length - Length of the seed in bytes.
 * @returns - The generated seed.
 */
function makeSeed(length) {
    // Cryptographically-secure random number generator. It should use the
    // built-in crypto.getRandomValues in the browser.
    var array = randombytes_1["default"](length);
    return utils_1.toHexString(array);
}
