import { HelperObject } from '../Data/HelperObject';
import { HelperCryptography } from '../Cryptography/HelperCryptography';

/**
 * Representa um conjunto de informações para JsonObject.
 */
interface IHashJsonData<TValue> {
  /**
   * Data de expiração da informação.
   */
  expirationTime: number | undefined;

  /**
   * Chave que referencia o valor.
   */
  key: unknown;

  /**
   * Valor armazenado.
   */
  value: TValue;
}

/**
 * Associa objetos (baseado em JSON.stringify) a valores.
 */
export class HashJson<TValue> {
  /**
   * Resulta em um hash da informação.
   */
  private static hash(value: unknown): string {
    return HelperCryptography.hashSha256(HelperObject.toText(value, 0));
  }

  /**
   * Lista de chave e valor.
   */
  private list: Array<IHashJsonData<TValue>> = [];

  /**
   * Construtor.
   * @param defaultExpirationInMilliseconds Tempo padrão usado como valor de expiração quando não informado.
   */
  public constructor(public defaultExpirationInMilliseconds?: number) {}

  /**
   * Retorna o valor associado a um objeto.
   * @param object Objeto usado como chave (key) na associação.
   */
  public get(object: unknown): TValue | undefined {
    this.discardExpired();
    const key = HashJson.hash(object);

    return this.list.find(data => data.key === key)?.value;
  }

  /**
   * Atribui um valor a um objeto.
   * @param object Objeto usado como chave (key) na associação.
   * @param value Valor associado.
   * @param expirationInMilliseconds Quando informado, a informação é apagada depois de um tempo.
   */
  public set(
    object: unknown,
    value: TValue,
    expirationInMilliseconds?: number
  ): void {
    this.discardExpired();

    expirationInMilliseconds =
      expirationInMilliseconds ?? this.defaultExpirationInMilliseconds;

    const key = HashJson.hash(object);
    const data: IHashJsonData<TValue> = {
      expirationTime:
        expirationInMilliseconds !== undefined
          ? new Date().getTime() + expirationInMilliseconds
          : undefined,
      key,
      value
    };

    const existingIndex = this.list.findIndex(d => d.key === key);
    if (existingIndex < 0) {
      this.list.push(data);
    } else {
      this.list[existingIndex] = data;
    }
  }

  /**
   * Remove os itens expirados.
   */
  private discardExpired(): void {
    const now = new Date().getTime();
    for (let index = this.list.length - 1; index >= 0; index -= 1) {
      const data = this.list[index];
      const expired =
        data.expirationTime !== undefined && data.expirationTime <= now;
      if (expired) {
        this.list.splice(index, 1);
      }
    }
  }
}
