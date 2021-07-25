import { HelperText } from "../../ts";
import { InvalidExecutionError } from "../../ts/Error/InvalidExecutionError";

describe('Classe HelperText', () => {
  test('Não deve permitir instanciar', () => {
    // Arrange, Given
    // Act, When

    const instantiate = () => new HelperText();

    // Assert, Then

    expect(instantiate).toThrowError(InvalidExecutionError);
  });

  test('escapeRegExp deve escapar uma string para expressão regular', () => {
    // Arrange, Given

    const regexSymbols = ['.', '*', '+', '?', '^', '$', '{', '}', '(', ')', '|', '[', ']', '\\'];
    const regexSymbolsEscaped = [];

    // Act, When

    for (const regexSymbol of regexSymbols) {
      regexSymbolsEscaped.push(HelperText.escapeRegExp(regexSymbol));
    }

    // Assert, Then

    expect(regexSymbols.length).toBe(regexSymbolsEscaped.length);
    for (let i = 0; i < regexSymbols.length && i < regexSymbolsEscaped.length; i++) {
      expect(regexSymbolsEscaped[i]).not.toBe(regexSymbols[i]);
      expect(regexSymbolsEscaped[i]).toBe('\\' + regexSymbols[i]);
    }
  });

  test('replaceAll deve substituir todas as ocorrências', () => {
    // Arrange, Given

    const search = 'a';
    const replacement = 'b';
    const initialText = search.repeat(5);

    // Act, When

    const replacedText = HelperText.replaceAll(initialText, search, replacement);

    // Assert, Then

    expect(replacedText.length).toBe(initialText.length);

    const expectedText = replacement.repeat(initialText.length);
    expect(replacedText).toBe(expectedText);
  });

  describe('querystring deve fazer substituições', () => {
    test('substituir valores de um array', () => {
      // Arrange, Given

      const randomValues = [Math.random(), Math.random()];
      const inputTemplate = 'My random values are: {0}, {1}, {2}, {3}';
      const expectedOutputText = `My random values are: ${randomValues[0]}, ${randomValues[1]}, {2}, {3}`;

      // Act, When

      const output = HelperText.querystring(inputTemplate, randomValues);

      // Assert, Then

      expect(output).toBe(expectedOutputText);
    });

    test('substituir valores de um objeto', () => {
      // Arrange, Given

      const randomValues = {
        property1: Math.random(),
        property2: Math.random()
      };
      const inputTemplate = 'My random values are: {property1}, {property2}, {property3}, {property4}';
      const expectedOutputText = `My random values are: ${randomValues.property1}, ${randomValues.property2}, {property3}, {property4}`;

      // Act, When

      const output = HelperText.querystring(inputTemplate, randomValues);

      // Assert, Then

      expect(output).toBe(expectedOutputText);
    });

    test('substituir um valor individualmente', () => {
      // Arrange, Given

      const randomValue = Math.random();
      const inputTemplate = 'My random values are: {0}, {1} e {2}';
      const expectedOutputText = `My random values are: ${randomValue}, {1} e {2}`;

      // Act, When

      const output = HelperText.querystring(inputTemplate, randomValue);

      // Assert, Then

      expect(output).toBe(expectedOutputText);
    });

    test('substituir um valor tipo Date', () => {
      // Arrange, Given

      const randomDate = new Date();
      const inputTemplate = 'My random date is: {0}, {1} e {2}';
      const expectedOutputText = `My random date is: ${randomDate}, {1} e {2}`;

      // Act, When

      const output = HelperText.querystring(inputTemplate, randomDate);

      // Assert, Then

      expect(output).toBe(expectedOutputText);
    });

    test('não deve substituir um valor indefinido ou nulo', () => {
      // Arrange, Given

      const valueAsUndefined = undefined;
      const valueAsNull = null;
      const inputTemplate = 'My empty value is: {0}';

      // Act, When

      const outputForUndefined = HelperText.querystring(inputTemplate, valueAsUndefined);
      const outputForNull = HelperText.querystring(inputTemplate, valueAsNull);

      // Assert, Then

      expect(outputForUndefined).toBe(inputTemplate);
      expect(outputForNull).toBe(inputTemplate);
    });
  });
});
