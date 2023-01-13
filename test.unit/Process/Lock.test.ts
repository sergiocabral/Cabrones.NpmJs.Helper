import { performance } from 'perf_hooks';
import { Lock, InvalidArgumentError, LockState } from '../../ts';

describe('Class Lock', function () {
  const originals: Record<string, any> = {};

  beforeEach(() => {
    originals['Lock.defaultExpirationInMilliseconds'] =
      Lock.defaultExpirationInMilliseconds;
    originals['Lock.defaultCheckIntervalInMilliseconds'] =
      Lock.defaultCheckIntervalInMilliseconds;
  });

  afterEach(() => {
    Lock.defaultExpirationInMilliseconds =
      originals['Lock.defaultExpirationInMilliseconds'];
    Lock.defaultCheckIntervalInMilliseconds =
      originals['Lock.defaultCheckIntervalInMilliseconds'];
  });

  describe('propriedades estáticas', () => {
    describe('defaultExpirationInMilliseconds', () => {
      test('Valor padrão deve ser undefined', () => {
        // Arrange, Given

        const expectedValue = undefined;

        // Act, When

        const receivedValue = Lock.defaultExpirationInMilliseconds;

        // Assert, Then

        expect(receivedValue).toBe(expectedValue);
      });
      test('Apenas aceita undefined ou valores maiores que zero', () => {
        // Arrange, Given

        const values: [boolean, number | undefined][] = [
          [true, undefined],
          [true, 1],
          [true, 100],
          [true, Number.MAX_SAFE_INTEGER],
          [false, 0],
          [false, -1],
          [false, -100],
          [false, Number.MIN_SAFE_INTEGER]
        ];

        for (const set of values) {
          const isValid = set[0];
          const value = set[1];

          // Act, When

          const setValue = () => (Lock.defaultExpirationInMilliseconds = value);

          // Assert, Then

          if (isValid) {
            expect(setValue).not.toThrow();
            expect(Lock.defaultExpirationInMilliseconds).toBe(value);
          } else {
            expect(setValue).toThrow(InvalidArgumentError);
          }
        }
      });
    });
    describe('defaultCheckIntervalInMilliseconds', () => {
      test('Valor padrão deve ser 1', () => {
        // Arrange, Given

        const expectedValue = 1;

        // Act, When

        const receivedValue = Lock.defaultCheckIntervalInMilliseconds;

        // Assert, Then

        expect(receivedValue).toBe(expectedValue);
      });
      test('Apenas aceita valores maiores que zero', () => {
        // Arrange, Given

        const values: [boolean, number][] = [
          [true, 1],
          [true, 100],
          [true, Number.MAX_SAFE_INTEGER],
          [false, 0],
          [false, -1],
          [false, -100],
          [false, Number.MIN_SAFE_INTEGER]
        ];

        for (const set of values) {
          const isValid = set[0];
          const value = set[1];

          // Act, When

          const setValue = () =>
            (Lock.defaultCheckIntervalInMilliseconds = value);

          // Assert, Then

          if (isValid) {
            expect(setValue).not.toThrow();
            expect(Lock.defaultCheckIntervalInMilliseconds).toBe(value);
          } else {
            expect(setValue).toThrow(InvalidArgumentError);
          }
        }
      });
    });
  });
  describe('Testes do construtor', () => {
    describe('parâmetro é opcional e usa o valor da classe estática', () => {
      test('defaultExpirationInMilliseconds', () => {
        // Arrange, Given

        const expectedValue = Math.random();
        Lock.defaultExpirationInMilliseconds = expectedValue;

        // Act, When

        const sut = new Lock();
        const receivedValue = sut.defaultExpirationInMilliseconds;

        // Assert, Then

        expect(receivedValue).toBe(expectedValue);
      });
      test('defaultCheckIntervalInMilliseconds', () => {
        // Arrange, Given

        const expectedValue = Math.random();
        Lock.defaultCheckIntervalInMilliseconds = expectedValue;

        // Act, When

        const sut = new Lock();
        const receivedValue = sut.defaultCheckIntervalInMilliseconds;

        // Assert, Then

        expect(receivedValue).toBe(expectedValue);
      });
    });
    describe('validação de valor maior que zero', () => {
      test('defaultExpirationInMilliseconds', () => {
        // Arrange, Given

        const values: [boolean, number | undefined][] = [
          [true, undefined],
          [true, 1],
          [true, 100],
          [true, Number.MAX_SAFE_INTEGER],
          [false, 0],
          [false, -1],
          [false, -100],
          [false, Number.MIN_SAFE_INTEGER]
        ];

        for (const set of values) {
          const isValid = set[0];
          const value = set[1];

          // Act, When

          const action = () => new Lock(value);

          // Assert, Then

          if (isValid) {
            expect(action).not.toThrow();
          } else {
            expect(action).toThrow(InvalidArgumentError);
          }
        }
      });
      test('defaultCheckIntervalInMilliseconds', () => {
        // Arrange, Given

        const values: [boolean, number][] = [
          [true, 1],
          [true, 100],
          [true, Number.MAX_SAFE_INTEGER],
          [false, 0],
          [false, -1],
          [false, -100],
          [false, Number.MIN_SAFE_INTEGER]
        ];

        for (const set of values) {
          const isValid = set[0];
          const value = set[1];

          // Act, When

          const action = () => new Lock(undefined, value);

          // Assert, Then

          if (isValid) {
            expect(action).not.toThrow();
          } else {
            expect(action).toThrow(InvalidArgumentError);
          }
        }
      });
    });
    describe('parâmetros de entrada devem ser lidos nas respectivas propriedades', () => {
      test('defaultExpirationInMilliseconds', () => {
        // Arrange, Given

        const expectedValue = Math.random();

        // Act, When

        const sut = new Lock(expectedValue);
        const receivedValue = sut.defaultExpirationInMilliseconds;

        // Assert, Then

        expect(receivedValue).toBe(expectedValue);
      });
      test('defaultCheckIntervalInMilliseconds', () => {
        // Arrange, Given

        const expectedValue = Math.random();

        // Act, When

        const sut = new Lock(undefined, expectedValue);
        const receivedValue = sut.defaultCheckIntervalInMilliseconds;

        // Assert, Then

        expect(receivedValue).toBe(expectedValue);
      });
    });
  });
  describe('Teste das propriedades', () => {
    test('defaultExpirationInMilliseconds recebendo valor numérico', () => {
      // Arrange, Given

      const expectedValue = Math.random();
      const sut = new Lock();

      // Act, When

      sut.defaultExpirationInMilliseconds = expectedValue;
      const receivedValue = sut.defaultExpirationInMilliseconds;

      // Assert, Then

      expect(receivedValue).toBe(expectedValue);
    });
    test('defaultExpirationInMilliseconds recebendo valor undefined', () => {
      // Arrange, Given

      const expectedValue = undefined;
      const sut = new Lock();

      // Act, When

      sut.defaultExpirationInMilliseconds = expectedValue;
      const receivedValue = sut.defaultExpirationInMilliseconds;

      // Assert, Then

      expect(receivedValue).toBe(expectedValue);
    });
    test('defaultCheckIntervalInMilliseconds', () => {
      // Arrange, Given

      const expectedValue = Math.random();
      const sut = new Lock();

      // Act, When

      sut.defaultCheckIntervalInMilliseconds = expectedValue;
      const receivedValue = sut.defaultCheckIntervalInMilliseconds;

      // Assert, Then

      expect(receivedValue).toBe(expectedValue);
    });
  });
  describe('função run()', function () {
    describe('expirationInMilliseconds', function () {
      test('se não informado deve ser o valor padrão da instância', async () => {
        // Arrange, Given

        const instanceExpirationInMilliseconds = 100;

        const wait = () =>
          new Promise<void>(resolve =>
            setTimeout(resolve, instanceExpirationInMilliseconds * 2)
          );

        const lockIdentifier = Math.random().toString();
        const sut = new Lock(instanceExpirationInMilliseconds);

        // Act, When

        const startTime = performance.now();
        const lock = await sut.run(lockIdentifier, wait);
        const endTime = performance.now();

        // Assert, Then

        const executionDuration = endTime - startTime;
        expect(executionDuration).toBeLessThanOrEqual(
          instanceExpirationInMilliseconds * 2
        );

        expect(lock.lockState).toBe(LockState.Expired);
      });
      test('deve usar o valor informado', async () => {
        // Arrange, Given

        const instanceExpirationInMilliseconds = 1000;
        const informedExpirationInMilliseconds = 100;

        const wait = () =>
          new Promise<void>(resolve =>
            setTimeout(resolve, instanceExpirationInMilliseconds * 2)
          );

        const lockIdentifier = Math.random().toString();
        const sut = new Lock(instanceExpirationInMilliseconds);

        // Act, When

        const startTime = performance.now();
        const lock = await sut.run(
          lockIdentifier,
          wait,
          informedExpirationInMilliseconds
        );
        const endTime = performance.now();

        // Assert, Then

        const executionDuration = endTime - startTime;
        expect(executionDuration).toBeLessThanOrEqual(
          informedExpirationInMilliseconds * 2
        );

        expect(lock.lockState).toBe(LockState.Expired);
      });
      test('não deve aceitar valor menor que zero', async () => {
        // Arrange, Given

        const values: [boolean, number | undefined][] = [
          [true, undefined],
          [true, 1],
          [true, 100],
          [false, 0],
          [false, -1],
          [false, -100],
          [false, Number.MIN_SAFE_INTEGER]
        ];

        const sut = new Lock();

        for (const set of values) {
          const isValid = set[0];
          const value = set[1];

          // Act, When

          try {
            await sut.run(Math.random().toString(), jest.fn(), value);
            throw undefined;
          } catch (error) {
            // Assert, Then

            if (isValid) {
              expect(error).toBeUndefined();
            } else {
              expect(error).toBeInstanceOf(InvalidArgumentError);
            }
          }
        }
      });
    });
    describe('checkIntervalInMilliseconds', () => {
      test('se não informado deve ser o valor padrão da instância', async () => {
        // Arrange, Given

        const executionInterval = 100;
        const instanceCheckIntervalInMilliseconds = executionInterval * 3;

        const wait = () =>
          new Promise<void>(resolve => setTimeout(resolve, executionInterval));
        const noWait = jest.fn();

        const lockIdentifier = Math.random().toString();
        const sut = new Lock(undefined, instanceCheckIntervalInMilliseconds);

        // Act, When

        const startTime = performance.now();
        void sut.run(lockIdentifier, wait);
        await sut.run(lockIdentifier, noWait);
        const endTime = performance.now();

        // Assert, Then

        const executionDuration = endTime - startTime;
        expect(executionDuration).toBeGreaterThan(
          instanceCheckIntervalInMilliseconds
        );
      });
      test('deve usar o valor informado', async () => {
        // Arrange, Given

        const executionInterval = 100;
        const instanceCheckIntervalInMilliseconds = executionInterval * 3;
        const informedCheckIntervalInMilliseconds = executionInterval * 6;

        const wait = () =>
          new Promise<void>(resolve =>
            setTimeout(resolve, executionInterval * 2)
          );
        const noWait = jest.fn();

        const lockIdentifier = Math.random().toString();
        const sut = new Lock(undefined, instanceCheckIntervalInMilliseconds);

        // Act, When

        const startTime = performance.now();
        void sut.run(lockIdentifier, wait);
        await sut.run(
          lockIdentifier,
          noWait,
          undefined,
          informedCheckIntervalInMilliseconds
        );
        const endTime = performance.now();

        // Assert, Then

        const executionDuration = endTime - startTime;
        expect(executionDuration).toBeGreaterThan(
          informedCheckIntervalInMilliseconds
        );
      });
      test('não deve aceitar valor menor que zero', async () => {
        // Arrange, Given

        const values: [boolean, number][] = [
          [true, 1],
          [true, 100],
          [false, 0],
          [false, -1],
          [false, -100],
          [false, Number.MIN_SAFE_INTEGER]
        ];

        const sut = new Lock();

        for (const set of values) {
          const isValid = set[0];
          const value = set[1];

          // Act, When

          try {
            await sut.run(
              Math.random().toString(),
              jest.fn(),
              undefined,
              value
            );
            throw undefined;
          } catch (error) {
            // Assert, Then

            if (isValid) {
              expect(error).toBeUndefined();
            } else {
              expect(error).toBeInstanceOf(InvalidArgumentError);
            }
          }
        }
      });
    });
    test('se o lock nunca foi usado a execução deve ocorrer logo cedo', async () => {
      // Arrange, Given

      const minimumInterval = 2;
      const longInterval = 1000;

      const sut = new Lock(undefined, longInterval);

      // Act, When

      const startTime = performance.now();
      await sut.run(Math.random().toString(), jest.fn());
      const endTime = performance.now();

      // Assert, Then

      const executionDuration = endTime - startTime;
      expect(executionDuration).toBeLessThanOrEqual(minimumInterval);
    });
    test('as execuções devem ser sequenciais, esperando a a atual terminar', async () => {
      // Arrange, Given

      const extraTime = 100;

      const times = Math.floor(Math.random() * 10 + 3);
      const executionInterval = 100;
      const expectedOrder: number[] = Array<number>(times)
        .fill(0)
        .map((_, index) => index);
      const receivedOrder: number[] = [];
      const wait = (order: number) => () =>
        new Promise<void>(
          resolve =>
            receivedOrder.push(order) && setTimeout(resolve, executionInterval)
        );

      const lockIdentifier = Math.random().toString();
      const sut = new Lock();

      // Act, When

      const startTime = performance.now();
      for (let i = 0; i < times; i++) {
        await sut.run(lockIdentifier, wait(i));
      }
      const endTime = performance.now();

      // Assert, Then

      const executionDuration = endTime - startTime;
      expect(executionDuration).toBeLessThanOrEqual(
        executionInterval * times + extraTime
      );
      expect(receivedOrder).toStrictEqual(expectedOrder);
    });
    describe('cancelar lock', () => {
      test('deve ser possível cancelar um lock', async () => {
        // Arrange, Given

        const executionInterval = 100;
        const wait = () =>
          new Promise<void>(resolve => setTimeout(resolve, executionInterval));
        const noWait = jest.fn();

        const lockIdentifier = Math.random().toString();
        const sut = new Lock();

        // Act, When

        const startTime = performance.now();
        void sut.run(lockIdentifier, wait);
        setTimeout(() => sut.cancel(lockIdentifier), executionInterval / 2);
        const lock = await sut.run(lockIdentifier, noWait);
        const endTime = performance.now();

        // Assert, Then

        const executionDuration = endTime - startTime;
        expect(executionDuration).toBeLessThan(executionInterval);

        expect(lock.lockState).toBe(LockState.Canceled);
      });
      test('retorna 1 se houver 1 lock para cancelar', async () => {
        // Arrange, Given

        const executionInterval = 100;
        const wait = () =>
          new Promise<void>(resolve => setTimeout(resolve, executionInterval));

        const lockIdentifier = Math.random().toString();
        const sut = new Lock();

        // Act, When

        void sut.run(lockIdentifier, wait);
        const canceled = sut.cancel(lockIdentifier);

        // Assert, Then

        expect(canceled).toBe(1);
      });
      test('retorna 0 se o lock nunca foi usado', async () => {
        // Arrange, Given

        const lockIdentifier = Math.random().toString();
        const sut = new Lock();

        // Act, When

        const canceled = sut.cancel(lockIdentifier);

        // Assert, Then

        expect(canceled).toBe(0);
      });
      test('retorna 0 se o lock já foi liberado', async () => {
        // Arrange, Given

        const executionInterval = 100;
        const wait = () =>
          new Promise<void>(resolve => setTimeout(resolve, executionInterval));

        const lockIdentifier = Math.random().toString();
        const sut = new Lock();

        // Act, When

        await sut.run(lockIdentifier, wait);
        const canceled = sut.cancel(lockIdentifier);

        // Assert, Then

        expect(canceled).toBe(0);
      });
      test('modo "current", retorna 1 se cancelar apenas o lock corrente', async () => {
        // Arrange, Given

        const executionInterval = 100;
        let executionCount = 0;
        const wait = () =>
          new Promise<void>(resolve =>
            setTimeout(() => executionCount++ && resolve(), executionInterval)
          );

        const lockIdentifier = Math.random().toString();
        const sut = new Lock();

        // Act, When

        void sut.run(lockIdentifier, wait);
        void sut.run(lockIdentifier, wait);
        void sut.run(lockIdentifier, wait);
        void sut.run(lockIdentifier, wait);
        const canceled = sut.cancel(lockIdentifier, 'current');
        await sut.run(lockIdentifier, wait);

        // Assert, Then

        expect(canceled).toBe(1);
        expect(executionCount).toBe(5);
      });
      test('modo "all", retorna total locks e executa apenas o primeiro', async () => {
        // Arrange, Given

        const executionInterval = 100;
        let executionCount = 0;
        const wait = () =>
          new Promise<void>(resolve =>
            setTimeout(() => executionCount++ && resolve(), executionInterval)
          );

        const lockIdentifier = Math.random().toString();
        const sut = new Lock();

        // Act, When

        void sut.run(lockIdentifier, wait);
        void sut.run(lockIdentifier, wait);
        void sut.run(lockIdentifier, wait);
        void sut.run(lockIdentifier, wait);
        const canceled = sut.cancel(lockIdentifier, 'all');
        await sut.run(lockIdentifier, wait);

        // Assert, Then

        expect(canceled).toBe(4);
        expect(executionCount).toBe(2);
      });
      test('modo diferente de "all" e "current" deve falhar', async () => {
        // Arrange, Given

        const invalidValue = Math.random().toString() as unknown as 'all';
        const sut = new Lock();

        // Act, When

        const action = () => sut.cancel(Math.random().toString(), invalidValue);

        // Assert, Then

        expect(action).toThrow(InvalidArgumentError);
      });
    });
    describe('verificar estado do lock', () => {
      test('Undefined', async () => {
        // Arrange, Given

        const lockIdentifier = Math.random().toString();
        const sut = new Lock();

        // Act, When

        const lockState = sut.getState(lockIdentifier);

        // Assert, Then

        expect(lockState).toBe(LockState.Undefined);
      });
      test('Locked', async () => {
        // Arrange, Given

        const executionInterval = 100;
        const wait = () =>
          new Promise<void>(resolve => setTimeout(resolve, executionInterval));

        const lockIdentifier = Math.random().toString();
        const sut = new Lock();

        // Act, When

        void sut.run(lockIdentifier, wait);
        const lockState = sut.getState(lockIdentifier);

        // Assert, Then

        expect(lockState).toBe(LockState.Locked);
      });
      test('Unlocked', async () => {
        // Arrange, Given

        const executionInterval = 100;
        const wait = () =>
          new Promise<void>(resolve => setTimeout(resolve, executionInterval));

        const lockIdentifier = Math.random().toString();
        const sut = new Lock();

        // Act, When

        await sut.run(lockIdentifier, wait);
        const lockState = sut.getState(lockIdentifier);

        // Assert, Then

        expect(lockState).toBe(LockState.Unlocked);
      });
      test('Expired', async () => {
        // Arrange, Given

        const executionInterval = 100;
        const wait = () =>
          new Promise<void>(resolve => setTimeout(resolve, executionInterval));

        const lockIdentifier = Math.random().toString();
        const sut = new Lock();

        // Act, When

        await sut.run(lockIdentifier, wait, executionInterval / 2);
        const lockState = sut.getState(lockIdentifier);

        // Assert, Then

        expect(lockState).toBe(LockState.Expired);
      });
      test('Canceled', async () => {
        // Arrange, Given

        const executionInterval = 100;
        const wait = () =>
          new Promise<void>(resolve => setTimeout(resolve, executionInterval));

        const lockIdentifier = Math.random().toString();
        const sut = new Lock();

        // Act, When

        void sut.run(lockIdentifier, wait, executionInterval / 2);
        sut.cancel(lockIdentifier);
        const lockState = sut.getState(lockIdentifier);

        // Assert, Then

        expect(lockState).toBe(LockState.Canceled);
      });
    });
  });
  test('ciclo de vida do estado do lock: Undefined, Locked, Unlocked', async () => {
    // Arrange, Given

    const executionInterval = 100;
    const wait = () =>
      new Promise<void>(resolve => setTimeout(resolve, executionInterval));

    const lockIdentifier = Math.random().toString();
    const sut = new Lock();
    const lockStates: LockState[] = [];

    // Act, When

    lockStates.push(sut.getState(lockIdentifier));
    setImmediate(() => lockStates.push(sut.getState(lockIdentifier)));
    await sut.run(lockIdentifier, wait);
    lockStates.push(sut.getState(lockIdentifier));
    setImmediate(() => lockStates.push(sut.getState(lockIdentifier)));
    await sut.run(lockIdentifier, wait);
    lockStates.push(sut.getState(lockIdentifier));

    // Assert, Then

    expect(lockStates[0]).toBe(LockState.Undefined);
    expect(lockStates[1]).toBe(LockState.Locked);
    expect(lockStates[2]).toBe(LockState.Unlocked);
    expect(lockStates[3]).toBe(LockState.Locked);
    expect(lockStates[4]).toBe(LockState.Unlocked);
  });
  test('ciclo de vida do estado do lock: Undefined, Locked, Expired, Locked, Unlocked', async () => {
    // Arrange, Given

    const executionInterval = 100;
    const wait = () =>
      new Promise<void>(resolve => setTimeout(resolve, executionInterval));

    const lockIdentifier = Math.random().toString();
    const sut = new Lock();
    const lockStates: LockState[] = [];

    // Act, When

    lockStates.push(sut.getState(lockIdentifier));
    setImmediate(() => lockStates.push(sut.getState(lockIdentifier)));
    await sut.run(lockIdentifier, wait, executionInterval / 2);
    lockStates.push(sut.getState(lockIdentifier));
    setImmediate(() => lockStates.push(sut.getState(lockIdentifier)));
    await sut.run(lockIdentifier, wait);
    lockStates.push(sut.getState(lockIdentifier));

    // Assert, Then

    expect(lockStates[0]).toBe(LockState.Undefined);
    expect(lockStates[1]).toBe(LockState.Locked);
    expect(lockStates[2]).toBe(LockState.Expired);
    expect(lockStates[3]).toBe(LockState.Locked);
    expect(lockStates[4]).toBe(LockState.Unlocked);
  });
  test('ciclo de vida do estado do lock: Undefined, Locked, Canceled, Locked, Unlocked', async () => {
    // Arrange, Given

    const executionInterval = 100;
    const wait = () =>
      new Promise<void>(resolve => setTimeout(resolve, executionInterval));

    const lockIdentifier = Math.random().toString();
    const sut = new Lock();
    const lockStates: LockState[] = [];

    // Act, When

    lockStates.push(sut.getState(lockIdentifier));
    setTimeout(
      () => lockStates.push(sut.getState(lockIdentifier)),
      executionInterval / 2
    );
    setTimeout(() => sut.cancel(lockIdentifier), executionInterval / 2);
    await sut.run(lockIdentifier, wait);
    lockStates.push(sut.getState(lockIdentifier));
    setTimeout(
      () => lockStates.push(sut.getState(lockIdentifier)),
      executionInterval / 2
    );
    await sut.run(lockIdentifier, wait);
    lockStates.push(sut.getState(lockIdentifier));

    // Assert, Then

    expect(lockStates[0]).toBe(LockState.Undefined);
    expect(lockStates[1]).toBe(LockState.Locked);
    expect(lockStates[2]).toBe(LockState.Canceled);
    expect(lockStates[3]).toBe(LockState.Locked);
    expect(lockStates[4]).toBe(LockState.Unlocked);
  });
  describe('Retorno da execução', () => {
    test('quando há sucesso no callback', async () => {
      // Arrange, Given

      const expectedResult = Math.random();
      const callback = () => expectedResult;

      const sut = new Lock();

      // Act, When

      const result = await sut.run(Math.random().toString(), callback);

      // Assert, Then

      expect(result.lockState).toBe(LockState.Unlocked);
      expect(result.callbackResult).toBe(expectedResult);
      expect(result.callbackSuccess).toBe(true);
      expect(result.callbackError).toBeUndefined();
    });
    test('quando há falha no callback', async () => {
      // Arrange, Given

      const expectedError = Math.random();
      const callback = () => {
        throw expectedError;
      };

      const sut = new Lock();

      // Act, When

      const result = await sut.run(Math.random().toString(), callback);

      // Assert, Then

      expect(result.lockState).toBe(LockState.Unlocked);
      expect(result.callbackResult).toBeUndefined();
      expect(result.callbackSuccess).toBe(false);
      expect(result.callbackError).toBe(expectedError);
    });
  });
  describe('precedência do status do lock', () => {
    test('Undefined quando não há lock definido', async () => {
      // Arrange, Given

      const expectedStatus = LockState.Undefined;
      const lockName = Math.random().toString();
      const sut = new Lock();

      // Act, When

      const receivedStatus = sut.getState(lockName);

      // Assert, Then

      expect(receivedStatus).toBe(expectedStatus);
    });
    test('(Canceled), Expired e Unlocked: vale o definido por último ', async () => {
      return new Promise<void>(resolve => {
        // Arrange, Given

        const expectedStatus = LockState.Canceled;

        const lockName = Math.random().toString();
        const executionInterval = 300;
        const wait = () =>
          new Promise<void>(resolve => setTimeout(resolve, executionInterval));

        const sut = new Lock();

        // Act, When

        sut.run(lockName, wait).then(() => {
          void sut.run(lockName, wait);
          void sut.run(lockName, wait, executionInterval / 3);
          setTimeout(
            () => sut.cancel(lockName, 'current'),
            executionInterval / 2
          );

          setTimeout(() => {
            const receivedStatus = sut.getState(lockName);

            // Assert, Then

            expect(receivedStatus).toBe(expectedStatus);

            // Tear Down

            resolve();
          }, executionInterval * 2);
        });
      });
    });
    test('Canceled, (Expired) e Unlocked: vale o definido por último ', async () => {
      return new Promise<void>(resolve => {
        // Arrange, Given

        const expectedStatus = LockState.Expired;

        const lockName = Math.random().toString();
        const executionInterval = 200;
        const wait = () =>
          new Promise<void>(resolve => setTimeout(resolve, executionInterval));

        const sut = new Lock();

        // Act, When

        sut.run(lockName, wait).then(() => {
          void sut.run(lockName, wait);
          void sut.run(lockName, wait, executionInterval / 2);
          sut.cancel(lockName, 'current');

          setTimeout(() => {
            const receivedStatus = sut.getState(lockName);

            // Assert, Then

            expect(receivedStatus).toBe(expectedStatus);

            // Tear Down

            resolve();
          }, executionInterval * 2);
        });
      });
    });
    test('Canceled, Expired e (Unlocked): vale o definido por último ', async () => {
      return new Promise<void>(resolve => {
        // Arrange, Given

        const expectedStatus = LockState.Unlocked;

        const lockName = Math.random().toString();
        const executionInterval = 200;
        const wait = () =>
          new Promise<void>(resolve => setTimeout(resolve, executionInterval));

        const sut = new Lock();

        // Act, When

        sut.run(lockName, wait).then(() => {
          void sut.run(lockName, wait);
          void sut.run(lockName, wait, executionInterval / 2);
          sut.cancel(lockName, 'current');

          setTimeout(() => {
            sut.run(lockName, wait).then(() => {
              const receivedStatus = sut.getState(lockName);

              // Assert, Then

              expect(receivedStatus).toBe(expectedStatus);

              // Tear Down

              resolve();
            });
          }, executionInterval * 2);
        });
      });
    });
    test('Locked precede a todos', async () => {
      return new Promise<void>(resolve => {
        // Arrange, Given

        const expectedStatus = LockState.Locked;

        const lockName = Math.random().toString();
        const executionInterval = 300;
        const wait = () =>
          new Promise<void>(resolve => setTimeout(resolve, executionInterval));

        const sut = new Lock();

        // Act, When

        sut.run(lockName, wait).then(() => {
          void sut.run(lockName, wait);
          void sut.run(lockName, wait);
          void sut.run(lockName, wait, executionInterval / 3);
          sut.cancel(lockName, 'current');

          setTimeout(() => {
            const receivedStatus = sut.getState(lockName);

            // Assert, Then

            expect(receivedStatus).toBe(expectedStatus);

            // Tear Down

            resolve();
          }, executionInterval / 2);
        });
      });
    });
  });
});
