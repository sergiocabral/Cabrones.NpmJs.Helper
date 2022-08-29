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
    })
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
        ]

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
      })
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
        ]

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
      })
    })
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
      })
    })
  })
});
