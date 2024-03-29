import {
  HelperFileSystem,
  LogWriter,
  LogWriterToFile,
  LogWriterToPersistent
} from '../../ts';
import fs from 'fs';

describe('Class LogWriterToFile', () => {
  const originals: Record<string, any> = {};

  beforeEach(() => {
    originals['LogWriter.factoryMessage'] = LogWriter.factoryMessage;
    originals['LogWriterToFile.waitInMillisecondsOnError'] =
      LogWriterToFile.waitInMillisecondsOnError;
    originals['LogWriterToPersistent.waitInMillisecondsOnError'] =
      LogWriterToPersistent.waitInMillisecondsOnError;
    originals['LogWriterToFile.defaultFileNameByDate'] =
      LogWriterToFile.defaultFileNameByDate;
    originals['LogWriter.minimumLevel'] = LogWriter.minimumLevel;
    originals['LogWriter.defaultLogLevel'] = LogWriter.defaultLogLevel;
    originals['console.debug'] = console.debug;
    originals['console.log'] = console.log;
    originals['console.info'] = console.info;
    originals['console.warn'] = console.warn;
    originals['console.error'] = console.error;
  });

  afterEach(() => {
    LogWriter.factoryMessage = originals['LogWriter.factoryMessage'];
    LogWriterToFile.waitInMillisecondsOnError =
      originals['LogWriterToFile.waitInMillisecondsOnError'];
    LogWriterToPersistent.waitInMillisecondsOnError =
      originals['LogWriterToPersistent.waitInMillisecondsOnError'];
    LogWriterToFile.defaultFileNameByDate =
      originals['LogWriterToFile.defaultFileNameByDate'];
    LogWriter.minimumLevel = originals['LogWriter.minimumLevel'];
    LogWriter.defaultLogLevel = originals['LogWriter.defaultLogLevel'];
    console.debug = originals['console.debug'];
    console.log = originals['console.log'];
    console.info = originals['console.info'];
    console.warn = originals['console.warn'];
    console.error = originals['console.error'];

    const items = fs.readdirSync('.').filter(item => item.startsWith('test-'));
    for (const item of items) {
      HelperFileSystem.deleteRecursive(item);
    }
  });

  test('Escreve mensagem usando o construtor de mensagens padrão', () => {
    // Arrange, Given

    const mockFactoryMessage = jest.fn(() => 'log message');
    LogWriter.factoryMessage = mockFactoryMessage;

    const file = `test-${Math.random()}.log`;
    const sut = new LogWriterToFile(file);

    // Act, When

    sut.post(Math.random().toString());

    // Assert, Then

    expect(mockFactoryMessage).toBeCalledTimes(1);
  });
  test('Deve escrever no arquivo especificado como texto', () => {
    // Arrange, Given

    const message = Math.random().toString();
    const fileNameByValue = `test-${Math.random()}.log`;
    const sut = new LogWriterToFile(fileNameByValue);

    // Act, When

    sut.post(message);
    const fileContent = fs.readFileSync(fileNameByValue).toString();

    // Assert, Then

    expect(fileContent).toContain(message);
  });
  test('Deve escrever no arquivo especificado como função', () => {
    // Arrange, Given

    const message = Math.random().toString();
    const filename = `test-${Math.random()}.log`;
    const fileNameByFunction = jest.fn(() => filename);
    const sut = new LogWriterToFile(fileNameByFunction);

    // Act, When

    sut.post(message);
    const fileContent = fs.readFileSync(filename).toString();

    // Assert, Then

    expect(fileContent).toContain(message);
    expect(fileNameByFunction).toBeCalledTimes(1);
  });
  test('Se ocorrer erro ao gravar deve postar como log de erro via console padrão', async () => {
    return new Promise<void>(resolve => {
      // Arrange, Given

      let consoleErrorMessage = '';
      const mockConsoleError = jest.fn(
        message => (consoleErrorMessage = message)
      );
      console.error = mockConsoleError;

      const invalidFileName = `test-${Math.random()}***${String.fromCharCode(
        0
      )}.log`;
      const sut = new LogWriterToFile(invalidFileName);

      // Act, When

      sut.post(Math.random().toString());

      setTimeout(() => {
        // Assert, Then

        expect(mockConsoleError).toBeCalledTimes(1);
        expect(
          consoleErrorMessage.startsWith('Error writing log message to file: ')
        ).toBe(true);

        // Tear Down

        resolve();
      }, 5);
    });
  });
  test('deve ser possível trocar o nome do arquivo depois de instanciado', async () => {
    return new Promise<void>(resolve => {
      // Arrange, Given

      const message1 = Math.random().toString();
      const filename1 = `test-${message1}.log`;

      const message2 = Math.random().toString();
      const filename2 = `test-${message2}.log`;

      // Act, When

      const sut = new LogWriterToFile(filename1);
      sut.post(message1);
      sut.file = filename2;
      setImmediate(() => {
        sut.post(message2);

        // Assert, Then

        expect(fs.existsSync(filename1)).toBe(true);
        expect(fs.existsSync(filename2)).toBe(true);
        expect(fs.readFileSync(filename1).toString()).toContain(message1);
        expect(fs.readFileSync(filename2).toString()).toContain(message2);

        // Tear Down

        resolve();
      });
    });
  });
  test('informar o arquivo não é obrigatório pois é determinado com base na data', () => {
    // Arrange, Given

    const date = new Date().format({ mask: 'y-M-d' });
    const expectedFilename = `log-${date}.log`;
    const message = Math.random().toString();

    // Act, When

    const sut = new LogWriterToFile();
    sut.post(message);

    // Assert, Then

    expect(fs.existsSync(expectedFilename)).toBe(true);
    expect(fs.readFileSync(expectedFilename).toString()).toContain(message);

    // Tear Down

    fs.unlinkSync(expectedFilename);
  });
  test('se não informar o arquivo deve usar a função de nome padrão baseado em data', () => {
    // Arrange, Given

    const mockDefaultFileNameByDate = jest.fn(() => `test-${Math.random()}`);
    LogWriterToFile.defaultFileNameByDate = mockDefaultFileNameByDate;

    // Act, When

    const sut = new LogWriterToFile();
    sut.post(Math.random().toString());

    // Assert, Then

    expect(mockDefaultFileNameByDate).toBeCalledTimes(1);
  });
  test('validar o nome do arquivo padrão baseado em data', () => {
    // Arrange, Given

    const date = new Date().format({ mask: 'y-M-d' });
    const expectedFilename = `log-${date}.log`;

    // Act, When

    const receivedFilename = LogWriterToFile.defaultFileNameByDate();

    // Assert, Then

    expect(receivedFilename).toBe(expectedFilename);
  });
  describe('waitInMillisecondsOnError', () => {
    test('o valor estático padrão deve vir de LogWriterToPersistent', () => {
      // Arrange, Given

      const expectedValue = LogWriterToPersistent.waitInMillisecondsOnError;

      // Act, When

      const receivedValue = LogWriterToFile.waitInMillisecondsOnError;

      // Assert, Then

      expect(receivedValue).toBe(expectedValue);
    });
    test('o valor estático é usado como padrão se não informado', () => {
      // Arrange, Given

      const randomValue = Math.floor(Math.random() * 1000);
      LogWriterToFile.waitInMillisecondsOnError = randomValue;

      // Act, When

      const sut = new LogWriterToFile();

      // Assert, Then

      expect(sut.waitInMillisecondsOnError).toBe(randomValue);
    });
    test('deve poder especificar seu valor', () => {
      // Arrange, Given

      const staticValue = Math.floor(Math.random() * 1000);
      const instanceValue = Math.floor(Math.random() * 1000);
      LogWriterToFile.waitInMillisecondsOnError = staticValue;

      // Act, When

      const sut = new LogWriterToFile(
        undefined,
        LogWriter.minimumLevel,
        LogWriter.defaultLogLevel,
        instanceValue
      );

      // Assert, Then

      expect(sut.waitInMillisecondsOnError).not.toBe(staticValue);
      expect(sut.waitInMillisecondsOnError).toBe(instanceValue);
    });
  });
  describe('minimumLevel', () => {
    test('se não informado vem de LogWriter.minimumLevel', () => {
      // Arrange, Given

      const randomValue = Math.floor(Math.random() * 1000);
      LogWriter.minimumLevel = randomValue;

      // Act, When

      const sut = new LogWriterToFile();

      // Assert, Then

      expect(sut.minimumLevel).toBe(randomValue);
    });
    test('deve poder especificar seu valor', () => {
      // Arrange, Given

      const staticValue = Math.floor(Math.random() * 1000);
      const instanceValue = Math.floor(Math.random() * 1000);
      LogWriter.minimumLevel = staticValue;

      // Act, When

      const sut = new LogWriterToFile(undefined, instanceValue);

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

      const sut = new LogWriterToFile();

      // Assert, Then

      expect(sut.defaultLogLevel).toBe(randomValue);
    });
    test('deve poder especificar seu valor', () => {
      // Arrange, Given

      const staticValue = Math.floor(Math.random() * 1000);
      const instanceValue = Math.floor(Math.random() * 1000);
      LogWriter.defaultLogLevel = staticValue;

      // Act, When

      const sut = new LogWriterToFile(
        undefined,
        LogWriter.minimumLevel,
        instanceValue
      );

      // Assert, Then

      expect(sut.defaultLogLevel).toBe(instanceValue);
    });
  });
});
