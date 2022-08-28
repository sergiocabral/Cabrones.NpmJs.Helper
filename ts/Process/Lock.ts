import { LockState } from './LockState';
import { InvalidArgumentError } from '../Error/InvalidArgumentError';
import { ShouldNeverHappenError } from '../Error/ShouldNeverHappenError';

/**
 * Dados do Lock.
 */
class LockStateData {
  /**
   * Construtor.
   * @param identifier Identificador do Lock
   * @param state Estado do Lock.
   */
  public constructor(
    public readonly identifier: string,
    public state: LockState
  ) {}
}

/**
 * Atividades de bloqueio de execução paralela
 */
export class Lock {
  /**
   * Valor padrão para o tempo de expiração para o lock existir.
   */
  private static defaultExpirationInMillisecondsValue: number | undefined;

  /**
   * Valor padrão para o tempo de expiração para o lock existir.
   */
  public static get defaultExpirationInMilliseconds(): number | undefined {
    return Lock.defaultExpirationInMillisecondsValue;
  }

  /**
   * Valor padrão para o tempo de expiração para o lock existir.
   */
  public static set defaultExpirationInMilliseconds(value: number | undefined) {
    Lock.defaultExpirationInMillisecondsValue =
      Lock.validateNumberGreaterThenZero(value);
  }

  /**
   * Intervalo PADRÃO para verificação de liberação do lock.
   */
  private static defaultCheckIntervalInMillisecondsValue = 1;

  /**
   * Valor padrão para o tempo de expiração para o lock existir.
   */
  public static get defaultCheckIntervalInMilliseconds(): number {
    return Lock.defaultCheckIntervalInMillisecondsValue;
  }

  /**
   * Valor padrão para o tempo de expiração para o lock existir.
   */
  public static set defaultCheckIntervalInMilliseconds(value: number) {
    Lock.defaultCheckIntervalInMillisecondsValue =
      Lock.validateNumberGreaterThenZero(value);
  }

  /**
   * Se número for informado deve ser maior que zero.
   */
  private static validateNumberGreaterThenZero<TResult>(
    value: TResult
  ): TResult {
    if (typeof value === 'number' && value <= 0) {
      throw new InvalidArgumentError('Expected value number greater than 0.');
    }
    return value;
  }

  /**
   * Garante que uma função será uma Promise.
   * @param callback Função de callback.
   */
  private static promisify(
    callback: () => void | Promise<void>
  ): () => Promise<void> {
    return callback.constructor === Promise
      ? callback
      : () =>
          new Promise<void>((resolve, reject) => {
            try {
              void callback();
              resolve();
            } catch (error) {
              reject(error);
            }
          });
  }

  /**
   * Construtor.
   * @param defaultExpirationInMilliseconds Valor padrão para o intervalo para verificação de liberação do lock.
   * @param defaultCheckIntervalInMilliseconds Valor padrão para o tempo de expiração para o lock existir.
   */
  public constructor(
    defaultExpirationInMilliseconds:
      | number
      | undefined = Lock.defaultExpirationInMilliseconds,
    defaultCheckIntervalInMilliseconds: number = Lock.defaultCheckIntervalInMilliseconds
  ) {
    this.defaultExpirationInMilliseconds = Lock.validateNumberGreaterThenZero(
      defaultExpirationInMilliseconds
    );
    this.defaultCheckIntervalInMilliseconds =
      Lock.validateNumberGreaterThenZero(defaultCheckIntervalInMilliseconds);
  }

  /**
   * Valor padrão para o tempo de expiração para o lock existir.
   */
  private defaultExpirationInMillisecondsValue: number | undefined;

  /**
   * Valor padrão para o tempo de expiração para o lock existir.
   */
  public get defaultExpirationInMilliseconds(): number | undefined {
    return this.defaultExpirationInMillisecondsValue;
  }

  /**
   * Valor padrão para o tempo de expiração para o lock existir.
   */
  public set defaultExpirationInMilliseconds(value: number | undefined) {
    this.defaultExpirationInMillisecondsValue =
      Lock.validateNumberGreaterThenZero(value);
  }

  /**
   * Valor padrão para o tempo de expiração para o lock existir.
   */
  private defaultCheckIntervalInMillisecondsValue = 1;

  /**
   * Valor padrão para o tempo de expiração para o lock existir.
   */
  public get defaultCheckIntervalInMilliseconds(): number {
    return this.defaultCheckIntervalInMillisecondsValue;
  }

  /**
   * Valor padrão para o tempo de expiração para o lock existir.
   */
  public set defaultCheckIntervalInMilliseconds(value: number) {
    this.defaultCheckIntervalInMillisecondsValue =
      Lock.validateNumberGreaterThenZero(value);
  }

  /**
   * Identificadores de locks ativos
   */
  private locks: Map<string, LockStateData> = new Map<string, LockStateData>();

  /**
   * Define um lock.
   * @param lock Informações do Lock.
   */
  private async set(lock: LockStateData): Promise<boolean> {
    this.locks.set(lock.identifier, lock);
    return new Promise<boolean>(resolve =>
      setImmediate(() => resolve(this.get(lock) === lock))
    );
  }

  /**
   * Retorna os dados do lock.
   * @param lock Identificador do lock.
   */
  private get(lock: string | LockStateData): LockStateData {
    lock = typeof lock === 'string' ? lock : lock.identifier;
    return this.locks.get(lock) ?? new LockStateData(lock, LockState.Undefined);
  }

  /**
   * Retorna o estado do lock.
   * @param identifier Identificador do lock.
   */
  public getState(identifier: string): LockState {
    return this.get(identifier).state;
  }

  /**
   * Cancela um lock.
   * @param identifier Identificador do lock.
   * @return true se havia algum lock para ser cancelado.
   */
  public cancel(identifier: string): boolean {
    const lockState = this.get(identifier);
    if (lockState.state === LockState.Locked) {
      lockState.state = LockState.Canceled;
      return true;
    }
    return false;
  }

  /**
   * Executa algo quando o lock estiver liberado.
   * @param identifier Identificador de lock
   * @param callback Executa apenas quando o lock for liberado.
   * @param expirationInMilliseconds Tempo de expiração para o lock existir.
   * @param checkIntervalInMilliseconds Intervalo para verificação de liberação do lock.
   */
  public async run(
    identifier: string,
    callback: () => Promise<void> | void,
    expirationInMilliseconds?: number,
    checkIntervalInMilliseconds?: number
  ): Promise<LockState> {
    expirationInMilliseconds = Lock.validateNumberGreaterThenZero(
      expirationInMilliseconds ?? this.defaultExpirationInMilliseconds
    );

    checkIntervalInMilliseconds = Lock.validateNumberGreaterThenZero(
      checkIntervalInMilliseconds ?? this.defaultCheckIntervalInMilliseconds
    );

    const callbackAsPromise = Lock.promisify(callback);

    let amIExpired = false;
    let expiredTimeout: NodeJS.Timeout | undefined;
    if (expirationInMilliseconds !== undefined) {
      expiredTimeout = setTimeout(
        () => (amIExpired = true),
        expirationInMilliseconds
      );
    }

    const myLock = new LockStateData(identifier, LockState.Locked);

    return new Promise<LockState>((resolve, reject) => {
      let waitForUnlockTimeout: NodeJS.Timeout | undefined;
      const waitForUnlock = () => {
        const currentLock = this.get(identifier);

        if (amIExpired) {
          resolve((myLock.state = LockState.Expired));
        } else if (myLock.state === LockState.Canceled) {
          clearTimeout(expiredTimeout);
          resolve(myLock.state);
        } else if (currentLock.state === LockState.Locked) {
          waitForUnlockTimeout = setTimeout(
            waitForUnlock,
            checkIntervalInMilliseconds
          );
        } else if (myLock.state === LockState.Locked) {
          this.set(myLock)
            .then(locked => {
              if (locked) {
                callbackAsPromise()
                  .then(() => {
                    clearTimeout(expiredTimeout);
                    clearTimeout(waitForUnlockTimeout);
                    resolve((myLock.state = LockState.Unlocked));
                  })
                  .catch(reject);
              }
              waitForUnlockTimeout = setTimeout(
                waitForUnlock,
                checkIntervalInMilliseconds
              );
            })
            .catch(() => reject(new ShouldNeverHappenError()));
        }
      };
      waitForUnlock();
    });
  }

  /**
   * Espera o lock estar liberado.
   * @param identifier Identificador de lock
   * @param expirationInMilliseconds Tempo de expiração para o lock existir.
   * @param checkIntervalInMilliseconds Intervalo para verificação de liberação do lock.
   */
  public async wait(
    identifier: string,
    expirationInMilliseconds?: number,
    checkIntervalInMilliseconds?: number
  ): Promise<LockState> {
    return this.run(
      identifier,
      () => {
        // Nothing to do.
      },
      expirationInMilliseconds,
      checkIntervalInMilliseconds
    );
  }
}
