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
    test('CaseInsensitive por padrão é false', () => {
      // Arrange, Given

      const caseInsensitiveExpected = false;
      const sut = new CommandLine(Math.random().toString());

      // Act, When

      const caseInsensitiveReceived = sut.caseInsensitive;

      // Assert, Then

      expect(caseInsensitiveReceived).toBe(caseInsensitiveExpected);
    });
    test('CaseInsensitive pode ser modificador no construtor', () => {
      // Arrange, Given

      const caseInsensitiveSetted = true;

      // Act, When

      const sut = new CommandLine(
        Math.random().toString(),
        caseInsensitiveSetted
      );
      const caseInsensitiveReceived = sut.caseInsensitive;

      // Assert, Then

      expect(caseInsensitiveReceived).toBe(caseInsensitiveSetted);
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
  describe('Validações de argumentos em geral', () => {
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
    test('comando e argumentos em geral', () => {
      // Arrange, Given

      const commandLineText = 'comand --arg1 -a2';

      // Act, When

      const sut = new CommandLine(commandLineText);

      // Assert, Then

      expect(sut.args[0].name).toBe('comand');
      expect(sut.args[1].name).toBe('--arg1');
      expect(sut.args[2].name).toBe('-a2');
    });
  });
  describe('Validações de busca por argumentos e valores', () => {
    test('caseInsensitive', () => {
      // Arrange, Given

      const argName = '--Arg1';

      const sut = new CommandLine(argName);

      // Act, When

      const normalExpectedTrue = sut.hasArgumentName(argName);

      const lowerExpectedFalseBeforeCaseInsensitive = sut.hasArgumentName(
        argName.toLowerCase()
      );
      const upperExpectedFalseBeforeCaseInsensitive = sut.hasArgumentName(
        argName.toUpperCase()
      );

      sut.caseInsensitive = true;

      const lowerExpectedFalseAfterCaseInsensitive = sut.hasArgumentName(
        argName.toLowerCase()
      );
      const upperExpectedFalseAfterCaseInsensitive = sut.hasArgumentName(
        argName.toUpperCase()
      );

      // Assert, Then

      expect(normalExpectedTrue).toBe(true);
      expect(lowerExpectedFalseBeforeCaseInsensitive).toBe(false);
      expect(upperExpectedFalseBeforeCaseInsensitive).toBe(false);
      expect(lowerExpectedFalseAfterCaseInsensitive).toBe(true);
      expect(upperExpectedFalseAfterCaseInsensitive).toBe(true);
    });
    test('hasArgumentName', () => {
      // Arrange, Given

      const sut = new CommandLine('--coin=BTC --coin=ETH --coin=XMR');

      // Act, When

      const hasArgumentExpectedFalse = sut.hasArgumentName('--price');
      const hasArgumentExpectedTrue = sut.hasArgumentName('--coin');

      // Assert, Then

      expect(hasArgumentExpectedFalse).toBe(false);
      expect(hasArgumentExpectedTrue).toBe(true);
    });
    test('hasArgumentValue', () => {
      // Arrange, Given

      const sut = new CommandLine('--arg1=BCH --arg2=ETH --arg3=XMR');

      // Act, When

      const hasValueExpectedFalse = sut.hasArgumentValue('BTC');
      const hasValueExpectedTrue = sut.hasArgumentValue('ETH');

      // Assert, Then

      expect(hasValueExpectedFalse).toBe(false);
      expect(hasValueExpectedTrue).toBe(true);
    });
    test('hasArgumentValue para undefined', () => {
      // Arrange, Given

      const sutWithUndefined = new CommandLine('--WithUndefined');
      const sutWithoutUndefined = new CommandLine(
        '--WithoutUndefined="has value"'
      );

      // Act, When

      const hasValueExpectedTrue = sutWithUndefined.hasArgumentValue(undefined);
      const hasValueExpectedFalse =
        sutWithoutUndefined.hasArgumentValue(undefined);

      // Assert, Then

      expect(hasValueExpectedFalse).toBe(false);
      expect(hasValueExpectedTrue).toBe(true);
    });
    test('getArgumentValue', () => {
      // Arrange, Given

      const sut = new CommandLine('--coin=BTC --coin=ETH --coin=XMR');

      // Act, When

      const nonExistentValue = sut.getArgumentValue('--price');
      const existentValue = sut.getArgumentValue('--coin');

      // Assert, Then

      expect(nonExistentValue).toBeUndefined();
      expect(existentValue).toBe('BTC');
    });
    test('getArgumentValues', () => {
      // Arrange, Given

      const sut = new CommandLine('--coin=BTC --coin=ETH --coin --coin=XMR');

      // Act, When

      const nonExistentValues = sut.getArgumentValues('--price');
      const existentValues = sut.getArgumentValues('--coin');

      // Assert, Then

      expect(nonExistentValues.length).toBe(0);
      expect(existentValues.length).toBe(4);
      expect(existentValues).toStrictEqual(['BTC', 'ETH', undefined, 'XMR']);
    });
    test('hasArgumentNameWithValue', () => {
      // Arrange, Given

      const sut = new CommandLine('--coin=BTC --price');

      // Act, When

      const nameAndValueExistsAsText = sut.hasArgumentNameWithValue('--coin', 'BTC');
      const nameAndValueExistsAsUndefined = sut.hasArgumentNameWithValue('--price', undefined);
      const nameExistsValueNotExists = sut.hasArgumentNameWithValue('--coin', 'ETH');
      const nameNotExistsValueExists = sut.hasArgumentNameWithValue('--price', 'BTC');

      // Assert, Then

      expect(nameAndValueExistsAsText).toBe(true);
      expect(nameAndValueExistsAsUndefined).toBe(true);
      expect(nameExistsValueNotExists).toBe(false);
      expect(nameNotExistsValueExists).toBe(false);
    });
  });
});
