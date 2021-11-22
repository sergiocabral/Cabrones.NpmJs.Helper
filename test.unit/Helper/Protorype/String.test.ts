import { HelperText, KeyValue } from '../../../ts';

describe('Prototype para String', () => {
  const originals: KeyValue<any> = {};

  beforeEach(() => {
    originals['HelperText.querystring'] = HelperText.querystring;
    originals['HelperText.escapeRegExp'] = HelperText.escapeRegExp;
    originals['HelperText.replaceAll'] = HelperText.replaceAll;
    originals['HelperText.removeAccents'] = HelperText.removeAccents;
    originals['HelperText.slugify'] = HelperText.slugify;
  });

  afterEach(() => {
    HelperText.querystring = originals['HelperText.querystring'];
    HelperText.escapeRegExp = originals['HelperText.escapeRegExp'];
    HelperText.replaceAll = originals['HelperText.replaceAll'];
    HelperText.removeAccents = originals['HelperText.removeAccents'];
    HelperText.slugify = originals['HelperText.slugify'];
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
      const functionContent = String(String.prototype.replaceAll);
      if (functionContent !== 'function replaceAll() { [native code] }') {
        // Arrange, Given
        const func = (HelperText.replaceAll = jest.fn());
        // Act, When
        String('').replaceAll('', '');
        // Assert, Then
        expect(func).toBeCalledTimes(1);
      }
    });

    test('removeAccents', () => {
      // Arrange, Given
      const func = (HelperText.removeAccents = jest.fn());
      // Act, When
      String('').removeAccents();
      // Assert, Then
      expect(func).toBeCalledTimes(1);
    });

    test('slugify', () => {
      // Arrange, Given
      const func = (HelperText.slugify = jest.fn());
      // Act, When
      String('').slugify();
      // Assert, Then
      expect(func).toBeCalledTimes(1);
    });
  });
});
