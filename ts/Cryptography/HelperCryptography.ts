import { InvalidArgumentError } from '../Error/InvalidArgumentError';

const cache: Record<string, number[]> = {};

function rightRotate(value: number, amount: number): number {
  return (value >>> amount) | (value << (32 - amount));
}

export class HelperCryptography {
  /**
   * Função obtida em https://geraintluff.github.io/sha256/
   * Mas foi adaptada de JavaScript para TypeScript.
   * @param ascii Texto de entrada.
   */
  public static hashSha256(ascii: string): string {
    const maxWord = Math.pow(2, 32);
    let result = '';

    const words: number[] = [];
    const asciiBitLength = ascii.length * 8;

    // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
    // (we actually calculate the first 64, but extra values are just ignored)
    let hash = (cache.hash = cache.hash ?? []);
    // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
    const k = (cache.k = cache.k ?? []);
    let primeCounter = k.length;

    const isComposite: Record<number, number> = {};
    for (let candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (let i = 0; i < 313; i += candidate) {
          isComposite[i] = candidate;
        }
        hash[primeCounter] = (Math.pow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (Math.pow(candidate, 1 / 3) * maxWord) | 0;
      }
    }

    ascii += '\x80'; // Append Ƈ' bit (plus zero padding)
    while ((ascii.length % 64) - 56) {
      ascii += '\x00'; // More zero padding
    }
    for (let i = 0; i < ascii.length; i++) {
      const j = ascii.charCodeAt(i);
      if (j >> 8) {
        throw new InvalidArgumentError(
          'ASCII input expected. Only accept characters in range 0-255.'
        );
      }
      words[i >> 2] |= j << (((3 - i) % 4) * 8);
    }
    words[words.length] = (asciiBitLength / maxWord) | 0;
    words[words.length] = asciiBitLength;

    // process each chunk
    for (let j = 0; j < words.length; ) {
      const w: number[] = words.slice(j, (j += 16)); // The message is expanded into 64 words as part of the iteration
      const oldHash: number[] = hash;
      // This is now the working hash, often labelled as variables a...g
      // we have to truncate as well, otherwise extra entries at the end accumulate
      hash = hash.slice(0, 8);

      for (let i = 0; i < 64; i++) {
        // Expand the message into 64 words
        // Used below if
        const w15: number = w[i - 15];
        const w2: number = w[i - 2];

        // Iterate
        const a: number = hash[0];
        const e: number = hash[4];
        const temp1: number =
          hash[7] +
          (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) + // S1
          ((e & hash[5]) ^ (~e & hash[6])) + // ch
          k[i] +
          // Expand the message schedule if needed
          (w[i] =
            i < 16
              ? w[i]
              : (w[i - 16] +
                  (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) + // s0
                  w[i - 7] +
                  (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) | // s1
                0);
        // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
        const temp2 =
          (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) + // S0
          ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2])); // maj

        hash = [(temp1 + temp2) | 0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
        hash[4] = (hash[4] + temp1) | 0;
      }

      for (let i = 0; i < 8; i++) {
        hash[i] = (hash[i] + oldHash[i]) | 0;
      }
    }

    for (let i = 0; i < 8; i++) {
      for (let j = 3; j + 1; j--) {
        const b = (hash[i] >> (j * 8)) & 255;
        result += (b < 16 ? '0' : '') + b.toString(16);
      }
    }
    return result;
  }
}
