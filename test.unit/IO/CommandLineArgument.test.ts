import { CommandLineArgument } from '../../ts';
import { ICommandLineConfiguration } from '../../ts/IO/ICommandLineConfiguration';

describe('CommandLineArgument', () => {
  describe('Teste da instância', function () {
    test('Instanciar classe sem parâmetros', () => {
      // Arrange, Given

      const expectedName = '';
      const expectedValue = undefined;

      // Act, When

      const sut = new CommandLineArgument();
      const receivedName = sut.name;
      const receivedValue = sut.value;

      // Assert, Then

      expect(receivedName).toBe(expectedName);
      expect(receivedValue).toBe(expectedValue);
    });
    test('Instanciar classe com commandLine', () => {
      // Arrange, Given

      const expectedName = '--coin';
      const expectedValue = 'BTC';
      const commandLine = `${expectedName}=${expectedValue}`;

      // Act, When

      const sut = new CommandLineArgument(commandLine);
      const receivedName = sut.name;
      const receivedValue = sut.value;

      // Assert, Then

      expect(receivedName).toBe(expectedName);
      expect(receivedValue).toBe(expectedValue);
    });
    test('Instanciar classe especificando configuration', () => {
      // Arrange, Given

      const configuration: ICommandLineConfiguration = {
        attribution: ':=',
        quotes: [
          ['(', ')'],
          ['[', ']']
        ]
      };
      const commandLineArgumentInput = 'arg1:=[value1, value2, value3]';
      const expectedToString = 'arg1:=(value1, value2, value3)';

      // Act, When

      const sut = new CommandLineArgument(
        commandLineArgumentInput,
        configuration
      );

      // Assert, Then

      expect(sut.toString()).toBe(expectedToString);
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

        const attribution = ':=';
        const quotes: Array<[string, string]> = [["'", "'"]];
        const nameSetted = Math.random().toString();
        const valueEmpty = '';
        const commandLineArgument = `${nameSetted}${attribution}${valueEmpty}`;

        const sut = new CommandLineArgument(commandLineArgument, {
          attribution,
          quotes
        });

        const expectedText = `${nameSetted}${attribution}${quotes[0][0]}${quotes[0][1]}`;

        // Act, When

        const asText = String(sut);

        // Assert, Then

        expect(asText).toBe(expectedText);
      });
      test('Nome com valor definido', () => {
        // Arrange, Given

        const attribution = ':=';
        const quotes: Array<[string, string]> = [['$(', ')']];
        const nameSetted = Math.random().toString();
        const valueSetted = Math.random().toString();
        const commandLineArgument = `${nameSetted}${attribution}${valueSetted}`;

        const sut = new CommandLineArgument(commandLineArgument, {
          attribution,
          quotes
        });

        const expectedText = `${nameSetted}${attribution}${quotes[0][0]}${valueSetted}${quotes[0][1]}`;

        // Act, When

        const asText = String(sut);

        // Assert, Then

        expect(asText).toBe(expectedText);
      });
      test('Nome com valor definido e atribuição com mais de um caracter', () => {
        // Arrange, Given

        const attribution = '===';
        const quotes: Array<[string, string]> = [["'", "'"]];

        const nameSetted = Math.random().toString();
        const valueSetted = Math.random().toString();
        const commandLineArgument = `${nameSetted}${attribution}${valueSetted}`;

        const sut = new CommandLineArgument(commandLineArgument, {
          attribution,
          quotes
        });

        const expectedText = `${nameSetted}${attribution}${quotes[0][0]}${valueSetted}${quotes[0][1]}`;

        // Act, When

        const asText = String(sut);

        // Assert, Then

        expect(asText).toBe(expectedText);
      });
      test('Nome com valor espaçado', () => {
        // Arrange, Given

        const attribution = '===';
        const quotes: Array<[string, string]> = [["'", "'"]];

        const nameSetted = Math.random().toString();
        const valueSpaced = `   ${Math.random().toString()}   `;
        const commandLineArgument = `${nameSetted}${attribution}${quotes[0][0]}${valueSpaced}${quotes[0][1]}`;

        const sut = new CommandLineArgument(commandLineArgument, {
          attribution,
          quotes
        });

        // Act, When

        const asText = String(sut);

        // Assert, Then

        expect(asText).toBe(commandLineArgument);
      });
      test('Nome seguido de atribuição mas sem valor', () => {
        // Arrange, Given

        const attribution = '=';
        const quotes: Array<[string, string]> = [["'", "'"]];

        const nameSetted = Math.random().toString();
        const commandLineArgument = `${nameSetted}${attribution}`;

        const sut = new CommandLineArgument(commandLineArgument, {
          attribution,
          quotes
        });

        const commandLineArgumentExpected = `${nameSetted}${attribution}${quotes[0][0]}${quotes[0][1]}`;

        // Act, When

        const asText = String(sut);

        // Assert, Then

        expect(asText).toBe(commandLineArgumentExpected);
      });
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
