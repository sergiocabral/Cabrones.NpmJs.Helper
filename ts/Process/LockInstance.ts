import { HelperText } from '../Data/HelperText';
import { LockState } from './LockState';
import { EmptyError } from '../Error/EmptyError';

/**
 * Instância de lock.
 */
export class LockInstance {
  /**
   * Construtor.
   * @param name Nome do lock.
   * @param expirationInMilliseconds Tempo de expiração para o lock existir
   * @param onExpired Disparado quando expirado.
   */
  public constructor(
    public readonly name: string,
    expirationInMilliseconds: undefined | number,
    onExpired: undefined | ((instance: LockInstance) => void)
  ) {
    if (expirationInMilliseconds !== undefined && onExpired !== undefined) {
      this.expiredTimeout = setTimeout(
        () => onExpired(this.clone()),
        expirationInMilliseconds
      );
    }
  }

  /**
   * Timeout do tempo de expiração.
   */
  private readonly expiredTimeout?: NodeJS.Timeout;

  /**
   * Identificador único para essa instância de lock.
   */
  public readonly id: string = HelperText.random(40);

  /**
   * Estado do lock.
   */
  public state: LockState = LockState.Locked;

  /**
   * Ordem (tipo index) na lista de locks de mesmo nome.
   */
  public indexValue?: number;

  /**
   * Ordem (tipo index) na lista de locks de mesmo nome.
   */
  public get index(): number {
    if (this.indexValue === undefined) {
      throw new EmptyError('Order not defined.');
    }
    return this.indexValue;
  }

  /**
   * Ordem (tipo index) na lista de locks de mesmo nome.
   */
  public set index(value: number) {
    if (this.indexValue !== undefined) {
      throw new EmptyError('Order already defined.');
    }
    this.indexValue = value;
  }

  /**
   * Cone desta instância.
   */
  public clone(): LockInstance {
    const clone = new LockInstance(this.name, undefined, undefined);
    return Object.assign(
      clone,
      JSON.parse(JSON.stringify(this)) as LockInstance
    );
  }

  /**
   * Libera os recursos do lock.
   */
  public dispose(): void {
    clearTimeout(this.expiredTimeout);
  }
}
