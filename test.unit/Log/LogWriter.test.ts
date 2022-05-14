import { HelperText, ILogMessage, LogLevel, LogWriter } from '../../ts';

class LogWriterToTest extends LogWriter {
  public customFactoryMessage?: (message: ILogMessage) => string;
  public mockWrite = jest.fn();
  protected write(
    message: ILogMessage,
    messageTemplate: string,
    values?: unknown
  ): void {
    super.factoryMessage(message);
    this.mockWrite(message, messageTemplate, values);
  }
}

describe('Class LogWriter', () => {
  const originals: Record<string, any> = {};

  beforeEach(() => {
    originals['LogWriter.minimumLevel'] = LogWriter.minimumLevel;
    originals['LogWriter.defaultLogLevel'] = LogWriter.defaultLogLevel;
    originals['HelperText.querystring'] = HelperText.querystring;
    originals['LogWriter.mergeValues'] = LogWriter.mergeValues;
  });

  afterEach(() => {
    LogWriter.minimumLevel = originals['LogWriter.minimumLevel'];
    LogWriter.defaultLogLevel = originals['LogWriter.defaultLogLevel'];
    HelperText.querystring = originals['HelperText.querystring'];
    LogWriter.mergeValues = originals['LogWriter.mergeValues'];
  });

  describe('Testes da classe estática', () => {
    test('minimumLevel padrão deve ser Verbose', () => {
      // Arrange, Given

      const expectedMinimumLevel = LogLevel.Verbose;

      // Act, When

      const initialMinimumLevel = LogWriterToTest.minimumLevel;

      // Assert, Then

      expect(initialMinimumLevel).toBe(expectedMinimumLevel);
    });
    test('defaultLogLevel padrão deve ser Debug', () => {
      // Arrange, Given

      const expectedDefaultLogLevel = LogLevel.Debug;

      // Act, When

      const initialDefaultLogLevel = LogWriterToTest.defaultLogLevel;

      // Assert, Then

      expect(initialDefaultLogLevel).toBe(expectedDefaultLogLevel);
    });
    describe('Formatação da mensagem', () => {
      test('Exibir data, level, seção e mensagem', () => {
        // Arrange, Given

        const message: ILogMessage = {
          timestamp: new Date(),
          level: LogLevel.Verbose,
          section: Math.random().toString(),
          message: Math.random().toString()
        };

        const expectedOutputMessage = `${message.timestamp.format({
          mask: 'universal'
        })} [${LogLevel[message.level] + ': ' + message.section}] ${
          message.message
        }`;

        // Act, When

        const outputMessage = LogWriter.factoryMessage(message);

        // Assert, Then

        expect(outputMessage).toBe(expectedOutputMessage);
      });
      test('Exibir data, level e mensagem (sem seção)', () => {
        // Arrange, Given

        const message: ILogMessage = {
          timestamp: new Date(),
          level: LogLevel.Verbose,
          section: '',
          message: Math.random().toString()
        };

        const expectedOutputMessage = `${message.timestamp.format({
          mask: 'universal'
        })} [${LogLevel[message.level]}] ${message.message}`;

        // Act, When

        const outputMessage = LogWriter.factoryMessage(message);

        // Assert, Then

        expect(outputMessage).toBe(expectedOutputMessage);
      });
      test('Deve usar o construtor padrão de mensagem se nenhum for especificado', () => {
        // Arrange, Given

        const message = `${Math.random().toString()} {0}`;
        const values = [Math.random()];
        const logLevel = LogLevel.Critical;
        const section = Math.random().toString();

        const mockFactoryMessage = jest.fn();
        LogWriter.factoryMessage = mockFactoryMessage;
        const sut = new LogWriterToTest();

        // Act, When

        sut.post(message, values, logLevel, section);

        // Assert, Then

        expect(mockFactoryMessage).toBeCalledTimes(1);
        const logMessage = mockFactoryMessage.mock.calls[0][0] as ILogMessage;
        expect(logMessage.message).toBe(message.querystring(values));
        expect(logMessage.level).toBe(logLevel);
        expect(logMessage.section).toBe(section);
      });
      test('Deve usar o construtor customizado se especificado', () => {
        // Arrange, Given

        const message = `${Math.random().toString()} {0}`;
        const values = [Math.random()];
        const logLevel = LogLevel.Critical;
        const section = Math.random().toString();

        const mockFactoryMessage = jest.fn();
        const mockCustomFactoryMessage = jest.fn();
        const sut = new LogWriterToTest();
        LogWriter.factoryMessage = mockFactoryMessage;
        sut.customFactoryMessage = mockCustomFactoryMessage;

        // Act, When

        sut.post(message, values, logLevel, section);

        // Assert, Then

        expect(mockFactoryMessage).toBeCalledTimes(0);
        expect(mockCustomFactoryMessage).toBeCalledTimes(1);
        const logMessage = mockCustomFactoryMessage.mock
          .calls[0][0] as ILogMessage;
        expect(logMessage.message).toBe(message.querystring(values));
        expect(logMessage.level).toBe(logLevel);
        expect(logMessage.section).toBe(section);
      });
    });
  });

  describe('Teste de instância', () => {
    describe('Propriedades de configuração da instância', () => {
      test('minimumLevel deve por padrão ter o valor da classe estática', () => {
        // Arrange, Given

        const initialMinimumLevel = LogWriter.minimumLevel;

        const newMinimumLevel = initialMinimumLevel + 1;
        LogWriter.minimumLevel = newMinimumLevel;

        // Act, When

        const sut = new LogWriterToTest();

        // Assert, Then

        expect(sut.minimumLevel).not.toBe(initialMinimumLevel);
        expect(sut.minimumLevel).toBe(newMinimumLevel);
      });
      test('defaultLogLevel deve por padrão ter o valor da classe estática', () => {
        // Arrange, Given

        const initialDefaultLogLevel = LogWriter.defaultLogLevel;

        const newDefaultLogLevel = initialDefaultLogLevel + 1;
        LogWriter.defaultLogLevel = newDefaultLogLevel;

        // Act, When

        const sut = new LogWriterToTest();

        // Assert, Then

        expect(sut.defaultLogLevel).not.toBe(initialDefaultLogLevel);
        expect(sut.defaultLogLevel).toBe(newDefaultLogLevel);
      });
      test('minimumLevel pode ser definido manualmente', () => {
        // Arrange, Given

        const initialMinimumLevel = LogWriter.minimumLevel;

        const definedMinimumLevel = initialMinimumLevel + 1;

        // Act, When

        const sut = new LogWriterToTest(definedMinimumLevel);

        // Assert, Then

        expect(sut.minimumLevel).not.toBe(initialMinimumLevel);
        expect(sut.minimumLevel).toBe(definedMinimumLevel);
      });
      test('defaultLogLevel pode ser definido manualmente', () => {
        // Arrange, Given

        const initialDefaultLogLevel = LogWriter.defaultLogLevel;

        const definedDefaultLogLevel = initialDefaultLogLevel + 1;

        // Act, When

        const sut = new LogWriterToTest(
          LogWriter.minimumLevel,
          definedDefaultLogLevel
        );

        // Assert, Then

        expect(sut.defaultLogLevel).not.toBe(initialDefaultLogLevel);
        expect(sut.defaultLogLevel).toBe(definedDefaultLogLevel);
      });
    });
    describe('Função post', () => {
      test('Se não informar o level deve usar o defaultLogLevel', () => {
        // Arrange, Given

        const defaultLogLevel = LogLevel.Warning;
        const sut = new LogWriterToTest(LogLevel.Verbose, defaultLogLevel);

        // Act, When

        sut.post('log message');

        // Assert, Then

        expect(sut.mockWrite.mock.calls.length).toBe(1);
        expect(sut.mockWrite.mock.calls[0][0]).not.toBe(defaultLogLevel);
      });
      test('Só escreve se o level for maior igual que minimumLevel', () => {
        // Arrange, Given

        const minimumLevel = LogLevel.Debug;
        const belowMinimumLevel = LogLevel.Debug - 1;
        const aboveMinimumLevel = LogLevel.Debug + 1;
        const sut = new LogWriterToTest(minimumLevel);

        // Act, When

        sut.post('log message', undefined, belowMinimumLevel);
        sut.post('log message', undefined, minimumLevel);
        sut.post('log message', undefined, aboveMinimumLevel);

        // Assert, Then

        expect(sut.mockWrite.mock.calls.length).toBe(2);
        expect(sut.mockWrite.mock.calls[0][0]).not.toBe(belowMinimumLevel);
        expect(sut.mockWrite.mock.calls[1][0]).not.toBe(belowMinimumLevel);
        expect(sut.mockWrite.mock.calls[0][0].level).toBe(minimumLevel);
        expect(sut.mockWrite.mock.calls[1][0].level).toBe(aboveMinimumLevel);
      });
      test('messageTemplate deve aceitar string ou função que retorna string', () => {
        // Arrange, Given

        const expectedText = Math.random().toString();
        const sut = new LogWriterToTest();

        // Act, When

        sut.post(expectedText);
        sut.post(() => expectedText);

        // Assert, Then

        expect(sut.mockWrite.mock.calls.length).toBe(2);
        expect(sut.mockWrite.mock.calls[0][0].message).toBe(expectedText);
        expect(sut.mockWrite.mock.calls[1][0].message).toBe(expectedText);
      });
      test('values deve aceitar valores ou função que retorna valores', () => {
        // Arrange, Given

        const mockQuerystring = jest.fn();
        HelperText.querystring = mockQuerystring;

        const expectedValue = Math.random().toString();

        const sut = new LogWriterToTest();

        // Act, When

        sut.post('log message', expectedValue);
        sut.post('log message', () => expectedValue);

        // Assert, Then

        expect(mockQuerystring.mock.calls.length).toBe(2);
        expect(mockQuerystring.mock.calls[0][1]).toBe(expectedValue);
        expect(mockQuerystring.mock.calls[1][1]).toBe(expectedValue);
      });
      test('messageTemplate e values devem ser processadas juntos como querystring', () => {
        // Arrange, Given

        const expectedMessage = Math.random().toString();

        const mockQuerystring = jest.fn();
        mockQuerystring.mockReturnValue(expectedMessage);
        HelperText.querystring = mockQuerystring;

        const message = Math.random().toString();
        const values = Math.random().toString();

        const sut = new LogWriterToTest();

        // Act, When

        sut.post(message, values);

        // Assert, Then

        expect(mockQuerystring.mock.calls.length).toBe(1);
        expect(mockQuerystring.mock.calls[0][0]).toBe(message);
        expect(mockQuerystring.mock.calls[0][1]).toBe(values);

        expect(sut.mockWrite.mock.calls.length).toBe(1);
        expect(sut.mockWrite.mock.calls[0][0].message).toBe(expectedMessage);
      });
      test('Deve atribuir a data atual para a mensagem de log', () => {
        // Arrange, Given

        const sut = new LogWriterToTest();

        // Act, When

        sut.post('log message');

        // Assert, Then

        expect(sut.mockWrite.mock.calls.length).toBe(1);

        const timestamp = sut.mockWrite.mock.calls[0][0].timestamp as Date;
        const intervalSinceLastCall =
          new Date().getTime() - timestamp.getTime();
        const oneSecond = 1000;
        expect(intervalSinceLastCall).toBeLessThan(oneSecond);
      });
      test('Após postar deve enviar para escrita do log um ILogMessage', () => {
        // Arrange, Given

        const expectedDateAsText = new Date().toDateString();
        const expectedMessage = Math.random().toString();
        const expectedLevel = LogLevel.Fatal;
        const expectedSection = Math.random().toString();

        const sut = new LogWriterToTest();

        // Act, When

        sut.post(expectedMessage, undefined, expectedLevel, expectedSection);

        // Assert, Then

        const logMessage = sut.mockWrite.mock.calls[0][0] as ILogMessage;
        expect(logMessage.timestamp.toDateString()).toBe(expectedDateAsText);
        expect(logMessage.message).toBe(expectedMessage);
        expect(logMessage.level).toBe(expectedLevel);
        expect(logMessage.section).toBe(expectedSection);
      });
      test('Ao postar deve enviar também messageTemplate e values', () => {
        // Arrange, Given

        const inputMessageTemplate = new Date().toDateString() + ' {value}';
        const inputValues = { value: Math.random().toString() };
        const expectedMessage = HelperText.querystring(
          inputMessageTemplate,
          inputValues
        );

        const sut = new LogWriterToTest();

        // Act, When

        sut.post(inputMessageTemplate, inputValues);

        // Assert, Then

        expect(sut.mockWrite.mock.calls[0][0].message).toBe(expectedMessage);
        expect(sut.mockWrite.mock.calls[0][1]).toBe(inputMessageTemplate);
        expect(sut.mockWrite.mock.calls[0][2]).toBe(inputValues);
      });
    });
  });
  describe('defaultValues', () => {
    test('defaultValues ser inicializado vazio', () => {
      // Arrange, Given
      // Act, When

      const sut = new LogWriterToTest();

      // Assert, Then

      expect(sut.defaultValues).toBeDefined();
      expect(Object.keys(sut.defaultValues).length).toBe(0);
    });
    test('post deve usar LogWriter.mergeValues', () => {
      // Arrange, Given

      const mockMergeValues = jest.fn();
      LogWriter.mergeValues = mockMergeValues;

      const values = Math.random();
      const defaultValues: Record<string, unknown | (() => unknown)> = {};

      const sut = new LogWriterToTest();

      // Act, When

      sut.defaultValues = defaultValues;
      sut.post(Math.random().toString(), values);

      // Assert, Then

      expect(mockMergeValues).toBeCalledTimes(1);
      expect(mockMergeValues.mock.calls[0][0]).toBe(values);
      expect(mockMergeValues.mock.calls[0][1]).toBe(defaultValues);
    });
  });
  describe('mergeValues', () => {
    test('undefined com undefined resulta em undefined', () => {
      // Arrange, Given

      const values = undefined;
      const defaultValues = undefined;

      // Act, When

      const result = LogWriter.mergeValues(values, defaultValues);

      // Assert, Then

      expect(result).toBeUndefined();
    });
    test('somente values tem valor retorna esse', () => {
      // Arrange, Given

      const values = Math.random();
      const defaultValues = undefined;

      // Act, When

      const result = LogWriter.mergeValues(values, defaultValues);

      // Assert, Then

      expect(result).toBeDefined();
      expect(result).toBe(values);
    });
    test('defaultValues sem properiedades é considerado undefined', () => {
      // Arrange, Given

      const values = Math.random();
      const defaultValues = {};

      // Act, When

      const result = LogWriter.mergeValues(values, defaultValues);

      // Assert, Then

      expect(result).toBeDefined();
      expect(result).toBe(values);
    });
    test('somente defaultValues tem valor retorna esse', () => {
      // Arrange, Given

      const values = undefined;
      const defaultValues = {
        property1: Math.random()
      };

      // Act, When

      const result = LogWriter.mergeValues(values, defaultValues);

      // Assert, Then

      expect(result).toBeDefined();
      expect(result).toBe(defaultValues);
    });
    test('somente values como função retorna o valor desse', () => {
      // Arrange, Given

      const markValue = Math.random();

      const values = () => markValue;
      const defaultValues = undefined;

      // Act, When

      const result = LogWriter.mergeValues(values, defaultValues);

      // Assert, Then

      expect(result).toBe(markValue);
    });
    test('somente defaultValues como função retorna o valor desse', () => {
      // Arrange, Given

      const markValue = Math.random();

      const values = undefined;
      const defaultValues: Record<string, unknown | (() => unknown)> = {
        property: () => markValue
      };

      // Act, When

      const result = LogWriter.mergeValues(values, defaultValues) as Record<
        string,
        unknown
      >;

      // Assert, Then

      expect(result['property']).toBe(markValue);
    });
    test('merge onde value é valor', () => {
      // Arrange, Given

      const values = new Date();
      const defaultValues = {
        property: Math.random()
      };

      // Act, When

      const result = LogWriter.mergeValues(values, defaultValues);

      // Assert, Then

      expect(Array.isArray(result)).toBe(true);
      expect((result as unknown[]).length).toBe(2);
      expect((result as unknown[])[0]).toBe(values);
      expect((result as unknown[])[1]).toBe(defaultValues.property);
    });
    test('merge onde value é array', () => {
      // Arrange, Given

      const values = [Math.random(), Math.random()];
      const defaultValues = {
        property1: Math.random(),
        property2: Math.random()
      };

      // Act, When

      const result = LogWriter.mergeValues(values, defaultValues);

      // Assert, Then

      expect(Array.isArray(result)).toBe(true);
      expect((result as unknown[]).length).toBe(4);
      expect((result as unknown[])[0]).toBe(values[0]);
      expect((result as unknown[])[1]).toBe(values[1]);
      expect((result as unknown[])[2]).toBe(defaultValues.property1);
      expect((result as unknown[])[3]).toBe(defaultValues.property2);
    });
    test('merge onde value é object', () => {
      // Arrange, Given

      const values = {
        property1: Math.random(),
        property2: Math.random()
      };
      const defaultValues = {
        property3: Math.random(),
        property4: Math.random()
      };

      // Act, When

      const result = LogWriter.mergeValues(values, defaultValues);
      const resultKeys = Object.keys(result as {});
      const resultValues = Object.values(result as {});

      // Assert, Then

      expect(resultKeys.length).toBe(4);
      expect(resultValues.length).toBe(resultKeys.length);
      expect(resultKeys[0]).toBe('property3');
      expect(resultKeys[1]).toBe('property4');
      expect(resultKeys[2]).toBe('property1');
      expect(resultKeys[3]).toBe('property2');
      expect(resultValues[0]).toBe(defaultValues.property3);
      expect(resultValues[1]).toBe(defaultValues.property4);
      expect(resultValues[2]).toBe(values.property1);
      expect(resultValues[3]).toBe(values.property2);
    });
    test('merge de object faz values escrever sobre defaultValues ', () => {
      // Arrange, Given

      const values = {
        property1: Math.random(),
        propertyA: Math.random()
      };
      const defaultValues = {
        property1: Math.random(),
        propertyB: Math.random()
      };

      // Act, When

      const result = LogWriter.mergeValues(values, defaultValues);
      const resultValues = Object.values(result as {});

      // Assert, Then

      expect(resultValues.length).toBe(3);
      expect(resultValues[0]).toBe(values.property1);
      expect(resultValues[1]).toBe(defaultValues.propertyB);
      expect(resultValues[2]).toBe(values.propertyA);
    });
  });
  test('Apenas escreve se enabled==true', () => {
    // Arrange, Given

    const sut = new LogWriterToTest();
    const enabledValues = [true, false];

    for (const enabled of enabledValues) {
      sut.mockWrite.mockClear();

      // Act, When

      sut.enabled = enabled;
      sut.post(Math.random().toString());

      // Assert, Then

      if (enabled) {
        expect(sut.mockWrite.mock.calls.length).toBe(1);
      } else {
        expect(sut.mockWrite.mock.calls.length).toBe(0);
      }
    }
  })
});
