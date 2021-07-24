import { HelperText } from '../../ts';

describe('Classe HelperText', () => {

  test('Instanciar apenas para ter 100% de cobertura', () => {
    // Arrange, Given

    // Act, When

    const instance = new HelperText();

    // Assert, Then

    expect(instance).toBeDefined();
  });

  test('escapeRegExp deve escapar uma string para expressão regular', () => {
    // Arrange, Given

    const regexSymbols = [
      '.',
      '*',
      '+',
      '?',
      '^',
      '$',
      '{',
      '}',
      '(',
      ')',
      '|',
      '[',
      ']',
      '\\'
    ];
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
});
