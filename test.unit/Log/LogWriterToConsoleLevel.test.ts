import { KeyValue, LogLevel, LogWriter, LogWriterToConsole } from '../../ts';

describe('Class LogWriterToConsoleLevel', () => {
  const originals: KeyValue<any> = {};

  beforeEach(() => {
    originals['LogWriter.factoryMessage'] = LogWriter.factoryMessage;
    originals['console.debug'] = console.debug;
    originals['console.log'] = console.log;
    originals['console.info'] = console.info;
    originals['console.warn'] = console.warn;
    originals['console.error'] = console.error;
  });

  afterEach(() => {
    LogWriter.factoryMessage = originals['LogWriter.factoryMessage'];
    console.debug = originals['console.debug'];
    console.log = originals['console.log'];
    console.info = originals['console.info'];
    console.warn = originals['console.warn'];
    console.error = originals['console.error'];
  });

  test('Escreve mensagem usando o construtor de mensagens padrão', () => {
    // Arrange, Given

    const mockFactoryMessage = jest.fn();
    LogWriter.factoryMessage = mockFactoryMessage;

    const sut = new LogWriterToConsole(LogLevel.Verbose);

    // Act, When

    sut.post(Math.random().toString());

    // Assert, Then

    expect(mockFactoryMessage).toBeCalledTimes(1);
  });

  describe('Usar função de escrita correspondente ao level', () => {
    test('LogLevel escrito com console.debug: Verbose', () => {
      // Arrange, Given

      const levels = [LogLevel.Verbose];

      const mockLogWrite = jest.fn();
      console.debug = mockLogWrite;

      const sut = new LogWriterToConsole(LogLevel.Verbose);

      // Act, When

      for (const level of levels) {
        sut.post('log message', undefined, level);
      }

      // Assert, Then

      expect(mockLogWrite.mock.calls.length).toBe(levels.length);
    });
    test('LogLevel escrito com console.log: Debug', () => {
      // Arrange, Given

      const levels = [LogLevel.Debug];

      const mockLogWrite = jest.fn();
      console.log = mockLogWrite;

      const sut = new LogWriterToConsole(LogLevel.Verbose);

      // Act, When

      for (const level of levels) {
        sut.post('log message', undefined, level);
      }

      // Assert, Then

      expect(mockLogWrite.mock.calls.length).toBe(levels.length);
    });
    test('LogLevel escrito com console.info: Information', () => {
      // Arrange, Given

      const levels = [LogLevel.Information];

      const mockLogWrite = jest.fn();
      console.info = mockLogWrite;

      const sut = new LogWriterToConsole(LogLevel.Verbose);

      // Act, When

      for (const level of levels) {
        sut.post('log message', undefined, level);
      }

      // Assert, Then

      expect(mockLogWrite.mock.calls.length).toBe(levels.length);
    });
    test('LogLevel escrito com console.warn: Warning', () => {
      // Arrange, Given

      const levels = [LogLevel.Warning];

      const mockLogWrite = jest.fn();
      console.warn = mockLogWrite;

      const sut = new LogWriterToConsole(LogLevel.Verbose);

      // Act, When

      for (const level of levels) {
        sut.post('log message', undefined, level);
      }

      // Assert, Then

      expect(mockLogWrite.mock.calls.length).toBe(levels.length);
    });
    test('LogLevel escrito com console.error: Error, Critical, Fatal', () => {
      // Arrange, Given

      const levels = [LogLevel.Error, LogLevel.Critical, LogLevel.Fatal];

      const mockLogWrite = jest.fn();
      console.error = mockLogWrite;

      const sut = new LogWriterToConsole(LogLevel.Verbose);

      // Act, When

      for (const level of levels) {
        sut.post('log message', undefined, level);
      }

      // Assert, Then

      expect(mockLogWrite.mock.calls.length).toBe(levels.length);
    });
    test('getConsoleFunction deve retorna a função para log pelo nome', () => {
      // Arrange, Given

      const sut = new LogWriterToConsole();

      const correlationExpected: {
        [index: string]: (message: string) => void;
      } = {
        error: console.error,
        warn: console.warn,
        info: console.info,
        log: console.log,
        debug: console.debug
      };

      const correlationVerified: {
        [index: string]: (message: string) => void;
      } = {};

      // Act, When

      for (const name of Object.keys(correlationExpected)) {
        const functionName = name as
          | 'error'
          | 'warn'
          | 'info'
          | 'log'
          | 'debug';
        correlationVerified[functionName] =
          sut.getConsoleFunction(functionName);
      }

      // Assert, Then

      for (const name of Object.keys(correlationExpected)) {
        expect(correlationVerified[name]).toBe(correlationExpected[name]);
      }
    });
  });
});
