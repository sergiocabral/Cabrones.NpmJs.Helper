import { CommandLineArgument, InvalidArgumentError, KeyValue } from '../../ts';

describe('CommandLineArgument', () => {
  const originals: KeyValue<any> = {};

  beforeEach(() => {
    originals['CommandLineArgument.attribution'] =
      CommandLineArgument.attribution;
    originals['CommandLineArgument.quotes'] = CommandLineArgument.quotes;
  });

  afterEach(() => {
    CommandLineArgument.attribution =
      originals['CommandLineArgument.attribution'];
    CommandLineArgument.quotes = originals['CommandLineArgument.quotes'];
  });

  describe('Teste para static', function () {
    describe('Caracter de atribuição', () => {
      test('Valor padrão é =', () => {
        // Arrange, Given

        const defaultValue = '=';

        // Act, When

        const receivedValue = CommandLineArgument.attribution;

        // Assert, Then

        expect(receivedValue).toBe(defaultValue);
      });
      test('Deve ser possível trocar o valor padrão', () => {
        // Arrange, Given

        const originalValue = CommandLineArgument.attribution;
        const newValue = Buffer.from(Math.random().toString()).toString(
          'base64'
        )[10];

        // Act, When

        CommandLineArgument.attribution = newValue;
        const receivedValue = CommandLineArgument.attribution;

        // Assert, Then

        expect(receivedValue).toBe(newValue);
        expect(receivedValue).not.toBe(originalValue);
      });
      test('Não aceita vazio', () => {
        // Arrange, Given

        const emptyValue = '';
        const emptySpaced = ' '.repeat(10);

        // Act, When

        const defineEmpty = () =>
          (CommandLineArgument.attribution = emptyValue);
        const defineSpaced = () =>
          (CommandLineArgument.attribution = emptySpaced);

        // Assert, Then

        expect(defineEmpty).toThrow(InvalidArgumentError);
        expect(defineSpaced).toThrow(InvalidArgumentError);
      });
      test('Aceita múltiplos caracteres', () => {
        // Arrange, Given

        const newValue = '===';
        const newValueWithSpaces = `   ${newValue}   `;

        // Act, When

        CommandLineArgument.attribution = newValue;
        const receivedValue = CommandLineArgument.attribution;
        CommandLineArgument.attribution = newValueWithSpaces;
        const receivedValueWithSpace = CommandLineArgument.attribution;

        // Assert, Then

        expect(newValue).not.toBe(newValueWithSpaces);
        expect(receivedValue).toBe(newValue);
        expect(receivedValueWithSpace).toBe(newValue);
      });
    });
    describe('Caracteres delimitadores de texto', () => {
      test('Valor padrão', () => {
        // Arrange, Given

        const expectedValue = ['´', "'", '`', '"'].sort();

        // Act, When

        const receivedValue = CommandLineArgument.quotes;

        // Assert, Then

        expect(receivedValue.sort()).toEqual(expectedValue);
      });
      test('Permite modificar a lista', () => {
        // Arrange, Given

        const originalList = CommandLineArgument.quotes.join('');
        const newList = ['a', 'b', 'c'];

        // Act, When

        CommandLineArgument.quotes = newList;
        const receivedList = CommandLineArgument.quotes.join('');

        // Assert, Then

        expect(originalList).not.toEqual(newList.join(''));
        expect(receivedList).toEqual(newList.join(''));
      });
      test('O delimitador padrão é o primeiro da lista', () => {
        // Arrange, Given

        const expectedDefaultQuote = "'";
        CommandLineArgument.quotes = [expectedDefaultQuote, '`'];

        // Act, When

        const receivedDefaultQuote = CommandLineArgument.quote;

        // Assert, Then

        expect(receivedDefaultQuote).toEqual(expectedDefaultQuote);
      });
      test('Não aceita lista vazia', () => {
        // Arrange, Given

        const emptyList = Array<string>();
        const spacedList = Array<string>('   ', ' ');

        // Act, When

        const defineEmptyList = () => (CommandLineArgument.quotes = emptyList);
        const defineSpacedList = () =>
          (CommandLineArgument.quotes = spacedList);

        // Assert, Then

        expect(defineEmptyList).toThrow(InvalidArgumentError);
        expect(defineSpacedList).toThrow(InvalidArgumentError);
      });
      test('Não aceita delimitador com múltiplos caracteres', () => {
        // Arrange, Given

        const multipleCharacterList = ['123'];

        // Act, When

        const defineMultipleCharacterList = () =>
          (CommandLineArgument.quotes = multipleCharacterList);

        // Assert, Then

        expect(defineMultipleCharacterList).toThrow(InvalidArgumentError);
      });
    });
  });
  describe('Teste da instância', function () {
    test('Instanciar classe', () => {
      // Arrange, Given

      const nameSetted = Math.random().toString();
      const valueSetted = Math.random().toString();
      const commandLineArgument = `${nameSetted}${CommandLineArgument.attribution}${valueSetted}`;

      // Act, When

      const sut = new CommandLineArgument(commandLineArgument);
      const nameReceived = sut.name;
      const valueReceived = sut.value;

      // Assert, Then

      expect(nameReceived).toBe(nameSetted);
      expect(valueReceived).toBe(valueSetted);
    });
    describe('toString() - Representação como texto', () => {
      test('Apenas nome', () => {
        // Arrange, Given

        const nameSetted = Math.random().toString();
        const sut = new CommandLineArgument(nameSetted);

        // Act, When

        const asText = String(sut);

        // Assert, Then

        expect(asText).toBe(nameSetted);
      });
      test('Nome com valor vazio', () => {
        // Arrange, Given

        const nameSetted = Math.random().toString();
        const valueEmpty = '';
        const commandLineArgument = `${nameSetted}${CommandLineArgument.attribution}${valueEmpty}`;

        const sut = new CommandLineArgument(commandLineArgument);

        const expectedText = `${nameSetted}${CommandLineArgument.attribution}${CommandLineArgument.quote}${CommandLineArgument.quote}`;

        // Act, When

        const asText = String(sut);

        // Assert, Then

        expect(asText).toBe(expectedText);
      });
      test('Nome com valor definido', () => {
        // Arrange, Given

        const nameSetted = Math.random().toString();
        const valueSetted = Math.random().toString();
        const commandLineArgument = `${nameSetted}${CommandLineArgument.attribution}${valueSetted}`;

        const sut = new CommandLineArgument(commandLineArgument);

        const expectedText = `${nameSetted}${CommandLineArgument.attribution}${CommandLineArgument.quote}${valueSetted}${CommandLineArgument.quote}`;

        // Act, When

        const asText = String(sut);

        // Assert, Then

        expect(asText).toBe(expectedText);
      });
      test('Nome com valor definido e atribuição com mais de um caracter', () => {
        // Arrange, Given

        const attribution = '===';
        CommandLineArgument.attribution = `   ${attribution}   `;

        const nameSetted = Math.random().toString();
        const valueSetted = Math.random().toString();
        const commandLineArgument = `${nameSetted}${CommandLineArgument.attribution}${valueSetted}`;

        const sut = new CommandLineArgument(commandLineArgument);

        const expectedText = `${nameSetted}${attribution}${CommandLineArgument.quote}${valueSetted}${CommandLineArgument.quote}`;

        // Act, When

        const asText = String(sut);

        // Assert, Then

        expect(asText).toBe(expectedText);
      });
      test('Nome com valor espaçado', () => {
        // Arrange, Given

        const nameSetted = Math.random().toString();
        const valueSpaced = `   ${Math.random().toString()}   `;
        const commandLineArgument = `${nameSetted}${CommandLineArgument.attribution}${CommandLineArgument.quote}${valueSpaced}${CommandLineArgument.quote}`;

        const sut = new CommandLineArgument(commandLineArgument);

        // Act, When

        const asText = String(sut);

        // Assert, Then

        expect(asText).toBe(commandLineArgument);
      });
      test('Nome seguido de atribuição mas sem valor', () => {
        // Arrange, Given

        const nameSetted = Math.random().toString();
        const commandLineArgument = `${nameSetted}${CommandLineArgument.attribution}`;

        const sut = new CommandLineArgument(commandLineArgument);

        const commandLineArgumentExpected = `${nameSetted}${CommandLineArgument.attribution}${CommandLineArgument.quote}${CommandLineArgument.quote}`;

        // Act, When

        const asText = String(sut);

        // Assert, Then

        expect(asText).toBe(commandLineArgumentExpected);
      });
    });
    describe('Testes de negócio', () => {
      test('Aspas dentro de aspas', () => {
        // Arrange, Given

        const commandLineArgument = `--param="abc'123"`;

        // Act, When

        const sut = new CommandLineArgument(commandLineArgument);

        // Assert, Then

        expect(sut.name).toBe('--param');
        expect(sut.value).toBe(`abc'123`);
      });
      test('Aspas não fechada pega até o final', () => {
        // Arrange, Given

        const commandLineArgument = `--param="começou --mas='nao' -terminou`;

        // Act, When

        const sut = new CommandLineArgument(commandLineArgument);

        // Assert, Then

        expect(sut.name).toBe('--param');
        expect(sut.value).toBe(`"começou --mas='nao' -terminou`);
      });
    });
  });
});
