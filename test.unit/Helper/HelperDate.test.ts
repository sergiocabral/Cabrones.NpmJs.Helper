import { HelperDate, InvalidExecutionError, KeyValue } from '../../ts';

describe('Classe HelperDate', () => {
  const originals: KeyValue<any> = {};

  beforeEach(() => {
    originals['HelperDate.addMilliseconds'] = HelperDate.addMilliseconds;
    originals['HelperDate.addSeconds'] = HelperDate.addSeconds;
    originals['HelperDate.addMinutes'] = HelperDate.addMinutes;
    originals['HelperDate.addHours'] = HelperDate.addHours;
    originals['HelperDate.addDays'] = HelperDate.addDays;
  });

  afterEach(() => {
    HelperDate.addMilliseconds = originals['HelperDate.addMilliseconds'];
    HelperDate.addSeconds = originals['HelperDate.addSeconds'];
    HelperDate.addMinutes = originals['HelperDate.addMinutes'];
    HelperDate.addHours = originals['HelperDate.addHours'];
    HelperDate.addDays = originals['HelperDate.addDays'];
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
});
