import {
  HelperDate,
  InvalidExecutionError,
  IDateTimeFormat
} from '../../ts';

describe('Classe HelperDate', () => {
  const originals: Record<string, any> = {};

  beforeEach(() => {
    originals['HelperDate.addMilliseconds'] = HelperDate.addMilliseconds;
    originals['HelperDate.addSeconds'] = HelperDate.addSeconds;
    originals['HelperDate.addMinutes'] = HelperDate.addMinutes;
    originals['HelperDate.addHours'] = HelperDate.addHours;
    originals['HelperDate.addDays'] = HelperDate.addDays;
    originals['HelperDate.regexIsDateYearMonthDay'] =
      HelperDate.regexIsDateYearMonthDay;
    originals['HelperDate.regexIsIsoDate'] = HelperDate.regexIsIsoDate;
  });

  afterEach(() => {
    HelperDate.addMilliseconds = originals['HelperDate.addMilliseconds'];
    HelperDate.addSeconds = originals['HelperDate.addSeconds'];
    HelperDate.addMinutes = originals['HelperDate.addMinutes'];
    HelperDate.addHours = originals['HelperDate.addHours'];
    HelperDate.addDays = originals['HelperDate.addDays'];
    HelperDate.regexIsDateYearMonthDay =
      originals['HelperDate.regexIsDateYearMonthDay'];
    HelperDate.regexIsIsoDate = originals['HelperDate.regexIsIsoDate'];
  });

  test('Não deve permitir instanciar', () => {
    // Arrange, Given
    // Act, When

    const instantiate = () => new HelperDate();

    // Assert, Then

    expect(instantiate).toThrowError(InvalidExecutionError);
  });

  describe('adição em datas', () => {
    test('adicionar milissegundos para o futuro (positivo)', () => {
      // Arrange, Given

      const fromDate = new Date(Math.floor(Math.random() * 100000));
      const randomTime = Math.floor(Math.random() * 100000);
      const expectedDate = new Date(fromDate.getTime() + randomTime);

      // Act, When

      const date = HelperDate.addMilliseconds(randomTime, fromDate);

      // Assert, Then

      expect(date).toEqual(expectedDate);
    });
    test('adicionar milissegundos para o passado (negativo)', () => {
      // Arrange, Given

      const fromDate = new Date(Math.floor(Math.random() * 100000));
      const randomTime = Math.floor(Math.random() * 100000);
      const expectedDate = new Date(fromDate.getTime() - randomTime);

      // Act, When

      const date = HelperDate.addMilliseconds(-randomTime, fromDate);

      // Assert, Then

      expect(date).toEqual(expectedDate);
    });
    test('não informar data deve considerar data atual', () => {
      // Arrange, Given

      const precision = 100;
      const expectedDate = Math.floor(new Date().getTime() / precision);

      // Act, When

      const date = Math.floor(
        HelperDate.addMilliseconds(0).getTime() / precision
      );

      // Assert, Then

      expect(date).toEqual(expectedDate);
    });
    describe('fazer bypass para chamar unidade inferior', () => {
      test('addSeconds deve chamar addMilliseconds', () => {
        // Arrange, Given

        const mockAdd = jest.fn();
        HelperDate.addMilliseconds = mockAdd;

        const argAddTime = Math.floor(Math.random() * 1000);
        const argDate = new Date(argAddTime);
        const expectedTimeMultiplier = 1000;

        // Act, When

        HelperDate.addSeconds(argAddTime, argDate);

        // Assert, Then

        expect(mockAdd).toBeCalledTimes(1);
        expect(mockAdd.mock.calls[0][0]).toBe(
          argAddTime * expectedTimeMultiplier
        );
        expect(mockAdd.mock.calls[0][1]).toBe(argDate);
      });
      test('addMinutes deve chamar addSeconds', () => {
        // Arrange, Given

        const mockAdd = jest.fn();
        HelperDate.addSeconds = mockAdd;

        const argAddTime = Math.floor(Math.random() * 1000);
        const argDate = new Date(argAddTime);
        const expectedTimeMultiplier = 60;

        // Act, When

        HelperDate.addMinutes(argAddTime, argDate);

        // Assert, Then

        expect(mockAdd).toBeCalledTimes(1);
        expect(mockAdd.mock.calls[0][0]).toBe(
          argAddTime * expectedTimeMultiplier
        );
        expect(mockAdd.mock.calls[0][1]).toBe(argDate);
      });
      test('addHours deve chamar addMinutes', () => {
        // Arrange, Given

        const mockAdd = jest.fn();
        HelperDate.addMinutes = mockAdd;

        const argAddTime = Math.floor(Math.random() * 1000);
        const argDate = new Date(argAddTime);
        const expectedTimeMultiplier = 60;

        // Act, When

        HelperDate.addHours(argAddTime, argDate);

        // Assert, Then

        expect(mockAdd).toBeCalledTimes(1);
        expect(mockAdd.mock.calls[0][0]).toBe(
          argAddTime * expectedTimeMultiplier
        );
        expect(mockAdd.mock.calls[0][1]).toBe(argDate);
      });
      test('addDays deve chamar addHours', () => {
        // Arrange, Given

        const mockAdd = jest.fn();
        HelperDate.addHours = mockAdd;

        const argAddTime = Math.floor(Math.random() * 1000);
        const argDate = new Date(argAddTime);
        const expectedTimeMultiplier = 24;

        // Act, When

        HelperDate.addDays(argAddTime, argDate);

        // Assert, Then

        expect(mockAdd).toBeCalledTimes(1);
        expect(mockAdd.mock.calls[0][0]).toBe(
          argAddTime * expectedTimeMultiplier
        );
        expect(mockAdd.mock.calls[0][1]).toBe(argDate);
      });
    });
    test('adicionar dias', () => {
      // Arrange, Given

      const oneDay = -1;
      const fromDate = new Date(2021, 7, 7, 7, 7, 7, 7);
      const expectedDate = new Date(2021, 7, 6, 7, 7, 7, 7);

      // Act, When

      const date = HelperDate.addDays(oneDay, fromDate);

      // Assert, Then

      expect(date).toEqual(expectedDate);
    });
  });
  describe('format() formata data como texto', () => {
    test('mask define a máscara', () => {
      // Arrange, Given

      const config: IDateTimeFormat = { mask: 'y#M#d#h#m#s#z' };
      const date = new Date(2121, 11, 11, 11, 11, 11, 111);

      // Act, When

      const text = HelperDate.format(date, config);

      // Assert, Then

      expect(text).toEqual('2121#12#11#11#11#11#111');
    });
    test('mask como running para 0 dias', () => {
      // Arrange, Given

      const config: IDateTimeFormat = { mask: 'running' };
      const date = new Date(0).addMinutes(new Date().getTimezoneOffset());

      // Act, When

      const text = HelperDate.format(date, config);

      // Assert, Then

      expect(text).toEqual('00:00:00');
    });
    test('mask como running para 1 dia', () => {
      // Arrange, Given

      const config: IDateTimeFormat = { mask: 'running' };
      const date = new Date(0)
        .addMinutes(new Date().getTimezoneOffset())
        .addDays(1);

      // Act, When

      const text = HelperDate.format(date, config);

      // Assert, Then

      expect(text).toEqual('1 day 00:00:00');
    });
    test('mask como running para 2 dias', () => {
      // Arrange, Given

      const config: IDateTimeFormat = { mask: 'running' };
      const date = new Date(0)
        .addMinutes(new Date().getTimezoneOffset())
        .addDays(2);

      // Act, When

      const text = HelperDate.format(date, config);

      // Assert, Then

      expect(text).toEqual('2 days 00:00:00');
    });
    test('mask como universal', () => {
      // Arrange, Given

      const config: IDateTimeFormat = { mask: 'universal' };
      const date = new Date(2007, 7, 7, 7, 7, 7, 7);

      // Act, When

      const text = HelperDate.format(date, config);

      // Assert, Then

      expect(text).toEqual('2007-08-07 07:07:07.007');
    });
    test('usando UTC', () => {
      // Arrange, Given

      const config: IDateTimeFormat = { useUTC: true };
      const date = new Date(0);

      // Act, When

      const text = HelperDate.format(date, config);

      // Assert, Then

      expect(text).toEqual('01/01/1970 00:00:00');
    });
  });
  test('Verifica regexIsIsoDate', () => {
    // Arrange, Given

    const expectedRegex =
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})(Z|[+-]\d{2}:\d{2})$/;

    // Act, When

    const regex = HelperDate.regexIsIsoDate;

    // Assert, Then

    expect(regex.toString()).toEqual(expectedRegex.toString());
  });
  test('Verifica regexIsDateYearMonthDay', () => {
    // Arrange, Given

    const expectedRegex = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;

    // Act, When

    const regex = HelperDate.regexIsDateYearMonthDay;

    // Assert, Then

    expect(regex.toString()).toEqual(expectedRegex.toString());
  });
  describe('isDateYYYMMDD', () => {
    test('Deve usar HelperDate.regexIsDateYearMonthDay', () => {
      // Arrange, Given

      const regexDontMatch = /^\0$/;
      HelperDate.regexIsDateYearMonthDay = regexDontMatch;

      const validValue = '2020-01-01';

      // Act, When

      const matach = HelperDate.isDateYYYMMDD(validValue);

      // Assert, Then

      expect(matach).toBe(false);
    });
    test('valida valores', () => {
      // Arrange, Given

      const values: [boolean, string | undefined | null][] = [
        [true, '2020-01-01'],
        [true, '2020-1-1'],
        [false, '0000-00-00'],
        [false, 'ops'],
        [false, new Date().toString()]
      ];

      for (const test of values) {
        const isValid = test[0];
        const value = test[1];

        // Act, When

        const result = HelperDate.isDateYYYMMDD(value);

        // Assert, Then
        expect(result).toBe(isValid);
      }
    });
  });
  describe('isDateISO', () => {
    test('Deve usar HelperDate.regexIsIsoDate', () => {
      // Arrange, Given

      const regexDontMatch = /^\0$/;
      HelperDate.regexIsIsoDate = regexDontMatch;

      const validValue = new Date().toISOString();

      // Act, When

      const matach = HelperDate.isDateISO(validValue);

      // Assert, Then

      expect(matach).toBe(false);
    });
    test('valida valores', () => {
      // Arrange, Given

      const values: [boolean, string | undefined | null][] = [
        [true, '2022-06-05T16:27:40.792Z'],
        [true, '2022-06-05T16:27:40.792+03:00'],
        [true, '2022-06-05T16:27:40.792-03:00'],
        [false, '0000-00-00T16:27:40.792Z']
      ];

      for (const test of values) {
        const isValid = test[0];
        const value = test[1];

        // Act, When

        const result = HelperDate.isDateISO(value);

        // Assert, Then
        expect(result).toBe(isValid);
      }
    });
  });
});
