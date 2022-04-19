import {
  FileSystemMonitoring,
  HelperFileSystem,
  InvalidArgumentError
} from '../../../ts';
import fs from 'fs';

// TODO: onCreated
// TODO: onDeleted

describe('Classe FileSystemMonitoring', () => {
  afterAll(() => {
    setTimeout(() => {
      const items = fs
        .readdirSync('.')
        .filter(item => item.startsWith('test-'));
      for (const item of items) {
        HelperFileSystem.deleteRecursive(item);
      }
    }, 100);
  });

  describe('Instancia da classe', () => {
    test('Instanciando com valores válidos', () => {
      // Arrange, Given

      const path = Math.random().toString();
      const interval = Math.floor(Math.random() * 100);

      // Act, When

      const sut = new FileSystemMonitoring(path, interval);

      // Assert, Then
      expect(sut.path).toBe(path);
      expect(sut.interval).toBe(interval);
    });
    test('Não aceita path vazio', () => {
      // Arrange, Given

      const emptyPath = '';

      // Act, When

      const action = () =>
        new FileSystemMonitoring(emptyPath, Math.random() * 100);

      // Assert, Then
      expect(action).toThrowError(InvalidArgumentError);
    });
    test('Não aceita path em branco', () => {
      // Arrange, Given

      const emptyPath = '     ';

      // Act, When

      const action = () =>
        new FileSystemMonitoring(emptyPath, Math.random() * 100);

      // Assert, Then
      expect(action).toThrowError(InvalidArgumentError);
    });
    test('Não aceita interval igual a zero', () => {
      // Arrange, Given

      const zero = 0;

      // Act, When

      const action = () =>
        new FileSystemMonitoring(Math.random().toString(), zero);

      // Assert, Then

      expect(zero).toBe(0);
      expect(action).toThrowError(InvalidArgumentError);
    });
    test('Não aceita interval menor que zero', () => {
      // Arrange, Given

      const lessThanZero = Math.random() * 100 * -1;

      // Act, When

      const action = () =>
        new FileSystemMonitoring(Math.random().toString(), lessThanZero);

      // Assert, Then

      expect(lessThanZero).toBeLessThan(0);
      expect(action).toThrowError(InvalidArgumentError);
    });
    test('Por padrão instancia ativo', () => {
      // Arrange, Given
      // Act, When

      const sut = new FileSystemMonitoring(
        Math.random().toString(),
        Math.random() * 100
      );

      // Assert, Then
      expect(sut.isActive).toBe(true);
    });
    test('Por padrão interval é 1 segundo', () => {
      // Arrange, Given

      const oneSecond = 1000;

      // Act, When

      const sut = new FileSystemMonitoring(Math.random().toString());

      // Assert, Then

      expect(sut.interval).toBe(oneSecond);
    });
    test('Pode especificar não instanciar ativo', () => {
      // Arrange, Given

      const active = false;

      // Act, When

      const sut = new FileSystemMonitoring(
        Math.random().toString(),
        Math.random() * 100,
        active
      );

      // Assert, Then

      expect(active).toBe(false);
      expect(sut.isActive).toBe(active);
    });
  });
  describe('Propriedade interval', () => {
    test('não aceita valor zero', () => {
      // Arrange, Given

      const zero = 0;
      const sut = new FileSystemMonitoring(
        Math.random().toString(),
        Math.random() * 100
      );

      // Act, When

      const action = () => (sut.interval = zero);

      // Assert, Then

      expect(zero).toBe(0);
      expect(action).toThrowError(InvalidArgumentError);
    });
    test('não aceita valor menor que zero', () => {
      // Arrange, Given

      const lessThanZero = Math.random() * 100 * -1;
      const sut = new FileSystemMonitoring(
        Math.random().toString(),
        Math.random() * 100
      );

      // Act, When

      const action = () => (sut.interval = lessThanZero);

      // Assert, Then

      expect(lessThanZero).toBeLessThan(0);
      expect(action).toThrowError(InvalidArgumentError);
    });
    test('aceita valores maiores que zero', () => {
      // Arrange, Given

      const greaterThanZero = Math.random() * 100;
      const sut = new FileSystemMonitoring(
        Math.random().toString(),
        Math.random() * 100
      );

      // Act, When

      sut.interval = greaterThanZero;

      // Assert, Then

      expect(greaterThanZero).toBeGreaterThan(0);
      expect(greaterThanZero).toBeGreaterThanOrEqual(sut.interval);
    });
    test('os valores são armazenados como inteiro', () => {
      // Arrange, Given

      const interval = Math.random() * 100;
      const intervalAsInteger = Math.floor(interval);

      const sut = new FileSystemMonitoring(
        Math.random().toString(),
        Math.random() * 100
      );

      // Act, When

      sut.interval = interval;

      // Assert, Then

      expect(sut.interval).not.toBe(interval);
      expect(sut.interval).toBe(intervalAsInteger);
    });
    test('se mudar o valor quando a instância não é ativa não deve iniciar o timer', () => {
      // Arrange, Given

      const active = false;
      const sut = new FileSystemMonitoring(
        Math.random().toString(),
        Math.random() * 100,
        active
      );

      // Act, When

      sut.interval += 1;

      // Assert, Then

      expect(sut.isActive).toBe(false);
    });
    test('se mudar o valor quando a instância é ativa reinicia o timer', () => {
      // Arrange, Given
      // Act, When
      // Assert, Then
      // TODO: Implementar, linhas 58, 62
    });
  });
  test('clearListeners', () => {
    // Arrange, Given

    const sut = new FileSystemMonitoring(
      Math.random().toString(),
      Math.random() * 100
    );

    sut.onCreated.add(jest.fn());
    sut.onDeleted.add(jest.fn());

    // Act, When

    const beforeClear = sut.onCreated.size + sut.onDeleted.size;
    sut.clearListeners();
    const afterClear = sut.onCreated.size + sut.onDeleted.size;

    // Assert, Then

    expect(beforeClear).toBe(2);
    expect(afterClear).toBe(0);
  });
  test('Deve atualizar lastFields após modificação do arquivo', async () => {
    return new Promise<void>(resolve => {
      // Arrange, Given

      const intervalToWaitFor = 1;
      const file = `test-file-${Math.random()}.txt`;

      const sut = new FileSystemMonitoring(file, intervalToWaitFor);

      setTimeout(() => {
        // Act, When

        const before = sut.lastFields;
        fs.writeFileSync(file, Math.random().toString());

        setTimeout(() => {
          const after = sut.lastFields;

          // Assert, Then

          expect(before.exists).toBe(false);
          expect(after.exists).toBe(true);

          resolve();
        }, intervalToWaitFor * 2);
      }, intervalToWaitFor * 2);
    });
  });
  describe('start', () => {
    test('múltiplas chamadas não devem resultar em erros', () => {
      // Arrange, Given

      const sut = new FileSystemMonitoring(Math.random().toString());

      // Act, When

      const multipleStart = () => {
        sut.start();
        sut.start();
        sut.start();
      };

      // Assert, Then

      expect(multipleStart).not.toThrowError();
    });
    test('deve monitorar apenas após start', async () => {
      return new Promise<void>(resolve => {
        // Arrange, Given

        const getStarted = false;
        const intervalToWaitFor = 1;
        const file = `test-file-${Math.random()}.txt`;

        const sut = new FileSystemMonitoring(
          file,
          intervalToWaitFor,
          getStarted
        );

        const beforeInstance = sut.lastFields;
        fs.writeFileSync(file, Math.random().toString());

        setTimeout(() => {
          // Act, When

          const beforeStart = sut.lastFields;
          sut.start();

          setTimeout(() => {
            const afterStart = sut.lastFields;

            // Assert, Then

            expect(beforeInstance.exists).toBeUndefined();
            expect(beforeStart.exists).toBeUndefined();
            expect(afterStart.exists).toBe(true);

            resolve();
          }, intervalToWaitFor * 2);
        }, intervalToWaitFor * 2);
      });
    });
  });
  describe('stop', () => {
    test('múltiplas chamadas não devem resultar em erros', () => {
      // Arrange, Given

      const sut = new FileSystemMonitoring(Math.random().toString());

      // Act, When

      const multipleStop = () => {
        sut.stop();
        sut.stop();
        sut.stop();
      };

      // Assert, Then

      expect(multipleStop).not.toThrowError();
    });
    test('deve parar de monitorar apenas após stop', async () => {
      return new Promise<void>(resolve => {
        // Arrange, Given

        const intervalToWaitFor = 1;
        const file = `test-file-${Math.random()}.txt`;
        fs.writeFileSync(file, Math.random().toString());

        const sut = new FileSystemMonitoring(file, intervalToWaitFor);

        setTimeout(() => {
          // Act, When

          const beforeStop = sut.lastFields;
          sut.stop();
          fs.unlinkSync(file);

          setTimeout(() => {
            const afterStop = sut.lastFields;

            // Assert, Then

            expect(beforeStop.exists).toBe(true);
            expect(afterStop.exists).toBe(true);
            expect(fs.existsSync(file)).toBe(false);

            resolve();
          }, intervalToWaitFor * 2);
        }, intervalToWaitFor * 2);
      });
    });
  });
});
