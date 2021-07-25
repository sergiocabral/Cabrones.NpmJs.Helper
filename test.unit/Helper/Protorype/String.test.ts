import { HelperText, KeyValue } from '../../../ts';

describe('Prototype para String', () => {
  const originals: KeyValue<any> = {};

  beforeEach(() => {
    originals['HelperText.querystring'] = HelperText.querystring;
    originals['HelperText.escapeRegExp'] = HelperText.escapeRegExp;
    originals['HelperText.replaceAll'] = HelperText.replaceAll;
  });

  afterEach(() => {
    HelperText.querystring = originals['HelperText.querystring'];
    HelperText.escapeRegExp = originals['HelperText.escapeRegExp'];
    HelperText.replaceAll = originals['HelperText.replaceAll'];
  });

  describe('Funções devem corresponder a mesma função em HelperText', () => {
    test('querystring', () => {
      // Arrange, Given
      const func = (HelperText.querystring = jest.fn());
      // Act, When
      String('').querystring('');
      // Assert, Then
      expect(func).toBeCalledTimes(1);
    });

    test('escapeRegExp', () => {
      // Arrange, Given
      const func = (HelperText.escapeRegExp = jest.fn());
      // Act, When
      String('').escapeRegExp();
      // Assert, Then
      expect(func).toBeCalledTimes(1);
    });

    test('replaceAll', () => {
      // Arrange, Given
      const func = (HelperText.replaceAll = jest.fn());
      // Act, When
      String('').replaceAll('', '');
      // Assert, Then
      expect(func).toBeCalledTimes(1);
    });
  });
});
