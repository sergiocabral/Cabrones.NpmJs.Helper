import { CommandLine } from '../../ts';
import { ICommandLineConfiguration } from '../../ts/IO/ICommandLineConfiguration';

describe('CommandLine', () => {
  describe('Validações básicas', function () {
    test('Instanciar classe sem configuration', () => {
      // Arrange, Given

      const commandLineText = 'arg1 arg2 arg3';

      // Act, When

      const sut = new CommandLine(commandLineText);

      // Assert, Then

      expect(sut.commandLine).toBe(commandLineText);
    });
    test('Instanciar classe com configuration', () => {
      // Arrange, Given

      const configuration: ICommandLineConfiguration = {
        attribution: ':=',
        quotes: [
          ['[', ']'],
          ['(', ')'],
          ['"', '"']
        ]
      };
      const commandLineInput = 'exec name:="sergio cabral" list:=(123,456,789)';
      const expectedToString = 'exec name:=[sergio cabral] list:=[123,456,789]';

      // Act, When

      const sut = new CommandLine(commandLineInput, configuration);

      // Assert, Then

      expect(sut.toString()).toBe(expectedToString);
    });
  });
  describe('Validações de valores', () => {
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

      const attribution = '=';
      const nameSetted = Math.random().toString();
      const valueSetted = Math.random().toString();
      const commandLineText = `${nameSetted}${attribution}${valueSetted}`;

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

      const attribution = '=';
      const nameSetted = Math.random().toString();
      const valueEmpty = '';
      const commandLineText = `${nameSetted}${attribution}${valueEmpty}`;

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

      const attribution = '=';
      const nameSetted = Math.random().toString();
      const valueEmpty = ' '.repeat(10);
      const commandLineText = `${nameSetted}${attribution}${valueEmpty}`;

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

      const attribution = '=';
      const quote = '"';
      const nameSetted = Math.random().toString();
      const valueSpaced = ' '.repeat(10);
      const commandLineText = `${nameSetted}${attribution}${quote}${valueSpaced}${quote}`;

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
    test('Obter valores da argumentos com mesma aspa', () => {
      // Arrange, Given

      const sut = new CommandLine(
        'exec --coin="0.1 BTC" --coin="0.1 ETH" --coin="0.1 XMR"'
      );

      // Act, When

      const values = sut.getArgumentValues('--coin');

      // Assert, Then

      expect(values).toStrictEqual(['0.1 BTC', '0.1 ETH', '0.1 XMR']);
    });
  });
  describe('Validações de busca por argumentos e valores', () => {
    test('caseInsensitiveForName', () => {
      // Arrange, Given

      const argName = '--Arg1';

      const sut = new CommandLine(argName);

      // Act, When

      const normalExpectedTrue = sut.hasArgumentName(argName);

      const lowerExpectedFalseBeforeCaseInsensitiveForName =
        sut.hasArgumentName(argName.toLowerCase());
      const upperExpectedFalseBeforeCaseInsensitiveForName =
        sut.hasArgumentName(argName.toUpperCase());

      sut.configuration.caseInsensitiveForName = true;

      const lowerExpectedTrueAfterCaseInsensitiveForName = sut.hasArgumentName(
        argName.toLowerCase()
      );
      const upperExpectedTrueAfterCaseInsensitiveForName = sut.hasArgumentName(
        argName.toUpperCase()
      );

      // Assert, Then

      expect(normalExpectedTrue).toBe(true);
      expect(lowerExpectedFalseBeforeCaseInsensitiveForName).toBe(false);
      expect(upperExpectedFalseBeforeCaseInsensitiveForName).toBe(false);
      expect(lowerExpectedTrueAfterCaseInsensitiveForName).toBe(true);
      expect(upperExpectedTrueAfterCaseInsensitiveForName).toBe(true);
    });
    test('caseInsensitiveForValue quando não é undefined', () => {
      // Arrange, Given

      const argValueText = 'Value';

      const sut = new CommandLine(`--arg=${argValueText}`);

      // Act, When

      const normalExpectedTrue = sut.hasArgumentValue(argValueText);

      const lowerExpectedFalseBeforeCaseInsensitiveForValue =
        sut.hasArgumentValue(argValueText.toLowerCase());
      const upperExpectedFalseBeforeCaseInsensitiveForValue =
        sut.hasArgumentValue(argValueText.toUpperCase());

      sut.configuration.caseInsensitiveForValue = true;

      const lowerExpectedTrueAfterCaseInsensitiveForValue =
        sut.hasArgumentValue(argValueText.toLowerCase());
      const upperExpectedTrueAfterCaseInsensitiveForValue =
        sut.hasArgumentValue(argValueText.toUpperCase());

      // Assert, Then

      expect(normalExpectedTrue).toBe(true);
      expect(lowerExpectedFalseBeforeCaseInsensitiveForValue).toBe(false);
      expect(upperExpectedFalseBeforeCaseInsensitiveForValue).toBe(false);
      expect(lowerExpectedTrueAfterCaseInsensitiveForValue).toBe(true);
      expect(upperExpectedTrueAfterCaseInsensitiveForValue).toBe(true);
    });
    test('caseInsensitiveForValue quando undefined', () => {
      // Arrange, Given

      const sut = new CommandLine(`--arg`);

      // Act, When

      const expectedTrueBeforeCaseInsensitiveForValue =
        sut.hasArgumentValue(undefined);

      sut.configuration.caseInsensitiveForValue = true;

      const expectedTrueAfterCaseInsensitiveForValue =
        sut.hasArgumentValue(undefined);

      // Assert, Then

      expect(expectedTrueBeforeCaseInsensitiveForValue).toBe(true);
      expect(expectedTrueAfterCaseInsensitiveForValue).toBe(true);
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

      const nameAndValueExistsAsText = sut.hasArgumentNameWithValue(
        ['--coin'],
        ['BTC']
      );
      const nameAndValueExistsAsUndefined = sut.hasArgumentNameWithValue(
        ['--price'],
        [undefined]
      );
      const nameExistsValueNotExists = sut.hasArgumentNameWithValue(
        ['--coin'],
        ['ETH']
      );
      const nameNotExistsValueExists = sut.hasArgumentNameWithValue(
        ['--price'],
        ['BTC']
      );

      // Assert, Then

      expect(nameAndValueExistsAsText).toBe(true);
      expect(nameAndValueExistsAsUndefined).toBe(true);
      expect(nameExistsValueNotExists).toBe(false);
      expect(nameNotExistsValueExists).toBe(false);
    });
    describe('Teste de métodos com spread array', () => {
      test('hasArgumentName', () => {
        // Arrange, Given

        const sut = new CommandLine('--coin=BTC --coin=ETH --coin=XMR');

        // Act, When

        const expectedFalse = sut.hasArgumentName('--price', '--amount');
        const expectedTrue = sut.hasArgumentName('--price', '--coin');
        const emptyListExpectedFalse = sut.hasArgumentName();

        // Assert, Then

        expect(expectedFalse).toBe(false);
        expect(expectedTrue).toBe(true);
        expect(emptyListExpectedFalse).toBe(false);
      });
      test('hasArgumentValue', () => {
        // Arrange, Given

        const sut = new CommandLine('--arg1=BCH --arg2=ETH --arg3=XMR');

        // Act, When

        const expectedFalse = sut.hasArgumentValue('BTC', 'DOGE');
        const expectedTrue = sut.hasArgumentValue('BTC', 'ETH');
        const emptyListExpectedFalse = sut.hasArgumentValue();

        // Assert, Then

        expect(expectedFalse).toBe(false);
        expect(expectedTrue).toBe(true);
        expect(emptyListExpectedFalse).toBe(false);
      });
      test('getArgumentValue', () => {
        // Arrange, Given

        const sut = new CommandLine('--coin=BTC --coin=ETH --coin=XMR');

        // Act, When

        const nonExistentValue = sut.getArgumentValue('--price', '--amount');
        const existentValue = sut.getArgumentValue('--price', '--coin');
        const emptyList = sut.getArgumentValue();

        // Assert, Then

        expect(nonExistentValue).toBeUndefined();
        expect(existentValue).toBe('BTC');
        expect(emptyList).toBeUndefined();
      });
      test('getArgumentValues', () => {
        // Arrange, Given

        const sut = new CommandLine(
          '--coin=BTC --coin=ETH --coin --coin=XMR --destination=USDT'
        );

        // Act, When

        const nonExistentValues = sut.getArgumentValues('--price', '--amount');
        const existentValues = sut.getArgumentValues(
          '--coin',
          '--price',
          '--destination'
        );
        const emptyList = sut.getArgumentValues();

        // Assert, Then

        expect(nonExistentValues.length).toBe(0);
        expect(existentValues.length).toBe(5);
        expect(existentValues).toStrictEqual([
          'BTC',
          'ETH',
          undefined,
          'XMR',
          'USDT'
        ]);
        expect(emptyList.length).toBe(0);
      });
      test('hasArgumentNameWithValue', () => {
        // Arrange, Given

        const sut = new CommandLine(
          '--coin=BTC --token=BTC --price=10 --price=20 --origin --destination'
        );

        // Act, When

        const expectedTrueForMultipleArg = sut.hasArgumentNameWithValue(
          ['--coin', '--token'],
          ['BTC']
        );
        const expectedFalseForMultipleArg = sut.hasArgumentNameWithValue(
          ['--coin', '--token'],
          ['ETH']
        );
        const expectedTrueForMultipleValue = sut.hasArgumentNameWithValue(
          ['--price'],
          ['10', '20']
        );
        const expectedFalseForMultipleValue = sut.hasArgumentNameWithValue(
          ['--price'],
          ['70', '80']
        );
        const expectedTrueForMultipleArgUndefined =
          sut.hasArgumentNameWithValue(
            ['--origin', '--destination'],
            [undefined]
          );
        const expectedFalseForMultipleArgUndefined =
          sut.hasArgumentNameWithValue(['--coin', '--token'], [undefined]);
        const emptyListForArgs = sut.hasArgumentNameWithValue([], ['BTC']);
        const emptyListForValues = sut.hasArgumentNameWithValue(['--coin'], []);

        // Assert, Then

        expect(expectedTrueForMultipleArg).toBe(true);
        expect(expectedFalseForMultipleArg).toBe(false);
        expect(expectedTrueForMultipleValue).toBe(true);
        expect(expectedFalseForMultipleValue).toBe(false);
        expect(expectedTrueForMultipleArgUndefined).toBe(true);
        expect(expectedFalseForMultipleArgUndefined).toBe(false);
        expect(emptyListForArgs).toBe(false);
        expect(emptyListForValues).toBe(false);
      });
    });
  });
});
