import { ILogMessage, KeyValue, LogLevel, LogWriterToConsole } from '../../ts';

describe('Class LogWriterToConsoleLevel', () => {
  const originals: KeyValue<any> = {};

  beforeEach(() => {
    originals['console.debug'] = console.debug;
    originals['console.log'] = console.log;
    originals['console.info'] = console.info;
    originals['console.warn'] = console.warn;
    originals['console.error'] = console.error;
  });

  afterEach(() => {
    console.debug = originals['console.debug'];
    console.log = originals['console.log'];
    console.info = originals['console.info'];
    console.warn = originals['console.warn'];
    console.error = originals['console.error'];
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
  });

  describe('Formatação da mensagem', () => {
    test('Exibir data, level, seção e mensagem', () => {
      // Arrange, Given

      const mockWrite = jest.fn();
      console.debug = mockWrite;

      const message: ILogMessage = {
        timestamp: new Date(),
        level: LogLevel.Verbose,
        section: Math.random().toString(),
        message: Math.random().toString()
      };

      const sut = new LogWriterToConsole(message.level);

      const expectedOutputMessage = `${message.timestamp.toLocaleString()} [${
        LogLevel[message.level] + ': ' + message.section
      }] ${message.message}`;

      // Act, When

      sut.post(message.message, undefined, message.level, message.section);

      // Assert, Then

      expect(mockWrite.mock.calls.length).toBe(1);
      expect(mockWrite.mock.calls[0][0]).toBe(expectedOutputMessage);
    });
    test('Exibir data, level e mensagem (sem seção)', () => {
      // Arrange, Given

      const mockWrite = jest.fn();
      console.debug = mockWrite;

      const message: ILogMessage = {
        timestamp: new Date(),
        level: LogLevel.Verbose,
        section: '',
        message: Math.random().toString()
      };

      const sut = new LogWriterToConsole(message.level);

      const expectedOutputMessage = `${message.timestamp.toLocaleString()} [${LogLevel[message.level]}] ${
        message.message
      }`;

      // Act, When

      sut.post(message.message, undefined, message.level, message.section);

      // Assert, Then

      expect(mockWrite.mock.calls.length).toBe(1);
      expect(mockWrite.mock.calls[0][0]).toBe(expectedOutputMessage);
    });
  });
});
