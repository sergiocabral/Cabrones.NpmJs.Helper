import { LockState } from './LockState';
import { EmptyError } from '../Error/EmptyError';
import { InvalidArgumentError } from '../Error/InvalidArgumentError';
import { InvalidExecutionError } from '../Error/InvalidExecutionError';

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
   * Momento da última atualização do estado.
   */
  private updatedValue: number = performance.now();

  /**
   * Momento da última atualização do estado.
   */
  public get updated(): number {
    return this.updatedValue;
  }

  /**
   * Estado do lock.
   */
  private stateValue: LockState = LockState.Locked;

  /**
   * Estado do lock.
   */
  public get state(): LockState {
    return this.stateValue;
  }

  /**
   * Estado do lock.
   */
  public set state(value: LockState) {
    this.stateValue = value;
    this.updatedValue = performance.now();
  }

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
   * Sinaliza se já foi executado o callback.
   */
  public executedValue = false;

  /**
   * Sinaliza se já foi executado o callback.
   */
  public get executed(): boolean {
    return this.executedValue;
  }

  /**
   * Sinaliza se já foi executado o callback.
   */
  public set executed(value: boolean) {
    if (this.executedValue) {
      throw new InvalidExecutionError('Value already defined.');
    }
    if (!value) {
      throw new InvalidArgumentError('Only true is accepted.');
    }
    this.executedValue = value;
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
