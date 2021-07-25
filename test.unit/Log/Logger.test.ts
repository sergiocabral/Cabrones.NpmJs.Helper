import { ILogWriter, KeyValue, Logger } from '../../ts';

describe('Class Logger', () => {
  describe('Funções e propriedades estáticas', () => {
    const originals: KeyValue<any> = {};

    beforeEach(() => {
      originals['Logger.defaultLogger'] = Logger.defaultLogger;
    });

    afterEach(() => {
      Logger.defaultLogger = originals['Logger.defaultLogger'];
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
      Logger.defaultLogger = { post: mockLogWriterPost };

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

      const count = 10;
      const logWriters: ILogWriter[] = [];
      for (let i = 0; i < count; i++) {
        logWriters.push({ post: mockLogWriterPost });
      }

      const logger = new Logger(logWriters);

      // Act, When

      logger.post('log message');

      // Assert, Then

      expect(mockLogWriterPost).toBeCalledTimes(count);
    });
  });
});
