import { pki } from "node-forge";
import { RegistryEntry } from "./registry";
export declare type PublicKey = pki.ed25519.NativeBuffer;
export declare type SecretKey = pki.ed25519.NativeBuffer;
export declare type Signature = pki.ed25519.NativeBuffer;
/**
 * Key pair.
 *
 * @property publicKey - The public key.
 * @property privateKey - The private key.
 */
export declare type KeyPair = {
    publicKey: string;
    privateKey: string;
};
/**
 * Key pair and seed.
 *
 * @property seed - The secure seed.
 */
export declare type KeyPairAndSeed = KeyPair & {
    seed: string;
};
/**
 * Takes all given arguments and hashes them.
 *
 * @param args - Byte arrays to hash.
 * @returns - The final hash as a byte array.
 */
export declare function hashAll(...args: Uint8Array[]): Uint8Array;
/**
 * Hash the given data key.
 *
 * @param datakey - Datakey to hash.
 * @returns - Hash of the datakey.
 */
export declare function hashDataKey(datakey: string): Uint8Array;
/**
 * Hashes the given registry entry.
 *
 * @param registryEntry - Registry entry to hash.
 * @returns - Hash of the registry entry.
 */
export declare function hashRegistryEntry(registryEntry: RegistryEntry): Uint8Array;
/**
 * Converts the given bigint into a uint8 array.
 *
 * @param int - Bigint to encode.
 * @returns - Bigint encoded as a byte array.
 * @throws - Will throw if the int does not fit in 64 bits.
 */
export declare function encodeBigintAsUint64(int: bigint): Uint8Array;
/**
 * Derives a child seed from the given master seed and sub seed.
 *
 * @param masterSeed - The master seed to derive from.
 * @param seed - The sub seed for the derivation.
 * @returns - The child seed derived from `masterSeed` using `seed`.
 * @throws - Will throw if the inputs are not strings.
 */
export declare function deriveChildSeed(masterSeed: string, seed: string): string;
/**
 * Generates a master key pair and seed.
 *
 * @param [length=64] - The number of random bytes for the seed. Note that the string seed will be converted to hex representation, making it twice this length.
 * @returns - The generated key pair and seed.
 */
export declare function genKeyPairAndSeed(length?: number): KeyPairAndSeed;
/**
 * Generates a public and private key from a provided, secure seed.
 *
 * @param seed - A secure seed.
 * @returns - The generated key pair.
 * @throws - Will throw if the input is not a string.
 */
export declare function genKeyPairFromSeed(seed: string): KeyPair;
//# sourceMappingURL=crypto.d.ts.map