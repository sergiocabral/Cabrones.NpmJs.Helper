import { CommandLine, CommandLineArgument } from '../../ts';

describe('CommandLine', () => {
  describe('Validações básicas', function () {
    test('Instanciar classe', () => {
      // Arrange, Given

      const commandLineText = 'arg1 arg2 arg3';

      // Act, When

      const sut = new CommandLine(commandLineText);

      // Assert, Then

      expect(sut.commandLine).toBe(commandLineText);
    });
    test('Manter ordem dos argumentos', () => {
      // Arrange, Given

      const commandLineText = 'arg3   arg2   arg1';
      const argsParsedExpected = commandLineText
        .split(/\s/)
        .filter(v => v)
        .join(' ');

      // Act, When

      const sut = new CommandLine(commandLineText);
      const argsParsed = sut.args.join(' ');

      // Assert, Then

      expect(argsParsed).toBe(argsParsedExpected);
    });
    test('Parse de nome e valor', () => {
      // Arrange, Given

      const nameSetted = Math.random().toString();
      const valueSetted = Math.random().toString();
      const commandLineText = `${nameSetted}${CommandLineArgument.attribution}${valueSetted}`;

      // Act, When

      const sut = new CommandLine(commandLineText);
      const argParsed = sut.args[0];

      // Assert, Then

      expect(argParsed).toBeDefined();
      expect(argParsed.name).toBe(nameSetted);
      expect(argParsed.value).toBe(valueSetted);
    });
    test('Parse de nome e valor vazio', () => {
      // Arrange, Given

      const nameSetted = Math.random().toString();
      const valueEmpty = '';
      const commandLineText = `${nameSetted}${CommandLineArgument.attribution}${valueEmpty}`;

      // Act, When

      const sut = new CommandLine(commandLineText);
      const argParsed = sut.args[0];

      // Assert, Then

      expect(argParsed).toBeDefined();
      expect(argParsed.name).toBe(nameSetted);
      expect(argParsed.value).toBe('');
    });
    test('Valor espaçado sem aspas deve ser considerado vazio', () => {
      // Arrange, Given

      const nameSetted = Math.random().toString();
      const valueEmpty = ' '.repeat(10);
      const commandLineText = `${nameSetted}${CommandLineArgument.attribution}${valueEmpty}`;

      // Act, When

      const sut = new CommandLine(commandLineText);
      const argParsed = sut.args[0];

      // Assert, Then

      expect(argParsed).toBeDefined();
      expect(argParsed.name).toBe(nameSetted);
      expect(argParsed.value).toBe('');
    });
    test('Valor espaçado com aspas deve ser considerado valor', () => {
      // Arrange, Given

      const nameSetted = Math.random().toString();
      const valueSpaced = ' '.repeat(10);
      const commandLineText = `${nameSetted}${CommandLineArgument.attribution}${CommandLineArgument.quote}${valueSpaced}${CommandLineArgument.quote}`;

      // Act, When

      const sut = new CommandLine(commandLineText);
      const argParsed = sut.args[0];

      // Assert, Then

      expect(argParsed).toBeDefined();
      expect(argParsed.name).toBe(nameSetted);
      expect(argParsed.value).toBe(valueSpaced);
    });
  });
  describe('Validações de negócio', () => {
    test('Um argumento com valor', () => {
      // Arrange, Given

      const commandLineText = '--name="go horse"';

      // Act, When

      const sut = new CommandLine(commandLineText);

      // Assert, Then

      expect(sut.args[0].name).toBe('--name');
      expect(sut.args[0].value).toBe('go horse');
    });
    test('Dois argumento com valor', () => {
      // Arrange, Given

      const commandLineText = '--name="go horse" -a=1';

      // Act, When

      const sut = new CommandLine(commandLineText);

      // Assert, Then

      expect(sut.args[0].name).toBe('--name');
      expect(sut.args[0].value).toBe('go horse');
      expect(sut.args[1].name).toBe('-a');
      expect(sut.args[1].value).toBe('1');
    });
    test('Dois argumento com valor e um sem valor', () => {
      // Arrange, Given

      const commandLineText = '--name="go horse" -a=1 --confirm';

      // Act, When

      const sut = new CommandLine(commandLineText);

      // Assert, Then

      expect(sut.args[0].name).toBe('--name');
      expect(sut.args[0].value).toBe('go horse');
      expect(sut.args[1].name).toBe('-a');
      expect(sut.args[1].value).toBe('1');
      expect(sut.args[2].name).toBe('--confirm');
      expect(sut.args[2].value).toBeUndefined();
    });
    test('Dois argumento com valor e um sem valor e outro apenas com atribuição', () => {
      // Arrange, Given

      const commandLineText = '--name="go horse" -a=1 --confirm --value=';

      // Act, When

      const sut = new CommandLine(commandLineText);

      // Assert, Then

      expect(sut.args[0].name).toBe('--name');
      expect(sut.args[0].value).toBe('go horse');
      expect(sut.args[1].name).toBe('-a');
      expect(sut.args[1].value).toBe('1');
      expect(sut.args[2].name).toBe('--confirm');
      expect(sut.args[2].value).toBeUndefined();
      expect(sut.args[3].name).toBe('--value');
      expect(sut.args[3].value).toBe('');
    });
    test('Argumento com espaços', () => {
      // Arrange, Given

      const commandLineText = '--spaces="    "';

      // Act, When

      const sut = new CommandLine(commandLineText);

      // Assert, Then

      expect(sut.args[0].name).toBe('--spaces');
      expect(sut.args[0].value).toBe('    ');
    });
  });
});
