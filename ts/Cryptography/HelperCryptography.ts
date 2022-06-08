import crypto from 'crypto';
import { HelperObject } from '../Data/HelperObject';
import { HashAlgorithm } from './HashAlgorithm';

/**
 * Funcionalidades para uso em criptografia.
 */
export class HelperCryptography {
  public static toBuffer(input: unknown): Buffer {
    return input instanceof Buffer
      ? input
      : typeof input === 'string' ||
        typeof input === 'number' ||
        typeof input === 'boolean' ||
        input === null ||
        input === undefined
      ? Buffer.from(String(input))
      : input instanceof Date
      ? Buffer.from(input.toISOString())
      : Buffer.from(HelperObject.toText(input, 0));
  }

  /**
   * Função de hash.
   * @param input Conteúdo de entrada.
   * @param algorithm Algoritmos de hash. Por padrão SHA256
   */
  public static hash(
    input: unknown,
    algorithm: HashAlgorithm = 'sha256'
  ): string {
    return crypto
      .createHash(algorithm)
      .update(HelperCryptography.toBuffer(input))
      .digest()
      .toString('hex');
  }
}
