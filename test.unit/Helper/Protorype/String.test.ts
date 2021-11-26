import { HelperText, ITranslate, KeyValue, Translate } from "../../../ts";

describe('Prototype para String', () => {
  const originals: KeyValue<any> = {};

  beforeEach(() => {
    originals['HelperText.querystring'] = HelperText.querystring;
    originals['HelperText.escapeRegExp'] = HelperText.escapeRegExp;
    originals['HelperText.replaceAll'] = HelperText.replaceAll;
    originals['HelperText.removeAccents'] = HelperText.removeAccents;
    originals['HelperText.slugify'] = HelperText.slugify;
    originals['Translate.default'] = Translate.default
  });

  afterEach(() => {
    HelperText.querystring = originals['HelperText.querystring'];
    HelperText.escapeRegExp = originals['HelperText.escapeRegExp'];
    HelperText.replaceAll = originals['HelperText.replaceAll'];
    HelperText.removeAccents = originals['HelperText.removeAccents'];
    HelperText.slugify = originals['HelperText.slugify'];
    Translate.default = originals['Translate.default'];
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

  describe('Implementação do serviço de tradução ITranslate', () => {
    test('translate() deve ser repassado ao serviço de tradução padrão', () => {
      // Arrange, Given

      const func = jest.fn();
      Translate.default = {
        get: func
      } as unknown as ITranslate;

      const inputText = Math.random().toString();
      const language = Math.random().toString();

      // Act, When

      inputText.translate(language);

      // Assert, Then

      expect(func).toBeCalledTimes(1);
      expect(func).toHaveBeenCalledWith(inputText, language);
    });
    test('translate() não deve falhar se serviço de tradução não existir', () => {
      // Arrange, Given

      Translate.default = undefined as unknown as ITranslate;

      const inputText = Math.random().toString();

      // Act, When

      const outputText = inputText.translate();

      // Assert, Then

      expect(outputText).toBe(inputText);
    });
    test('translate() sempre deve retornar string', () => {
      // Arrange, Given

      const invalidOutput = Math.random();

      Translate.default = {
        get: () => invalidOutput
      } as unknown as ITranslate;

      // Act, When

      const outputText = String("").translate();

      // Assert, Then

      expect(typeof outputText).not.toBe(typeof invalidOutput);
      expect(typeof outputText).toBe("string");
      expect(outputText).toBe(String(invalidOutput));
    });
    test('translate() deve retornar o próprio valor se o serviço de tradução retornar undefined', () => {
      // Arrange, Given

      Translate.default = {
        get: () => undefined
      } as unknown as ITranslate;

      const inputText = Math.random().toString();

      // Act, When

      const outputText = inputText.translate();

      // Assert, Then

      expect(outputText).toBe(inputText);
    });
    test('translate() deve retornar o próprio valor se o serviço de tradução retornar nulo', () => {
      // Arrange, Given

      Translate.default = {
        get: () => null
      } as unknown as ITranslate;

      const inputText = Math.random().toString();

      // Act, When

      const outputText = inputText.translate();

      // Assert, Then

      expect(outputText).toBe(inputText);
    });
    test('translate() deve retornar o valor fornecido pelo serviço de tradução retornar nulo', () => {
      // Arrange, Given

      const expectedOutput = Math.random().toString();

      Translate.default = {
        get: () => expectedOutput
      } as unknown as ITranslate;

      const inputText = Math.random().toString();

      // Act, When

      const outputText = inputText.translate();

      // Assert, Then

      expect(outputText).not.toBe(inputText);
      expect(outputText).toBe(expectedOutput);
    });
  });
});
