import {
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
      const sample: Record<string, any> = {
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
    const sample: Record<string, any> = {};
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

      const greater = HelperNumeric.max(...list);

      // Assert, Then

      expect(greater).toBe(expectedGreater);
    });
    test('deve falhar se a lista for vazia', () => {
      // Arrange, Given
      // Act, When

      const execute = () => HelperNumeric.max();

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

      const less = HelperNumeric.min(...list);

      // Assert, Then

      expect(less).toBe(expectedLess);
    });
    test('deve falhar se a lista for vazia', () => {
      // Arrange, Given
      // Act, When

      const execute = () => HelperNumeric.min();

      // Assert, Then

      expect(execute).toThrowError(InvalidArgumentError);
    });
  });
  test('sortCompare() deve permitir comparar uma lista numérica', () => {
    // Arrange, Given

    const unsortedList = [1, 0, 5, 0, 3];

    // Act, When

    const sortedList = Array<number>()
      .concat(unsortedList)
      .sort(HelperNumeric.sortCompare);

    // Assert, Then

    expect(sortedList.join(',')).not.toBe(unsortedList.join(','));
    expect(sortedList).toEqual([0, 0, 1, 3, 5]);
  });
  test('reverseCompare() deve permitir comparar de forma reversa uma lista numérica', () => {
    // Arrange, Given

    const unsortedList = [1, 0, 5, 0, 3];

    // Act, When

    const sortedList = Array<number>()
      .concat(unsortedList)
      .sort(HelperNumeric.reverseCompare);

    // Assert, Then

    expect(sortedList.join(',')).not.toBe(unsortedList.join(','));
    expect(sortedList).toEqual([5, 3, 1, 0, 0]);
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
  describe('fromENotation', () => {
    test('teste com entrada como string e notação exponencial.', () => {
      // Arrange, Given

      const expectedResults: [string | number, string | number][] = [
        [
          '123456789123456789.111122223333444455556666777788889999e+50',
          '12345678912345678911112222333344445555666677778888999900000000000000'
        ],
        [
          '123456789123456789.111122223333444455556666777788889999e-50',
          '0.00000000000000000000000000000000123456789123456789111122223333444455556666777788889999'
        ],
        ['123456789e3', '123456789000'],
        ['123456789e1', '1234567890'],
        ['1.123e3', '1123'],
        ['12.123e3', '12123'],
        ['1.1234e1', '11.234'],
        ['1.1234e4', '11234'],
        ['1.1234e5', '112340'],
        ['123e+0', '123'],
        ['123E0', '123'],
        ['123e-1', '12.3'],
        ['123e-2', '1.23'],
        ['123e-3', '0.123'],
        ['123e-4', '0.0123'],
        ['12345.678e-1', '1234.5678'],
        ['12345.678e-5', '0.12345678'],
        ['12345.678e-6', '0.012345678'],
        ['123.4e-2', '1.234'],
        ['123.4e-3', '0.1234'],
        ['123.4e-4', '0.01234'],
        ['-123e+0', '-123'],
        ['123e1', '1230'],
        ['123e3', '123000'],
        ['123e+3', '123000'],
        ['123E+7', '1230000000'],
        ['-123.456e+1', '-1234.56'],
        ['-1.0e+1', '-10'],
        ['-1.e+1', '-10'],
        ['-1e+1', '-10'],
        ['-0', '-0'],
        ['0e0', '0'],
        ['123.456e+4', '1234560'],
        ['123E-0', '123'],
        [
          '123.456e+50',
          '12345600000000000000000000000000000000000000000000000'
        ],
        ['123e-0', '123'],
        ['123.456E-1', '12.3456'],
        [
          '123.456123456789123456895e-80',
          '0.00000000000000000000000000000000000000000000000000000000000000000000000000000123456123456789123456895'
        ],
        [
          '-123.456e-50',
          '-0.00000000000000000000000000000000000000000000000123456'
        ],
        ['-0e+1', '-0'],
        ['0e+1', '0'],
        ['0.1e+1', '1'],
        ['-0.01e+1', '-0.1'],
        ['0.01e+1', '0.1'],
        ['-123e-7', '-0.0000123'],
        ['123.456e-4', '0.0123456'],
        ['1.e-5', '0.00001'], // handle missing base fractional part
        ['.123e3', '123'], // handle missing base whole part
        ['9.10938356e-31', '0.000000000000000000000000000000910938356'], // The Electron's Mass:
        ['5.9724e+24', '5972400000000000000000000'], // The Earth's Mass:
        ['6.62607015e-34', '0.000000000000000000000000000000000662607015'], // Planck constant:
        ['0.000e3', '0'],
        ['0.000000000000000e3', '0'],
        ['-0.0001e+9', '-100000'],
        ['-0.0e1', '-0'],
        ['-0.0000e1', '-0'],
        ['1.2000e0', '1.2000'],
        ['1.2000e-0', '1.2000'],
        ['1.2000e+0', '1.2000'],
        ['1.2000e+10', '12000000000'],
        ['1.12356789445566771234e2', '112.356789445566771234'],
        ['12345.7898', '12345.7898'],
        [
          '2830869077153280552556547081187254342445169156730',
          '2830869077153280552556547081187254342445169156730'
        ],
        ['-0', '-0']
      ];

      for (const testValues of expectedResults) {
        const input = testValues[0];
        const expectedResult = testValues[1];

        // Act, When

        const result = HelperNumeric.fromENotation(input);

        // Assert, Then

        expect(result).toBe(expectedResult);
      }
    });
    test('teste com entrada como number sem notação exponencial.', () => {
      // Arrange, Given

      const expectedResults: [string | number, string | number][] = [
        [-1e33, '-1000000000000000000000000000000000'],
        [12345.7898, '12345.7898'], // no exponent
        [0.00000000000001, '0.00000000000001'], // from 1e-14
        [0.0000000000001, '0.0000000000001'], // from 1e-13
        [0.000000000001, '0.000000000001'], // from 1e-12
        [0.00000000001, '0.00000000001'], // from 1e-11
        [0.0000000001, '0.0000000001'], // from 1e-10
        [0.000000001, '0.000000001'], // from 1e-9
        [0.00000001, '0.00000001'], // from 1e-8
        [0.0000001, '0.0000001'], // from 1e-7
        [1e-7, '0.0000001'], // from 1e-7
        [-0.0000001, '-0.0000001'], // from 1e-7
        [0.0000005, '0.0000005'], // from 1e-7
        [0.1000005, '0.1000005'], // from 1e-7
        [1e-6, '0.000001'], // from 1e-6
        [0.000001, '0.000001'], // from 1e-6
        [0.00001, '0.00001'], // from 1e-5
        [0.0001, '0.0001'], // from 1e-4
        [0.001, '0.001'], // from 1e-3
        [0.01, '0.01'], // from 1e-2
        [0.1, '0.1'], // from 1e-1
        [-0.0000000000000345, '-0.0000000000000345'], // from -3.45e-14
        [-0, '0'],
        [
          2e64,
          '20000000000000000000000000000000000000000000000000000000000000000'
        ]
      ];

      for (const testValues of expectedResults) {
        const input = testValues[0];
        const expectedResult = testValues[1];

        // Act, When

        const result = HelperNumeric.fromENotation(input);

        // Assert, Then

        expect(result).toBe(expectedResult);
      }
    });
    test('Falha para entradas inválidas', () => {
      // Arrange, Given

      const invalidInputs: Array<string | number> = [
        NaN,
        Infinity,
        '123abc',
        ''
      ];

      for (const invalidInput of invalidInputs) {
        // Act, When

        const action = () => HelperNumeric.fromENotation(invalidInput);

        // Assert, Then

        expect(action).toThrowError(InvalidArgumentError);
      }
    });
    test('Pode especificar o separador de inteiro e decimal', () => {
      // Arrange, Given

      const dots: Array<'.' | ','> = [',', '.'];

      for (const dot of dots) {
        const input = `9${dot}10938356e-31`;
        const expectedResult = `0${dot}000000000000000000000000000000910938356`;

        // Act, When

        const result = HelperNumeric.fromENotation(input, dot);

        // Assert, Then

        expect(result).toBe(expectedResult);
      }
    });
  });
});
