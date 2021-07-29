import { KeyValue, HelperNumeric } from '../../ts';

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
});
