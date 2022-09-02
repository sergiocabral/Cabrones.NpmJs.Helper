import { LockState } from './LockState';
import { InvalidArgumentError } from '../Error/InvalidArgumentError';
import { HelperObject } from '../Data/HelperObject';
import { LockInstance } from './LockInstance';
import { LockResult } from './LockResult';
import { HelperNumeric } from '../Data/HelperNumeric';

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
    this.defaultExpirationInMilliseconds = defaultExpirationInMilliseconds;
    this.defaultCheckIntervalInMilliseconds =
      defaultCheckIntervalInMilliseconds;
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
   * Locks utilizados.
   */
  private locks: Record<string, LockInstance[]> = {};

  /**
   * Retorna o estado do lock.
   * @param name Nome do lock.
   */
  public getState(name: string): LockState {
    const instances: LockInstance[] = Array<LockInstance>().concat(
      this.locks[name] ?? []
    );

    const hasLocked =
      instances.findIndex(instance => instance.state === LockState.Locked) >= 0;
    if (hasLocked) {
      return LockState.Locked;
    }

    instances.sort(
      (instance1, instance2) =>
        -HelperNumeric.sortCompare(instance1.updated, instance2.updated)
    );
    return instances.length > 0 ? instances[0].state : LockState.Undefined;
  }

  /**
   * Cancela um lock.
   * @param name Nome do lock.
   * @param mode Modo de cancelamento
   * @return true se havia algum lock para ser cancelado.
   */
  public cancel(name: string, mode: 'all' | 'current' = 'all'): number {
    if (mode !== 'all' && mode !== 'current') {
      throw new InvalidArgumentError('Expected "all" ou "current" mode.');
    }

    const lockInstances = this.locks[name]?.filter(
      lockInstance => lockInstance.state === LockState.Locked
    );

    if (lockInstances?.length > 0) {
      switch (mode) {
        case 'all':
          for (const lockInstance of lockInstances) {
            lockInstance.state = LockState.Canceled;
          }
          return lockInstances.length;
        case 'current':
          lockInstances[0].state = LockState.Canceled;
          return 1;
      }
    }

    return 0;
  }

  /**
   * Executa algo quando o lock estiver liberado.
   * @param name Nome do lock
   * @param callback Executa apenas quando o lock for liberado.
   * @param expirationInMilliseconds Tempo de expiração para o lock existir.
   * @param checkIntervalInMilliseconds Intervalo para verificação de liberação do lock.
   */
  public async run<TCallbackResult = unknown>(
    name: string,
    callback: () => Promise<TCallbackResult> | TCallbackResult,
    expirationInMilliseconds?: number,
    checkIntervalInMilliseconds?: number
  ): Promise<LockResult<TCallbackResult>> {
    expirationInMilliseconds = Lock.validateNumberGreaterThenZero(
      expirationInMilliseconds ?? this.defaultExpirationInMilliseconds
    );

    checkIntervalInMilliseconds = Lock.validateNumberGreaterThenZero(
      checkIntervalInMilliseconds ?? this.defaultCheckIntervalInMilliseconds
    );

    const myLockInstance: LockInstance = new LockInstance(
      name,
      expirationInMilliseconds,
      () => (myLockInstance.state = LockState.Expired)
    );
    myLockInstance.index =
      (this.locks[name] = this.locks[name] ?? []).push(myLockInstance) - 1;

    return new Promise<LockResult<TCallbackResult>>(resolve => {
      let waitForUnlockTimeout: NodeJS.Timeout | undefined;
      const waitForUnlock = () => {
        const currentLock = this.locks[name].find(
          lockInstance => lockInstance.state === LockState.Locked
        );

        if (currentLock === myLockInstance && !myLockInstance.executed) {
          myLockInstance.executed = true;
          HelperObject.promisify(callback)()
            .then(callbackResult => {
              if (myLockInstance.state === LockState.Locked) {
                myLockInstance.state = LockState.Unlocked;
                myLockInstance.dispose();
                clearTimeout(waitForUnlockTimeout);
                resolve({
                  lockState: myLockInstance.state,
                  callbackSuccess: true,
                  callbackResult
                });
              }
            })
            .catch((callbackError: unknown) => {
              if (myLockInstance.state === LockState.Locked) {
                myLockInstance.state = LockState.Unlocked;
                myLockInstance.dispose();
                clearTimeout(waitForUnlockTimeout);
                resolve({
                  lockState: myLockInstance.state,
                  callbackSuccess: false,
                  callbackError
                });
              }
            });
        }

        if (myLockInstance.state !== LockState.Locked) {
          myLockInstance.dispose();
          resolve({
            lockState: myLockInstance.state
          });
          return;
        }

        waitForUnlockTimeout = setTimeout(
          waitForUnlock,
          checkIntervalInMilliseconds
        );
      };
      waitForUnlock();
    });
  }

  // /**
  //  * Espera o lock estar liberado.
  //  * @param identifier Identificador de lock
  //  * @param expirationInMilliseconds Tempo de expiração para o lock existir.
  //  * @param checkIntervalInMilliseconds Intervalo para verificação de liberação do lock.
  //  */
  // public async wait(
  //   identifier: string,
  //   expirationInMilliseconds?: number,
  //   checkIntervalInMilliseconds?: number
  // ): Promise<LockState> {
  //   return this.run(
  //     identifier,
  //     () => {
  //       // Nothing to do.
  //       // TODO: O wait não deve esperar apenas ele mesmo, mas todos os locks na fila
  //     },
  //     expirationInMilliseconds,
  //     checkIntervalInMilliseconds
  //   );
  // }
}
