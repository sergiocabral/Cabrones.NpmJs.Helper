import crypto from 'crypto';
import { HelperObject } from '../Data/HelperObject';
import { HashAlgorithm } from './HashAlgorithm';
import { CipherAlgorithm } from './CipherAlgorithm';
import { CryptographyDirection } from './CryptographyDirection';
import { Json } from '../Type/Data/Json';
import { PrimitiveValueType } from '../Type/Native/PrimitiveValueType';
import { NotImplementedError } from '../Error/NotImplementedError';
import { JsonValue } from '../Type/Data/JsonValue';

// TODO: Teste de cobertura para propriedades estáticas e função Json

/**
 * Funcionalidades para uso em criptografia.
 */
export class HelperCryptography {
  /**
   * Algoritmo padrão.
   */
  public static defaultSymmetricAlgorithm: CipherAlgorithm = 'aes-256-cbc';

  /**
   * Algoritmo padrão.
   */
  public static defaultSymmetricAlgorithmKeyLengthInBytes = 32;

  /**
   * Vetor de inicialização.
   */
  public static defaultInitializationVector = Buffer.alloc(16, 0);

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

  /**
   * Des/criptografa o JSON.
   * @param mode Direção da criptografia
   * @param json JSON.
   * @param password Senha utilizada.
   * @param needToApplyEncryption Valida se é necessário aplicar criptografia.
   */
  public static json(
    mode: CryptographyDirection,
    json: Json,
    password: string,
    needToApplyEncryption?: (
      keyPath: string,
      keyValue: PrimitiveValueType | null
    ) => boolean
  ): Json {
    const crypt = (
      keyPath: string,
      value: PrimitiveValueType | null
    ): PrimitiveValueType | null => {
      const keyFromPassword = crypto.scryptSync(
        password,
        keyPath,
        HelperCryptography.defaultSymmetricAlgorithmKeyLengthInBytes
      );

      let cipherDecipher: crypto.Cipher | crypto.Decipher;

      switch (mode) {
        case CryptographyDirection.Encrypt:
          cipherDecipher = crypto.createCipheriv(
            HelperCryptography.defaultSymmetricAlgorithm,
            keyFromPassword,
            HelperCryptography.defaultInitializationVector
          );
          return (
            cipherDecipher
              .update(JSON.stringify(value), 'utf8', 'base64')
              .toString() + cipherDecipher.final('base64').toString()
          );
        case CryptographyDirection.Decrypt:
          try {
            cipherDecipher = crypto.createDecipheriv(
              HelperCryptography.defaultSymmetricAlgorithm,
              keyFromPassword,
              HelperCryptography.defaultInitializationVector
            );
            return JSON.parse(
              cipherDecipher
                .update(String(value), 'base64', 'utf8')
                .toString() + cipherDecipher.final('utf8').toString()
            ) as PrimitiveValueType | null;
          } catch (error) {
            return value;
          }
        default:
          throw new NotImplementedError(`Invalid mode.`);
      }
    };

    const iterate = (jsonPart: Json, baseKeyPath = ''): Json => {
      for (const keyName in jsonPart) {
        const keyPath = `${baseKeyPath}.${keyName}`.replace(/^\./, '');
        const jsonEntry = jsonPart as Record<string, JsonValue>;
        const keyValue = jsonEntry[keyName];
        if (
          typeof keyValue === 'string' ||
          typeof keyValue === 'number' ||
          typeof keyValue === 'boolean'
        ) {
          if (
            needToApplyEncryption === undefined ||
            needToApplyEncryption(keyPath, keyValue)
          ) {
            jsonEntry[keyName] = crypt(keyPath, keyValue);
          }
        } else {
          iterate(keyValue as Json, keyPath);
        }
      }
      return jsonPart;
    };

    return iterate(JSON.parse(HelperObject.toText(json, 0)) as Json);
  }
}
