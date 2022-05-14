import {ILogWriter, Logger, LogLevel, LogWriter} from '../../ts';

describe('Class Logger', () => {
  describe('Funções e propriedades estáticas', () => {
    const originals: Record<string, any> = {};

    beforeEach(() => {
      originals['Logger.defaultLogger'] = Logger.defaultLogger;
      originals['LogWriter.mergeValues'] = LogWriter.mergeValues;
    });

    afterEach(() => {
      Logger.defaultLogger = originals['Logger.defaultLogger'];
      LogWriter.mergeValues = originals['LogWriter.mergeValues'];
    });

    test('defaultLogger deve estar instanciado com LogWriterToConsole', () => {
      // Arrange, Given
      // Act, When

      const value = Logger.defaultLogger;

      // Assert, Then

      expect(value).toBeTruthy();
    });

    test('mesmo se defaultLogger for null postar log não deve falhar', () => {
      // Arrange, Given

      Logger.defaultLogger = null;

      // Act, When

      const postLog = () => Logger.post('log message');

      // Assert, Then

      expect(postLog).not.toThrow();
    });

    test('post deve postar log através de defaultLogger', () => {
      // Arrange, Given

      const mockLogWriterPost = jest.fn();
      Logger.defaultLogger = {
        post: mockLogWriterPost,
        enabled: true,
        minimumLevel: LogLevel.Verbose,
        defaultLogLevel: LogLevel.Debug,
        defaultValues: {}
      };

      // Act, When

      Logger.post('log message');

      // Assert, Then

      expect(mockLogWriterPost).toBeCalledTimes(1);
    });
  });
  describe('Funções e propriedades da instância', () => {
    test('a função post deve repassar a chamada para todas as instâncias de ILogWriter', () => {
      // Arrange, Given

      const mockLogWriterPost = jest.fn();

      const count = Math.floor(Math.random() * 100) + 5;
      const logWriters: ILogWriter[] = [];
      for (let i = 0; i < count; i++) {
        logWriters.push({
          post: mockLogWriterPost,
          enabled: true,
          minimumLevel: LogLevel.Verbose,
          defaultLogLevel: LogLevel.Debug,
          defaultValues: {}
        });
      }

      const logger = new Logger(logWriters);

      // Act, When

      logger.post('log message');

      // Assert, Then

      expect(mockLogWriterPost).toBeCalledTimes(count);
    });
  });
  describe('defaultValues', () => {
    test('defaultValues ser inicializado vazio', () => {
      // Arrange, Given
      // Act, When

      const sut = new Logger([]);

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
      const logWriter: ILogWriter = {
          post: jest.fn(),
          enabled: true,
          minimumLevel: LogLevel.Verbose,
          defaultLogLevel: LogLevel.Debug,
          defaultValues: {}
      }

      const sut = new Logger([logWriter]);

      // Act, When

      sut.defaultValues = defaultValues;
      sut.post(Math.random().toString(), values);

      // Assert, Then

      expect(mockMergeValues).toBeCalledTimes(1);
      expect(mockMergeValues.mock.calls[0][0]).toBe(values);
      expect(mockMergeValues.mock.calls[0][1]).toBe(defaultValues);
    });
  });
  test('deve poder trocar a lista de logger depois de instanciado', () => {
    // Arrange, Given

    const mockPost1 = jest.fn();
    const logger1: ILogWriter = {
      post: mockPost1,
      enabled: true,
      minimumLevel: LogLevel.Verbose,
      defaultLogLevel: LogLevel.Debug,
      defaultValues: {}
    };

    const mockPost2 = jest.fn();
    const logger2: ILogWriter = {
      post: mockPost2,
      enabled: true,
      minimumLevel: LogLevel.Verbose,
      defaultLogLevel: LogLevel.Debug,
      defaultValues: {}
    };

    const sut = new Logger([]);

    // Act, When

    sut.post(Math.random().toString());
    sut.writers = [logger1];
    sut.post(Math.random().toString());
    sut.writers = [logger2];
    sut.post(Math.random().toString());
    sut.writers.length = 0;
    sut.post(Math.random().toString());

    // Assert, Then

    expect(mockPost1).toBeCalledTimes(1);
    expect(mockPost2).toBeCalledTimes(1);
  });
  test('enabled deve afetar todos os logWriters', () => {
    // Arrange, Given

    const enabledValues = [false, true];

    const mockPost1 = jest.fn();
    const logger1: ILogWriter = {
      post: mockPost1,
      enabled: true,
      minimumLevel: LogLevel.Verbose,
      defaultLogLevel: LogLevel.Debug,
      defaultValues: {}
    };

    const mockPost2 = jest.fn();
    const logger2: ILogWriter = {
      post: mockPost2,
      enabled: true,
      minimumLevel: LogLevel.Verbose,
      defaultLogLevel: LogLevel.Debug,
      defaultValues: {}
    };

    const sut = new Logger([logger1, logger2]);

    for (const enabled of enabledValues) {
      logger1.enabled = !enabled;
      logger2.enabled = !enabled;

      // Act, When

      sut.enabled = enabled;

      // Assert, Then

      expect(logger1.enabled).toBe(enabled);
      expect(logger2.enabled).toBe(enabled);
    }
  });
  test('enabled deve ser false se todos logWriter são false', () => {
    // Arrange, Given

    const mockPost1 = jest.fn();
    const logger1: ILogWriter = {
      post: mockPost1,
      enabled: true,
      minimumLevel: LogLevel.Verbose,
      defaultLogLevel: LogLevel.Debug,
      defaultValues: {}
    };

    const mockPost2 = jest.fn();
    const logger2: ILogWriter = {
      post: mockPost2,
      enabled: true,
      minimumLevel: LogLevel.Verbose,
      defaultLogLevel: LogLevel.Debug,
      defaultValues: {}
    };

    const sut = new Logger([logger1, logger2]);
    logger1.enabled = false;
    logger2.enabled = false;

    // Act, When

    const receivedEnabled = sut.enabled;

    // Assert, Then

    expect(receivedEnabled).toBe(false);
  });
  test('enabled deve ser true se pelo menos um logWriter é true', () => {
    // Arrange, Given

    const mockPost1 = jest.fn();
    const logger1: ILogWriter = {
      post: mockPost1,
      enabled: true,
      minimumLevel: LogLevel.Verbose,
      defaultLogLevel: LogLevel.Debug,
      defaultValues: {}
    };

    const mockPost2 = jest.fn();
    const logger2: ILogWriter = {
      post: mockPost2,
      enabled: true,
      minimumLevel: LogLevel.Verbose,
      defaultLogLevel: LogLevel.Debug,
      defaultValues: {}
    };

    const sut = new Logger([logger1, logger2]);
    logger1.enabled = false;
    logger2.enabled = true;

    // Act, When

    const receivedEnabled = sut.enabled;

    // Assert, Then

    expect(receivedEnabled).toBe(true);
  });
  test('minimumLevel deve ser igual ao valor mais alto dos logWriter', () => {
    // Arrange, Given

    const mockPost1 = jest.fn();
    const logger1: ILogWriter = {
      post: mockPost1,
      enabled: true,
      minimumLevel: LogLevel.Verbose,
      defaultLogLevel: LogLevel.Debug,
      defaultValues: {}
    };

    const mockPost2 = jest.fn();
    const logger2: ILogWriter = {
      post: mockPost2,
      enabled: true,
      minimumLevel: LogLevel.Verbose,
      defaultLogLevel: LogLevel.Debug,
      defaultValues: {}
    };

    const sut = new Logger([logger1, logger2]);
    logger1.minimumLevel = LogLevel.Information;
    logger2.minimumLevel = LogLevel.Warning;

    // Act, When

    const receivedMinimumLevel = sut.minimumLevel;

    // Assert, Then

    expect(receivedMinimumLevel).not.toBe(logger1.minimumLevel);
    expect(receivedMinimumLevel).toBe(logger2.minimumLevel);
  });
  test('minimumLevel deve ser menor valor se não houver logWriters', () => {
    // Arrange, Given

    const sut = new Logger([]);

    // Act, When

    const receivedMinimumLevel = sut.minimumLevel;

    // Assert, Then

    expect(receivedMinimumLevel).toBe(LogLevel.Verbose);
  });
  test('defaultLogLevel deve ser igual ao valor mais alto dos logWriter', () => {
    // Arrange, Given

    const mockPost1 = jest.fn();
    const logger1: ILogWriter = {
      post: mockPost1,
      enabled: true,
      minimumLevel: LogLevel.Verbose,
      defaultLogLevel: LogLevel.Debug,
      defaultValues: {}
    };

    const mockPost2 = jest.fn();
    const logger2: ILogWriter = {
      post: mockPost2,
      enabled: true,
      minimumLevel: LogLevel.Verbose,
      defaultLogLevel: LogLevel.Debug,
      defaultValues: {}
    };

    const sut = new Logger([logger1, logger2]);
    logger1.defaultLogLevel = LogLevel.Information;
    logger2.defaultLogLevel = LogLevel.Warning;

    // Act, When

    const receivedMinimumLevel = sut.defaultLogLevel;

    // Assert, Then

    expect(receivedMinimumLevel).not.toBe(logger1.defaultLogLevel);
    expect(receivedMinimumLevel).toBe(logger2.defaultLogLevel);
  });
  test('defaultLogLevel deve ser menor valor se não houver logWriters', () => {
    // Arrange, Given

    const sut = new Logger([]);

    // Act, When

    const receivedMinimumLevel = sut.defaultLogLevel;

    // Assert, Then

    expect(receivedMinimumLevel).toBe(LogLevel.Verbose);
  });
});
