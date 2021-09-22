import {
  KeyValue,
  HelperNumeric,
  InvalidArgumentError,
  InvalidExecutionError,
  INumericFormat
} from '../../ts';

describe('Classe HelperNumeric', () => {
  test('Não deve permitir instanciar', () => {
    // Arrange, Given
    // Act, When

    const instantiate = () => new HelperNumeric();

    // Assert, Then

    expect(instantiate).toThrowError(InvalidExecutionError);
  });
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
        expect(deviation).toBeGreaterThanOrEqual(
          1 - percentAcceptableDeviation
        );
        expect(deviation).toBeLessThanOrEqual(1 + percentAcceptableDeviation);
      }
    });
  });
  test('between() deve retorna um número aleatório num intervalo', () => {
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
  describe('sum() deve somar ou subtrair números de qualquer comprimento', () => {
    describe('soma e subtração de dois números aleatórios', () => {
      const randomNumber = () =>
        HelperNumeric.between(-1000, 1000) +
        '.' +
        HelperNumeric.between(0, 1000);
      for (let i = 0; i < 100; i++) {
        let number1 = randomNumber();
        let number2 = randomNumber();
        test(`Teste ${i + 1}: ${number1} + ${number2}`, () => {
          // Arrange, Given

          const expectedResult = (
            Number.parseFloat(number1) + Number.parseFloat(number2)
          ).toString();

          // Act, When

          const result = HelperNumeric.sum(number1, number2);

          // Assert, Then
          const resultFormatted = Number.parseFloat(result).toFixed(10);
          const expectedResultFormatted =
            Number.parseFloat(expectedResult).toFixed(10);

          expect(resultFormatted).toBe(expectedResultFormatted);
        });
      }
    });
    test('deve falhar se o valor de entrada não for numérico', () => {
      // Arrange, Given

      const inputInvalidNumber = 'not a number';
      const inputEmptyValue = '';

      // Act, When

      const runWithInvalidNumber1 = () =>
        HelperNumeric.sum(inputInvalidNumber, '0');
      const runWithEmptyValue1 = () => HelperNumeric.sum(inputEmptyValue, '0');
      const runWithInvalidNumber2 = () =>
        HelperNumeric.sum('0', inputInvalidNumber);
      const runWithEmptyValue2 = () => HelperNumeric.sum('0', inputEmptyValue);

      // Assert, Then

      expect(runWithInvalidNumber1).toThrowError(InvalidArgumentError);
      expect(runWithEmptyValue1).toThrowError(InvalidArgumentError);
      expect(runWithInvalidNumber2).toThrowError(InvalidArgumentError);
      expect(runWithEmptyValue2).toThrowError(InvalidArgumentError);
    });
    test('deve conseguir incrementar um número muito grande', () => {
      // Arrange, Given

      const initialNumberLength = 500;
      const inputNumber = '9'.repeat(initialNumberLength);
      const expectedResult = '1' + '0'.repeat(inputNumber.length);

      // Act, When

      const result = HelperNumeric.sum(inputNumber, '1');

      // Assert, Then

      expect(result).toBe(expectedResult);
    });
    test('incrementar número decimal', () => {
      // Arrange, Given

      const inputNumbers = '.1';
      const expectedResult = '0.2';

      // Act, When

      const result = HelperNumeric.sum(inputNumbers, inputNumbers);

      // Assert, Then

      expect(result).toBe(expectedResult);
    });
    test('incrementar positivo + positivo', () => {
      // Arrange, Given

      const inputNumber1 = '11';
      const inputNumber2 = '22';
      const expectedResult = '33';

      // Act, When

      const result = HelperNumeric.sum(inputNumber1, inputNumber2);

      // Assert, Then

      expect(result).toBe(expectedResult);
    });
    test('incrementar positivo + negativo', () => {
      // Arrange, Given

      const inputNumber1 = '11';
      const inputNumber2 = '-22';
      const expectedResult = '-11';

      // Act, When

      const result = HelperNumeric.sum(inputNumber1, inputNumber2);

      // Assert, Then

      expect(result).toBe(expectedResult);
    });
    test('incrementar negativo + positivo', () => {
      // Arrange, Given

      const inputNumber1 = '-11';
      const inputNumber2 = '22';
      const expectedResult = '11';

      // Act, When

      const result = HelperNumeric.sum(inputNumber1, inputNumber2);

      // Assert, Then

      expect(result).toBe(expectedResult);
    });
    test('incrementar negativo + negativo', () => {
      // Arrange, Given

      const inputNumber1 = '-11';
      const inputNumber2 = '-22';
      const expectedResult = '-33';

      // Act, When

      const result = HelperNumeric.sum(inputNumber1, inputNumber2);

      // Assert, Then

      expect(result).toBe(expectedResult);
    });
  });
  describe('max()', () => {
    test('deve retorna o maior número da lista', () => {
      // Arrange, Given

      const list = Array(10)
        .fill(0)
        .map(() => HelperNumeric.between(0, 100));
      const expectedGreater = list.reduce(
        (result: number, current: number) =>
          current > result ? current : result,
        -1
      );

      // Act, When

      const greater = HelperNumeric.max(list);

      // Assert, Then

      expect(greater).toBe(expectedGreater);
    });
    test('deve falhar se a lista for vazia', () => {
      // Arrange, Given
      // Act, When

      const execute = () => HelperNumeric.max([]);

      // Assert, Then

      expect(execute).toThrowError(InvalidArgumentError);
    });
  });
  describe('min()', () => {
    test('deve retorna o menor número da lista', () => {
      // Arrange, Given

      const list = Array(10)
        .fill(0)
        .map(() => HelperNumeric.between(0, 100));
      const expectedLess = list.reduce(
        (result: number, current: number) =>
          current < result ? current : result,
        1000
      );

      // Act, When

      const less = HelperNumeric.min(list);

      // Assert, Then

      expect(less).toBe(expectedLess);
    });
    test('deve falhar se a lista for vazia', () => {
      // Arrange, Given
      // Act, When

      const execute = () => HelperNumeric.min([]);

      // Assert, Then

      expect(execute).toThrowError(InvalidArgumentError);
    });
  });
  test('sortCompare() deve permitir comparar uma lista numérica', () => {
    // Arrange, Given

    const sortedList = Array(100)
      .fill(0)
      .map((_: number, index: number) => index);

    // Act, When

    const sortedAgain = Array<number>()
      .concat(sortedList)
      .sort(HelperNumeric.sortCompare);

    // Assert, Then

    expect(sortedAgain.join(',')).toBe(sortedList.join(','));
  });
  test('reverseCompare() deve permitir comparar de forma reversa uma lista numérica', () => {
    // Arrange, Given

    const sortedList = Array(100)
      .fill(0)
      .map((_: number, index: number) => 100 - index);

    // Act, When

    const sortedAgain = Array<number>()
      .concat(sortedList)
      .sort(HelperNumeric.reverseCompare);

    // Assert, Then

    expect(sortedAgain.join(',')).toBe(sortedList.join(','));
  });
  describe('format() deve formatar um número para string', () => {
    test('quantidade de dígitos', () => {
      // Arrange, Given

      const format: INumericFormat = { digits: 5 };

      // Act, When

      const text = HelperNumeric.format(0, format);

      // Assert, Then

      expect(text).toBe('0.00000');
    });
    test('ponto decimal', () => {
      // Arrange, Given

      const format: INumericFormat = { decimal: '#' };

      // Act, When

      const text = HelperNumeric.format(0, format);

      // Assert, Then

      expect(text).toBe('0#00');
    });
    test('ponto decimal e separador de milhar não informados', () => {
      // Arrange, Given

      const format: INumericFormat = { decimal: '', miles: '' };

      // Act, When

      const text = HelperNumeric.format(1000.23, format);

      // Assert, Then

      expect(text).toBe('100023');
    });
    test('ponto decimal não informado e separador de milhar informado', () => {
      // Arrange, Given

      const format: INumericFormat = { decimal: '', miles: '#' };

      // Act, When

      const text = HelperNumeric.format(1000.23, format);

      // Assert, Then

      expect(text).toBe('1#00023');
    });
    test('ponto decimal informado e separador de milhar não informado', () => {
      // Arrange, Given

      const format: INumericFormat = { decimal: '#', miles: '' };

      // Act, When

      const text = HelperNumeric.format(1000.23, format);

      // Assert, Then

      expect(text).toBe('1000#23');
    });
    test('separador de milhar', () => {
      // Arrange, Given

      const format: INumericFormat = { miles: '#' };

      // Act, When

      const text = HelperNumeric.format(1000, format);

      // Assert, Then

      expect(text).toBe('1#000.00');
    });
    test('sinal de positivo', () => {
      // Arrange, Given

      const format: INumericFormat = { showPositive: true };

      // Act, When

      const text = HelperNumeric.format(1, format);

      // Assert, Then

      expect(text).toBe('+1.00');
    });
    test('usando prefixo', () => {
      // Arrange, Given

      const format: INumericFormat = { prefix: '#' };

      // Act, When

      const text = HelperNumeric.format(0, format);

      // Assert, Then

      expect(text).toBe('#0.00');
    });
    test('usando sufixo', () => {
      // Arrange, Given

      const format: INumericFormat = { suffix: '#' };

      // Act, When

      const text = HelperNumeric.format(0, format);

      // Assert, Then

      expect(text).toBe('0.00#');
    });
  });
});
