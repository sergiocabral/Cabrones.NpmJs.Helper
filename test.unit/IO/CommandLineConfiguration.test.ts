import { CommandLineConfiguration, InvalidArgumentError } from '../../ts';

describe('CommandLineConfiguration', () => {
  describe('Estáticos', () => {
    test('regexQuotes retorna RegExp corresponde às aspas no início e fim', () => {
      // Arrange, Given

      const quotes: [string, string] = ['((', ']]]'];
      const textMatched = '((aqui sim]]]';
      const textNotMatched = 'aqui ((não]]]';

      // Act, When

      const regex = CommandLineConfiguration.regexQuotes(quotes);
      const textMatchedResult = regex.test(textMatched);
      const textNotMatchedResult = regex.test(textNotMatched);

      // Assert, Then

      expect(textMatchedResult).toBe(true);
      expect(textNotMatchedResult).toBe(false);
    });
    test('regexAllQuotes retorna RegExp corresponde às aspas em todo o texto', () => {
      // Arrange, Given

      const quotes: [string, string] = ['<!--', '-->'];
      const value = Math.random().toString();
      const inputText = `<h1>Titulo <!--${value}1--> Principal</h1><!--${value}2-->`;
      const expectedMatches = 2;

      // Act, When

      const regex = CommandLineConfiguration.regexAllQuotes(quotes, 'g');
      const matches = inputText.match(regex);

      // Assert, Then

      expect(matches).toBeDefined();
      expect(matches?.length).toBe(expectedMatches);
      expect((matches as string[])[0]).toBe(
        quotes[0] + value + '1' + quotes[1]
      );
      expect((matches as string[])[1]).toBe(
        quotes[0] + value + '2' + quotes[1]
      );
    });
  });
  describe('Valores padrão', () => {
    test('caseInsensitiveForName', () => {
      // Arrange, Given

      const expectedValue = false;

      // Act, When

      const sut = new CommandLineConfiguration();

      // Assert, Then

      expect(sut.caseInsensitiveForName).toBe(expectedValue);
    });
    test('caseInsensitiveForValue', () => {
      // Arrange, Given

      const expectedValue = false;

      // Act, When

      const sut = new CommandLineConfiguration();

      // Assert, Then

      expect(sut.caseInsensitiveForValue).toBe(expectedValue);
    });
    test('attribution', () => {
      // Arrange, Given

      const expectedValue = '=';

      // Act, When

      const sut = new CommandLineConfiguration();

      // Assert, Then

      expect(sut.attribution).toBe(expectedValue);
    });
    test('quotes', () => {
      // Arrange, Given

      const expectedValue: Array<[string, string]> = [
        ['"', '"'],
        ["'", "'"],
        ['`', '`'],
        ['´', '´']
      ];

      // Act, When

      const sut = new CommandLineConfiguration();

      // Assert, Then

      expect(sut.quotes.length).toBe(expectedValue.length);
      for (let i = 0; i < sut.quotes.length; i++) {
        expect(sut.quotes[i]).toStrictEqual(expectedValue[i]);
      }
    });
  });
  describe('Informar propriedades no construtor da classe', () => {
    test('caseInsensitiveForName', () => {
      // Arrange, Given

      const expectedValue = true;

      // Act, When

      const sut = new CommandLineConfiguration({
        caseInsensitiveForName: expectedValue
      });

      // Assert, Then

      expect(sut.caseInsensitiveForName).toBe(expectedValue);
    });
    test('caseInsensitiveForValue', () => {
      // Arrange, Given

      const expectedValue = true;

      // Act, When

      const sut = new CommandLineConfiguration({
        caseInsensitiveForValue: expectedValue
      });

      // Assert, Then

      expect(sut.caseInsensitiveForValue).toBe(expectedValue);
    });
    test('attribution', () => {
      // Arrange, Given

      const expectedValue = Math.random().toString();

      // Act, When

      const sut = new CommandLineConfiguration({
        attribution: expectedValue
      });

      // Assert, Then

      expect(sut.attribution).toBe(expectedValue);
    });
    test('quotes', () => {
      // Arrange, Given

      const expectedValue: Array<[string, string]> = [['"', '"']];

      // Act, When

      const sut = new CommandLineConfiguration({
        quotes: expectedValue
      });

      // Assert, Then

      expect(sut.quotes).toStrictEqual(expectedValue);
    });
  });
  describe('Deve poder modificar as propriedades', () => {
    test('caseInsensitiveForName', () => {
      // Arrange, Given

      const sut = new CommandLineConfiguration();
      const initialValue = sut.caseInsensitiveForName;
      const newValue = !initialValue;

      // Act, When

      sut.caseInsensitiveForName = newValue;

      // Assert, Then

      expect(sut.caseInsensitiveForName).not.toBe(initialValue);
      expect(sut.caseInsensitiveForName).toBe(newValue);
    });
    test('caseInsensitiveForValue', () => {
      // Arrange, Given

      const sut = new CommandLineConfiguration();
      const initialValue = sut.caseInsensitiveForValue;
      const newValue = !initialValue;

      // Act, When

      sut.caseInsensitiveForValue = newValue;

      // Assert, Then

      expect(sut.caseInsensitiveForValue).not.toBe(initialValue);
      expect(sut.caseInsensitiveForValue).toBe(newValue);
    });
    test('attribution', () => {
      // Arrange, Given

      const sut = new CommandLineConfiguration();
      const initialValue = sut.attribution;
      const newValue = Math.random().toString();

      // Act, When

      sut.attribution = newValue;

      // Assert, Then

      expect(sut.attribution).not.toBe(initialValue);
      expect(sut.attribution).toBe(newValue);
    });
    test('quotes', () => {
      // Arrange, Given

      const sut = new CommandLineConfiguration();
      const initialValue = sut.quotes;
      const newValue: Array<[string, string]> = [
        ['[', ']'],
        ['<', '>']
      ];

      // Act, When

      sut.quotes = newValue;

      // Assert, Then

      expect(sut.quotes).not.toBe(initialValue);
      expect(sut.quotes).toStrictEqual(newValue);
    });
  });
  describe('Validação de valores', () => {
    test('attribution não pode ter espaços', () => {
      // Arrange, Given

      const sut = new CommandLineConfiguration();
      const emptyValue = ' := ';

      // Act, When

      const action = () => (sut.attribution = emptyValue);

      // Assert, Then

      expect(action).toThrow(InvalidArgumentError);
    });
    test('attribution não pode ser vazio', () => {
      // Arrange, Given

      const sut = new CommandLineConfiguration();
      const emptyValue = '';

      // Act, When

      const action = () => (sut.attribution = emptyValue);

      // Assert, Then

      expect(action).toThrow(InvalidArgumentError);
    });
    test('quotes não pode ser lista vazia', () => {
      // Arrange, Given

      const sut = new CommandLineConfiguration();
      const emptyValue: Array<[string, string]> = [];

      // Act, When

      const action = () => (sut.quotes = emptyValue);

      // Assert, Then

      expect(action).toThrow(InvalidArgumentError);
    });
    test('quotes, aspa esquerda não pode ser vazia', () => {
      // Arrange, Given

      const sut = new CommandLineConfiguration();
      const invalidValue: Array<[string, string]> = [['', '>']];

      // Act, When

      const action = () => (sut.quotes = invalidValue);

      // Assert, Then

      expect(action).toThrow(InvalidArgumentError);
    });
    test('quotes, aspa direita não pode ser vazia', () => {
      // Arrange, Given

      const sut = new CommandLineConfiguration();
      const invalidValue: Array<[string, string]> = [['<', '']];

      // Act, When

      const action = () => (sut.quotes = invalidValue);

      // Assert, Then

      expect(action).toThrow(InvalidArgumentError);
    });
  });
  describe('Testes para removeQuotes', () => {
    test('Remover aspas de um valor', () => {
      // Arrange, Given

      const sut = new CommandLineConfiguration({
        quotes: [['<!--', '-->']]
      });

      const textWithoutQuotes = Math.random().toString();
      const textWithQuotes = `<!--${textWithoutQuotes}-->`;

      // Act, When

      const result = sut.removeQuotes(textWithQuotes);

      // Assert, Then

      expect(result).toBe(textWithoutQuotes);
    });
  });
});
