import { Lock } from '../../ts/Process/Lock';
import { InvalidArgumentError } from '../../ts';

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
});
