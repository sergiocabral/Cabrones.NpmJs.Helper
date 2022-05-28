import {
  ConnectionState,
  HelperText,
  ILogMessageAndData,
  InvalidArgumentError,
  LogLevel,
  LogWriter,
  LogWriterToPersistent
} from '../../ts';

describe('Class LogWriterToPersistent', () => {
  const originals: Record<string, any> = {};

  beforeEach(() => {
    originals['LogWriterToPersistent.waitInMillisecondsOnError'] =
      LogWriterToPersistent.waitInMillisecondsOnError;
    originals['LogWriter.minimumLevel'] = LogWriter.minimumLevel;
    originals['LogWriter.defaultLogLevel'] = LogWriter.defaultLogLevel;
    originals['console.error'] = console.error;

    LogWriterToPersistent.waitInMillisecondsOnError = 100;
  });

  afterEach(() => {
    LogWriterToPersistent.waitInMillisecondsOnError =
      originals['LogWriterToPersistent.waitInMillisecondsOnError'];
    LogWriter.minimumLevel = originals['LogWriter.minimumLevel'];
    LogWriter.defaultLogLevel = originals['LogWriter.defaultLogLevel'];
    console.error = originals['console.error'];
  });

  describe('waitInMillisecondsOnError', () => {
    test('o valor estático padrão é 1 minuto', () => {
      // Arrange, Given

      const expectedValue = 60000;

      // Act, When

      const receivedValue = LogWriterToPersistent.waitInMillisecondsOnError;

      // Assert, Then

      expect(receivedValue).toBe(expectedValue);
    });
    test('o valor estático é usado como padrão se não informado', () => {
      // Arrange, Given

      const randomValue = Math.floor(Math.random() * 1000);
      LogWriterToPersistent.waitInMillisecondsOnError = randomValue;

      // Act, When

      const sut = new LogWriterToPersistent(
        {
          state: ConnectionState.Ready
        },
        jest.fn()
      );

      // Assert, Then

      expect(sut.waitInMillisecondsOnError).toBe(randomValue);
    });
    describe('definido pelo construtor', () => {
      test('deve poder especificar seu valor', () => {
        // Arrange, Given

        const staticValue = Math.floor(Math.random() * 1000);
        const instanceValue = Math.floor(Math.random() * 1000);
        LogWriterToPersistent.waitInMillisecondsOnError = staticValue;

        // Act, When

        const sut = new LogWriterToPersistent(
          {
            state: ConnectionState.Ready
          },
          jest.fn(),
          LogWriter.minimumLevel,
          LogWriter.defaultLogLevel,
          instanceValue
        );

        // Assert, Then

        expect(sut.waitInMillisecondsOnError).not.toBe(staticValue);
        expect(sut.waitInMillisecondsOnError).toBe(instanceValue);
      });
      test('não deve aceitar valor menor que zero', () => {
        // Arrange, Given

        const lessThanZero = -Math.random();

        // Act, When

        const setter = () =>
          new LogWriterToPersistent(
            {
              state: ConnectionState.Ready
            },
            jest.fn(),
            LogWriter.minimumLevel,
            LogWriter.defaultLogLevel,
            lessThanZero
          );

        // Assert, Then

        expect(setter).toThrow(InvalidArgumentError);
      });
      test('não deve aceitar valor NaN', () => {
        // Arrange, Given

        const notANumber = NaN;

        // Act, When

        const setter = () =>
          new LogWriterToPersistent(
            {
              state: ConnectionState.Ready
            },
            jest.fn(),
            LogWriter.minimumLevel,
            LogWriter.defaultLogLevel,
            notANumber
          );

        // Assert, Then

        expect(setter).toThrow(InvalidArgumentError);
      });
      test('pode aceitar zero', () => {
        // Arrange, Given

        const zero = 0;

        // Act, When

        const setter = () =>
          new LogWriterToPersistent(
            {
              state: ConnectionState.Ready
            },
            jest.fn(),
            LogWriter.minimumLevel,
            LogWriter.defaultLogLevel,
            zero
          );

        // Assert, Then

        expect(setter).not.toThrow();
      });
      test('pode aceitar qualquer valor positivo', () => {
        // Arrange, Given

        const randomValue = Math.random();

        // Act, When

        const sut = new LogWriterToPersistent(
          {
            state: ConnectionState.Ready
          },
          jest.fn(),
          LogWriter.minimumLevel,
          LogWriter.defaultLogLevel,
          randomValue
        );

        // Assert, Then

        expect(sut.waitInMillisecondsOnError).toBe(randomValue);
      });
    });
    describe('definido pela propriedade', () => {
      test('não deve aceitar valor menor que zero', () => {
        // Arrange, Given

        const lessThanZero = -Math.random();

        const sut = new LogWriterToPersistent(
          {
            state: ConnectionState.Ready
          },
          jest.fn()
        );

        // Act, When

        const setter = () => (sut.waitInMillisecondsOnError = lessThanZero);

        // Assert, Then

        expect(setter).toThrow(InvalidArgumentError);
      });
      test('não deve aceitar valor NaN', () => {
        // Arrange, Given

        const notANumber = NaN;

        const sut = new LogWriterToPersistent(
          {
            state: ConnectionState.Ready
          },
          jest.fn()
        );

        // Act, When

        const setter = () => (sut.waitInMillisecondsOnError = notANumber);

        // Assert, Then

        expect(setter).toThrow(InvalidArgumentError);
      });
      test('pode aceitar zero', () => {
        // Arrange, Given

        const zero = 0;

        const sut = new LogWriterToPersistent(
          {
            state: ConnectionState.Ready
          },
          jest.fn()
        );

        // Act, When

        const setter = () => (sut.waitInMillisecondsOnError = zero);

        // Assert, Then

        expect(setter).not.toThrow();
      });
      test('pode aceitar qualquer valor positivo', () => {
        // Arrange, Given

        const randomValue = Math.random();

        const sut = new LogWriterToPersistent(
          {
            state: ConnectionState.Ready
          },
          jest.fn()
        );

        // Act, When

        sut.waitInMillisecondsOnError = randomValue;

        // Assert, Then

        expect(sut.waitInMillisecondsOnError).toBe(randomValue);
      });
    });
  });
  describe('minimumLevel', () => {
    test('se não informado vem de LogWriter.minimumLevel', () => {
      // Arrange, Given

      const randomValue = Math.floor(Math.random() * 1000);
      LogWriter.minimumLevel = randomValue;

      // Act, When

      const sut = new LogWriterToPersistent(
        {
          state: ConnectionState.Ready
        },
        jest.fn()
      );

      // Assert, Then

      expect(sut.minimumLevel).toBe(randomValue);
    });
    test('deve poder especificar seu valor', () => {
      // Arrange, Given

      const staticValue = Math.floor(Math.random() * 1000);
      const instanceValue = Math.floor(Math.random() * 1000);
      LogWriter.minimumLevel = staticValue;

      // Act, When

      const sut = new LogWriterToPersistent(
        {
          state: ConnectionState.Ready
        },
        jest.fn(),
        instanceValue
      );

      // Assert, Then

      expect(sut.minimumLevel).toBe(instanceValue);
    });
  });
  describe('defaultLogLevel', () => {
    test('se não informado vem de LogWriter.defaultLogLevel', () => {
      // Arrange, Given

      const randomValue = Math.floor(Math.random() * 1000);
      LogWriter.defaultLogLevel = randomValue;

      // Act, When

      const sut = new LogWriterToPersistent(
        {
          state: ConnectionState.Ready
        },
        jest.fn()
      );

      // Assert, Then

      expect(sut.defaultLogLevel).toBe(randomValue);
    });
    test('deve poder especificar seu valor', () => {
      // Arrange, Given

      const staticValue = Math.floor(Math.random() * 1000);
      const instanceValue = Math.floor(Math.random() * 1000);
      LogWriter.defaultLogLevel = staticValue;

      // Act, When

      const sut = new LogWriterToPersistent(
        {
          state: ConnectionState.Ready
        },
        jest.fn(),
        LogWriter.minimumLevel,
        instanceValue
      );

      // Assert, Then

      expect(sut.defaultLogLevel).toBe(instanceValue);
    });
  });
  test('save() é utilizado quando que chamar post() e connection é Ready', async () => {
    return new Promise<void>(resolve => {
      // Arrange, Given

      const connectionStateReady = ConnectionState.Ready;
      const mockSave = jest.fn();

      const sut = new LogWriterToPersistent(
        { state: connectionStateReady },
        mockSave
      );

      const expectedMessageTemplate = 'mensagem {value}';
      const expectedValues = { value: Math.random() };
      const expectedLevel = Math.random();
      const expectedSection = Math.random().toString();
      const expectedTimestamp = new Date();

      // Act, When

      sut.post(
        expectedMessageTemplate,
        expectedValues,
        expectedLevel,
        expectedSection,
        expectedTimestamp
      );

      setTimeout(() => {
        // Assert, Then

        expect(mockSave).toBeCalledTimes(1);
        expect(
          (mockSave.mock.calls[0][0] as ILogMessageAndData).logMessage.message
        ).toBe(expectedMessageTemplate.querystring(expectedValues));
        expect(
          (mockSave.mock.calls[0][0] as ILogMessageAndData).logMessage.level
        ).toBe(expectedLevel);
        expect(
          (mockSave.mock.calls[0][0] as ILogMessageAndData).logMessage.timestamp
        ).toBe(expectedTimestamp);
        expect(
          (mockSave.mock.calls[0][0] as ILogMessageAndData).logMessage.section
        ).toBe(expectedSection);
        expect((mockSave.mock.calls[0][0] as ILogMessageAndData).values).toBe(
          expectedValues
        );
        expect(
          (mockSave.mock.calls[0][0] as ILogMessageAndData).messageTemplate
        ).toBe(expectedMessageTemplate);

        // Tear Down

        resolve();
      }, 1);
    });
  });
  test('save() não deve ser chamado se conexão não for Ready', async () => {
    return new Promise<void>(resolve => {
      // Arrange, Given

      const connectionStateNotReady = ConnectionState.Closed;
      const mockSave = jest.fn();

      const sut = new LogWriterToPersistent(
        { state: connectionStateNotReady },
        mockSave
      );

      // Act, When

      sut.post(Math.random().toString());

      setTimeout(() => {
        // Assert, Then

        expect(mockSave).toBeCalledTimes(0);

        // Tear Down

        resolve();
      }, 100);
    });
  });
  test('usando flush(), deve guardar mensagens até que a conexão seja Ready', async () => {
    return new Promise<void>(resolve => {
      // Arrange, Given

      const connection = { state: ConnectionState.Closed };
      const mockSave = jest.fn();
      const messages = Array<string>(10)
        .fill('')
        .map(() => Math.random().toString());

      const sut = new LogWriterToPersistent(connection, mockSave);

      // Act, When

      for (const message of messages) {
        sut.post(message);
      }

      sut.flush();

      setTimeout(() => {
        const callsBefore = mockSave.mock.calls.length;

        connection.state = ConnectionState.Ready;

        sut.flush();

        setTimeout(() => {
          const callsAfter = mockSave.mock.calls.length;

          // Assert, Then

          expect(callsBefore).toBe(0);
          expect(callsAfter).toBe(messages.length);

          // Tear Down

          resolve();
        }, 1);
      }, 1);
    });
  });
  test('esperando o waitInMillisecondsOnError, deve guardar mensagens até que a conexão seja Ready', async () => {
    return new Promise<void>(resolve => {
      // Arrange, Given

      const connection = { state: ConnectionState.Closed };
      const waitInMillisecondsOnError = 2;
      const mockSave = jest.fn();
      const messages = Array<string>(10)
        .fill('')
        .map(() => Math.random().toString());

      const sut = new LogWriterToPersistent(
        connection,
        mockSave,
        LogLevel.Verbose,
        LogLevel.Debug,
        waitInMillisecondsOnError
      );

      // Act, When

      for (const message of messages) {
        sut.post(message);
      }

      setTimeout(() => {
        const callsBefore = mockSave.mock.calls.length;

        connection.state = ConnectionState.Ready;

        setTimeout(() => {
          const callsAfter = mockSave.mock.calls.length;

          // Assert, Then

          expect(callsBefore).toBe(0);
          expect(callsAfter).toBe(messages.length);

          // Tear Down

          resolve();
        }, waitInMillisecondsOnError * 10);
      }, waitInMillisecondsOnError / 2);
    });
  });
  test('flush() pode ser chamado múltiplas vezes e não liberar mensagens se conexão não é Ready', async () => {
    return new Promise<void>(resolve => {
      // Arrange, Given

      const connectionState = ConnectionState.Closed;
      const waitInMillisecondsOnError = 0;
      const mockSave = jest.fn();

      const sut = new LogWriterToPersistent(
        { state: connectionState },
        mockSave,
        LogLevel.Verbose,
        LogLevel.Debug,
        waitInMillisecondsOnError
      );

      sut.post(Math.random().toString());

      // Act, When

      sut.flush();
      setTimeout(() => {
        sut.flush();
        setTimeout(() => {
          sut.flush();
          setTimeout(() => {
            sut.flush();
            setTimeout(() => {
              // Assert, Then

              expect(mockSave).toBeCalledTimes(0);

              // Tear Down

              resolve();
            }, 1);
          }, 1);
        }, 1);
      }, 1);
    });
  });
  test('flush() pode ser chamado múltiplas sem efeitos colaterais', () => {
    // Arrange, Given

    const sut = new LogWriterToPersistent(
      { state: ConnectionState.Ready },
      jest.fn()
    );

    sut.post(Math.random().toString());

    // Act, When

    const callMultiples = () => {
      for (let i = 0; i < 10; i++) {
        sut.flush();
      }
    };

    // Assert, Then

    expect(callMultiples).not.toThrow();
  });
  test('flush() pode ser chamado múltiplas vezes sem efeitos colaterais mesmo que a postagem demore', async () => {
    return new Promise<void>(resolve => {
      // Arrange, Given

      const connectionOpen = { state: ConnectionState.Ready };
      const mockSave = async () => {
        return new Promise<void>(resolve2 => {
          setTimeout(() => {
            resolve2();
            resolve();
          }, 100);
        });
      };

      const sut = new LogWriterToPersistent(connectionOpen, mockSave);

      sut.post(Math.random().toString());

      // Act, When

      const callMultiples = () => {
        for (let i = 0; i < 10; i++) {
          sut.flush();
        }
      };

      // Assert, Then

      expect(callMultiples).not.toThrow();
    });
  });
  test('Em caso de erro na primeira postagem espera até tentar de novo', async () => {
    return new Promise<void>(resolve => {
      // Arrange, Given

      const message = Math.random().toString();
      const waitInMillisecondsOnError = 5;
      const connectionOpen = { state: ConnectionState.Ready };
      console.error = jest.fn();
      let swap = false;
      const postedMessages: string[] = [];
      const mockSave = (messageAndData: ILogMessageAndData) => {
        if ((swap = !swap)) {
          throw 'falha';
        }
        postedMessages.push(messageAndData.logMessage.message);
      };

      const sut = new LogWriterToPersistent(
        connectionOpen,
        mockSave,
        LogLevel.Verbose,
        LogLevel.Debug,
        waitInMillisecondsOnError
      );

      // Act, When

      sut.post(message);

      setTimeout(() => {
        // Assert, Then

        expect(postedMessages.length).toBe(0);
        setTimeout(() => {
          expect(postedMessages.length).toBe(1);
          expect(postedMessages[0]).toBe(message);

          // Tear Down

          resolve();
        }, waitInMillisecondsOnError * 2);
      }, 1);
    });
  });
  test('Em caso de erro deve posta mensagem no console', async () => {
    return new Promise<void>(resolve => {
      // Arrange, Given

      const mockConsoleError = jest.fn();
      console.error = mockConsoleError;
      const connectionOpen = { state: ConnectionState.Ready };
      const error = Math.random().toString();
      const mockSave = () => {
        throw error;
      };

      const sut = new LogWriterToPersistent(connectionOpen, mockSave);

      // Act, When

      sut.post(Math.random().toString());

      setTimeout(() => {
        // Assert, Then

        expect(mockConsoleError).toBeCalledTimes(1);
        expect(mockConsoleError.mock.calls[0][0]).toBe(
          `Error saving log message to persistence: ${HelperText.formatError(
            error
          )}`
        );

        // Tear Down

        resolve();
      }, 1);
    });
  });
});
