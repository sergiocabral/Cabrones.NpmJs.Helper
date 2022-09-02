import { LockInstance } from '../../ts/Process/LockInstance';
import { LockState } from '../../ts/Process/LockState';
import {
  EmptyError,
  InvalidArgumentError,
  InvalidExecutionError
} from '../../ts';

describe('Class LockInstance', () => {
  describe('Construtor', () => {
    test('propriedade nome deve ser acessível', () => {
      // Arrange, Given

      const expectedValue = Math.random().toString();

      // Act, When

      const sut = new LockInstance(expectedValue, undefined, undefined);
      const receivedValue = sut.name;

      // Assert, Then

      expect(receivedValue).toBe(expectedValue);
    });
    test('deve anexar um evento disparado por tempo de expiração', async () => {
      return new Promise<void>(resolve => {
        // Arrange, Given

        const tolerance = 30;
        let endTime = Number.MAX_SAFE_INTEGER;
        const timeout = 100;
        const mock = jest.fn(() => (endTime = performance.now()));

        // Act, When

        const startTime = performance.now();
        void new LockInstance(Math.random().toString(), timeout, mock);

        setTimeout(() => {
          const duration = endTime - startTime;
          const diff = Math.abs(duration - timeout);

          // Assert, Then

          expect(diff).toBeLessThan(tolerance);

          // Tear down

          resolve();
        }, timeout * 2);
      });
    });
    test('o evento disparado deve retornar um clone da instância', async () => {
      return new Promise<void>(resolve => {
        // Arrange, Given

        const timeout = 100;

        // Act, When

        const sut = new LockInstance(
          Math.random().toString(),
          timeout,
          sutClone => {
            // Assert, Then

            expect(sutClone).toBeDefined();
            expect(sutClone).toBeInstanceOf(Object);
            expect(sutClone).not.toBe(sut);
            expect(JSON.stringify(sutClone)).toBe(JSON.stringify(sut));

            // Tear down

            resolve();
          }
        );
      });
    });
  });
  test('ao definir um estado redefine updated', () => {
    // Arrange, Given

    const tolerance = 0.1;

    const sut = new LockInstance(
      Math.random().toString(),
      undefined,
      undefined
    );

    // Act, When

    sut.state = LockState.Undefined;
    const receivedUpdate1 = sut.updated;
    const moment1 = performance.now();

    sut.state = LockState.Undefined;
    const receivedUpdate2 = sut.updated;
    const moment2 = performance.now();

    // Assert, Then

    const diffMoment = moment2 - moment1;
    const diffUpdated = receivedUpdate2 - receivedUpdate1;
    const diff = Math.abs(diffUpdated - diffMoment);

    expect(diff).toBeGreaterThan(0);
    expect(diff).toBeLessThan(tolerance);
  });
  describe('propriedade index', () => {
    test('não pode ler se não foi definido', () => {
      // Arrange, Given

      const sut = new LockInstance(
        Math.random().toString(),
        undefined,
        undefined
      );

      // Act, When

      const action = () => sut.index;

      // Assert, Then

      expect(action).toThrow(EmptyError);
    });
    test('pode ser lido após definido', () => {
      // Arrange, Given

      const expectedValue = Math.random();
      const sut = new LockInstance(
        Math.random().toString(),
        undefined,
        undefined
      );

      // Act, When

      sut.index = expectedValue;
      const receivedValue = sut.index;

      // Assert, Then

      expect(receivedValue).toBe(expectedValue);
    });
    test('não pode ser definido mais de uma vez', () => {
      // Arrange, Given

      const expectedValue = Math.random();
      const sut = new LockInstance(
        Math.random().toString(),
        undefined,
        undefined
      );

      // Act, When

      const action = () => (sut.index = expectedValue);

      // Assert, Then

      expect(action).not.toThrow();
      expect(action).toThrow(EmptyError);
    });
  });
  describe('propriedade executed', () => {
    test('por padrão é false', () => {
      // Arrange, Given

      const expectedValue = false;
      const sut = new LockInstance(
        Math.random().toString(),
        undefined,
        undefined
      );

      // Act, When

      const receivedValue = sut.executed;

      // Assert, Then

      expect(receivedValue).toBe(expectedValue);
    });
    test('não aceita ser definido como false', () => {
      // Arrange, Given

      const invalidValue = false;
      const sut = new LockInstance(
        Math.random().toString(),
        undefined,
        undefined
      );

      // Act, When

      const action = () => (sut.executed = invalidValue);

      // Assert, Then

      expect(action).toThrow(InvalidArgumentError);
    });
    test('não pode ser definido mais de uma vez', () => {
      // Arrange, Given

      const validValue = true;
      const sut = new LockInstance(
        Math.random().toString(),
        undefined,
        undefined
      );

      // Act, When

      const action = () => (sut.executed = validValue);

      // Assert, Then

      expect(action).not.toThrow();
      expect(action).toThrow(InvalidExecutionError);
    });
  });
  describe('dispose()', () => {
    test('se for chamado deve cancelar o evento de timeout', async () => {
      return new Promise<void>(resolve => {
        // Arrange, Given

        const timeout = 100;
        const mock = jest.fn();

        // Act, When

        const sut = new LockInstance(Math.random().toString(), timeout, mock);

        setTimeout(() => sut.dispose(), timeout / 2);

        setTimeout(() => {
          // Assert, Then

          expect(mock).toBeCalledTimes(0);

          // Tear down

          resolve();
        }, timeout * 2);
      });
    });
    test('se NÃO for chamado NÃO deve cancelar o evento de timeout', async () => {
      return new Promise<void>(resolve => {
        // Arrange, Given

        const timeout = 100;
        const mock = jest.fn();

        // Act, When

        void new LockInstance(Math.random().toString(), timeout, mock);

        setTimeout(() => {
          // Assert, Then

          expect(mock).toBeCalledTimes(1);

          // Tear down

          resolve();
        }, timeout * 2);
      });
    });
  });
});
