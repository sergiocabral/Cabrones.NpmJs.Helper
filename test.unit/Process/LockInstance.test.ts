import { Lock } from '../../ts/Process/Lock';
import { LockInstance } from '../../ts/Process/LockInstance';

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
        const sut = new LockInstance(Math.random().toString(), timeout, mock);

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
});
