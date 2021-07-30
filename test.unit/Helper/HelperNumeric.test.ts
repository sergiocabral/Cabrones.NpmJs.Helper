import { KeyValue, HelperNumeric, InvalidArgumentError } from "../../ts";

describe('Classe HelperNumeric', () => {
  describe('random() deve retorna um número aleatório', () => {
    test('pode retornar comprimento maior que o range de números', () => {
      // Arrange, Given

      const bigLength = 100;

      // Act, When

      const bigNumber = HelperNumeric.random(bigLength);

      // Assert, Then

      expect(bigNumber.length).toBe(bigLength);
      for (const digit of bigNumber) {
        expect(Number.isFinite(Number.parseInt(digit))).toBe(true);
      }
    });
    test('o valor deve ser aleatório', () => {
      // Arrange, Given

      const percentAcceptableDeviation = 0.2;

      const bigLength = 10000;
      const sample: KeyValue<number> = {
        '0': 0,
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0,
        '6': 0,
        '7': 0,
        '8': 0,
        '9': 0
      };

      // Act, When

      const bigNumber = HelperNumeric.random(bigLength);

      // Assert, Then

      for (const digit of bigNumber) {
        sample[digit]++;
      }
      for (const digit in sample) {
        sample[digit] = Math.round((sample[digit] / bigNumber.length) * 100);
      }

      for (const digit in sample) {
        const deviation = sample[digit] / 10;
        expect(deviation).toBeGreaterThanOrEqual(1 - percentAcceptableDeviation);
        expect(deviation).toBeLessThanOrEqual(1 + percentAcceptableDeviation);
      }
    });
  });
  test('between deve retorna um número aleatório num intervalor', () => {
    // Arrange, Given

    const percentAcceptableDeviation = 0.4;

    const range = 100;

    const min = Math.floor(Math.random() * 10);
    const max = min + range;

    const sampleLength = range * 100;
    const sample: KeyValue<number> = {};
    for (let i = min; i <= max; i++) {
      sample[i.toString()] = 0;
    }

    // Act, When

    for (let i = 0; i < sampleLength; i++) {
      const random = HelperNumeric.between(min, max);
      sample[random.toString()]++;
    }

    // Assert, Then

    for (const digit in sample) {
      sample[digit] = Math.round((sample[digit] / range) * 100);
    }

    for (const digit in sample) {
      const deviation = sample[digit] / range;
      expect(deviation).toBeGreaterThanOrEqual(1 - percentAcceptableDeviation);
      expect(deviation).toBeLessThanOrEqual(1 + percentAcceptableDeviation);
    }
  });
  describe('increment deve somar uma valor a qualquer valor numérico de qualquer comprimento', () => {
    test('deve incrementar um número comum', () => {
      // Arrange, Given

      const initialNumber = (Math.floor(Math.random() * 100) + 100).toString();
      const valueToIncrement = Math.floor(Math.random() * 100) + 100;
      const expectedResult = (parseInt(initialNumber) + valueToIncrement).toString();

      // Act, When

      const result = HelperNumeric.increment(initialNumber, valueToIncrement);

      // Assert, Then

      expect(result).toBe(expectedResult);
    });
    test('deve falhar se o valor de entrada não for numérico', () => {
      // Arrange, Given

      const inputInvalidNumber = "not a number";

      // Act, When

      const run = () => HelperNumeric.increment(inputInvalidNumber);

      // Assert, Then

      expect(run).toThrowError(InvalidArgumentError);
    })
    test('deve conseguir incrementar um número muito grande', () => {
      // Arrange, Given

      const initialNumberLength = 500;
      const inputNumber = "9".repeat(initialNumberLength);
      const expectedResult = "1" + "0".repeat(inputNumber.length);

      // Act, When

      const result = HelperNumeric.increment(inputNumber);

      // Assert, Then

      expect(result).toBe(expectedResult);
    });
  });
});
