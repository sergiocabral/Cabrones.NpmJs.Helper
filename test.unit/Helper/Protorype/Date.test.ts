import { HelperDate } from '../../../ts';

describe('Prototype para Date', () => {
  const originals: Record<string, any> = {};

  beforeEach(() => {
    originals['HelperDate.format'] = HelperDate.format;
    originals['HelperDate.addMilliseconds'] = HelperDate.addMilliseconds;
    originals['HelperDate.addSeconds'] = HelperDate.addSeconds;
    originals['HelperDate.addMinutes'] = HelperDate.addMinutes;
    originals['HelperDate.addHours'] = HelperDate.addHours;
    originals['HelperDate.addDays'] = HelperDate.addDays;
  });

  afterEach(() => {
    HelperDate.format = originals['HelperDate.format'];
    HelperDate.addMilliseconds = originals['HelperDate.addMilliseconds'];
    HelperDate.addSeconds = originals['HelperDate.addSeconds'];
    HelperDate.addMinutes = originals['HelperDate.addMinutes'];
    HelperDate.addHours = originals['HelperDate.addHours'];
    HelperDate.addDays = originals['HelperDate.addDays'];
  });

  describe('Funções devem corresponder a mesma função em HelperDate', () => {
    test('format', () => {
      // Arrange, Given
      const func = (HelperDate.format = jest.fn());
      // Act, When
      new Date().format();
      // Assert, Then
      expect(func).toBeCalledTimes(1);
    });
    test('addMilliseconds', () => {
      // Arrange, Given
      const func = (HelperDate.addMilliseconds = jest.fn());
      // Act, When
      new Date().addMilliseconds(1);
      // Assert, Then
      expect(func).toBeCalledTimes(1);
    });
    test('addSeconds', () => {
      // Arrange, Given
      const func = (HelperDate.addSeconds = jest.fn());
      // Act, When
      new Date().addSeconds(1);
      // Assert, Then
      expect(func).toBeCalledTimes(1);
    });
    test('addMinutes', () => {
      // Arrange, Given
      const func = (HelperDate.addMinutes = jest.fn());
      // Act, When
      new Date().addMinutes(1);
      // Assert, Then
      expect(func).toBeCalledTimes(1);
    });
    test('addHours', () => {
      // Arrange, Given
      const func = (HelperDate.addHours = jest.fn());
      // Act, When
      new Date().addHours(1);
      // Assert, Then
      expect(func).toBeCalledTimes(1);
    });
    test('addDays', () => {
      // Arrange, Given
      const func = (HelperDate.addDays = jest.fn());
      // Act, When
      new Date().addDays(1);
      // Assert, Then
      expect(func).toBeCalledTimes(1);
    });
  });
});
