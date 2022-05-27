import {
  FileSystemMonitoring,
  HelperFileSystem,
  InvalidArgumentError,
  IFileSystemMonitoringEventData
} from '../../../ts';
import fs from 'fs';

describe('Classe FileSystemMonitoring', () => {
  afterAll(async () => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        const items = fs
          .readdirSync('.')
          .filter(item => item.startsWith('test-'));
        for (const item of items) {
          HelperFileSystem.deleteRecursive(item);
        }
        resolve();
      }, 100);
    });
  });
  describe('Instancia da classe', () => {
    test('Instanciando com valores válidos', () => {
      // Arrange, Given

      const path = Math.random().toString();
      const interval = Math.floor(Math.random() * 1000);

      // Act, When

      const sut = new FileSystemMonitoring(path, interval);

      // Assert, Then

      expect(sut.path).toBe(path);
      expect(sut.interval).toBe(interval);

      // Tear Down

      sut.stop();
    });
    test('Não aceita path vazio', () => {
      // Arrange, Given

      const emptyPath = '';

      // Act, When

      const action = () =>
        new FileSystemMonitoring(emptyPath, Math.random() * 1000);

      // Assert, Then
      expect(action).toThrowError(InvalidArgumentError);
    });
    test('Não aceita path em branco', () => {
      // Arrange, Given

      const emptyPath = '     ';

      // Act, When

      const action = () =>
        new FileSystemMonitoring(emptyPath, Math.random() * 1000);

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

      const lessThanZero = Math.random() * 1000 * -1;

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
        Math.random() * 1000
      );

      // Assert, Then
      expect(sut.isActive).toBe(true);

      // Tear Down

      sut.stop();
    });
    test('Por padrão interval é 1 segundo', () => {
      // Arrange, Given

      const oneSecond = 1000;

      // Act, When

      const sut = new FileSystemMonitoring(Math.random().toString());

      // Assert, Then

      expect(sut.interval).toBe(oneSecond);

      // Tear Down

      sut.stop();
    });
    test('Pode especificar não instanciar ativo', () => {
      // Arrange, Given

      const active = false;

      // Act, When

      const sut = new FileSystemMonitoring(
        Math.random().toString(),
        Math.random() * 1000,
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
        Math.random() * 1000
      );

      // Act, When

      const action = () => (sut.interval = zero);

      // Assert, Then

      expect(zero).toBe(0);
      expect(action).toThrowError(InvalidArgumentError);

      // Tear Down

      sut.stop();
    });
    test('não aceita valor menor que zero', () => {
      // Arrange, Given

      const lessThanZero = Math.random() * 1000 * -1;
      const sut = new FileSystemMonitoring(
        Math.random().toString(),
        Math.random() * 1000
      );

      // Act, When

      const action = () => (sut.interval = lessThanZero);

      // Assert, Then

      expect(lessThanZero).toBeLessThan(0);
      expect(action).toThrowError(InvalidArgumentError);

      // Tear Down

      sut.stop();
    });
    test('aceita valores maiores que zero', () => {
      // Arrange, Given

      const greaterThanZero = Math.random() * 1000;
      const sut = new FileSystemMonitoring(
        Math.random().toString(),
        Math.random() * 1000
      );

      // Act, When

      sut.interval = greaterThanZero;

      // Assert, Then

      expect(greaterThanZero).toBeGreaterThan(0);
      expect(greaterThanZero).toBeGreaterThanOrEqual(sut.interval);

      // Tear Down

      sut.stop();
    });
    test('os valores são armazenados como inteiro', () => {
      // Arrange, Given

      const interval = Math.random() * 1000;
      const intervalAsInteger = Math.floor(interval);

      const sut = new FileSystemMonitoring(
        Math.random().toString(),
        Math.random() * 1000
      );

      // Act, When

      sut.interval = interval;

      // Assert, Then

      expect(sut.interval).not.toBe(interval);
      expect(sut.interval).toBe(intervalAsInteger);

      // Tear Down

      sut.stop();
    });
    test('se mudar o valor quando a instância não é ativa não deve iniciar o timer', () => {
      // Arrange, Given

      const active = false;
      const sut = new FileSystemMonitoring(
        Math.random().toString(),
        Math.random() * 1000,
        active
      );

      // Act, When

      sut.interval += 1;

      // Assert, Then

      expect(sut.isActive).toBe(false);
    });
    test('se mudar o valor quando a instância é ativa faz uma verificação imediatamente', () => {
      // Arrange, Given

      const file = `test-file-${Math.random()}.txt`;

      const sut = new FileSystemMonitoring(file);
      fs.writeFileSync(file, Math.random().toString());

      // Act, When

      const readFirst = sut.lastFields;
      sut.interval = Math.random() * 1000;
      const readAfter = sut.lastFields;

      // Assert, Then

      expect(readFirst.exists).toBe(false);
      expect(readAfter.exists).toBe(true);

      // Tear Down

      sut.stop();
    });
    test('deve poder mudar a frequência do timer', async () => {
      return new Promise<void>(resolve => {
        // Arrange, Given

        const graterIntervalToWaitFor = 10;
        const minorIntervalToWaitFor = 2;
        const file = `test-file-${Math.random()}.txt`;
        fs.writeFileSync(file, Math.random().toString());

        const sut = new FileSystemMonitoring(file, minorIntervalToWaitFor);

        const readFirst = sut.lastFields;

        setTimeout(() => {
          // Act, When

          sut.interval = graterIntervalToWaitFor;
          fs.unlinkSync(file);

          setTimeout(() => {
            const readSecond = sut.lastFields;

            setTimeout(() => {
              const readThird = sut.lastFields;

              // Assert, Then

              expect(readFirst.exists).toBe(true);
              expect(readSecond.exists).toBe(true);
              expect(readThird.exists).toBe(false);

              // Tear Down

              sut.stop();

              resolve();
            }, graterIntervalToWaitFor * 2);
          }, minorIntervalToWaitFor * 2);
        }, minorIntervalToWaitFor * 2);
      });
    });
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

          // Tear Down

          sut.stop();

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

      // Tear Down

      sut.stop();
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

            // Tear Down

            sut.stop();

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
  describe('Teste dos eventos', function () {
    test('clearListeners', () => {
      // Arrange, Given

      const sut = new FileSystemMonitoring(
        Math.random().toString(),
        Math.random() * 1000
      );

      sut.onCreated.add(jest.fn());
      sut.onDeleted.add(jest.fn());
      sut.onModified.add(jest.fn());

      // Act, When

      const beforeClear =
        sut.onCreated.size + sut.onDeleted.size + sut.onModified.size;
      sut.clearListeners();
      const afterClear =
        sut.onCreated.size + sut.onDeleted.size + sut.onModified.size;

      // Assert, Then

      expect(beforeClear).toBe(3);
      expect(afterClear).toBe(0);

      // Tear Down

      sut.stop();
    });
    test('eventos não devem ser disparados com start()', async () => {
      return new Promise<void>(resolve => {
        // Arrange, Given

        const intervalToWaitFor = 1;
        const file = `test-file-${Math.random()}.txt`;

        fs.writeFileSync(file, Math.random().toString());

        const sut = new FileSystemMonitoring(file, intervalToWaitFor, false);

        let triggered = false;
        sut.onCreated.add(() => {
          triggered = true;
        });

        // Act, When

        sut.start();

        setTimeout(() => {
          // Assert, Then

          expect(triggered).toBe(false);

          // Tear Down

          sut.stop();

          resolve();
        }, intervalToWaitFor * 2);
      });
    });
    test('onCreated', async () => {
      return new Promise<void>(resolve => {
        // Arrange, Given

        const intervalToWaitFor = 1;
        const file = `test-file-${Math.random()}.txt`;

        const sut = new FileSystemMonitoring(file, intervalToWaitFor);

        let eventReceived:
          | undefined
          | [boolean, IFileSystemMonitoringEventData | undefined];

        // Act, When

        sut.onCreated.add((result, data) => {
          eventReceived = [result, data];
        });

        fs.writeFileSync(file, Math.random().toString());

        setTimeout(() => {
          // Assert, Then

          expect(eventReceived).toBeDefined();

          if (eventReceived) {
            const result = eventReceived[0];
            const eventData = eventReceived[1];

            expect(result).toBe(true);
            expect(eventData).toBeDefined();
            expect(eventData?.before.exists).toBe(false);
            expect(eventData?.after.exists).toBe(true);
          }

          // Tear Down

          sut.stop();

          resolve();
        }, intervalToWaitFor * 2);
      });
    });
    test('onDeleted', async () => {
      return new Promise<void>(resolve => {
        // Arrange, Given

        const intervalToWaitFor = 1;
        const file = `test-file-${Math.random()}.txt`;
        fs.writeFileSync(file, Math.random().toString());

        const sut = new FileSystemMonitoring(file, intervalToWaitFor);

        let eventReceived:
          | undefined
          | [boolean, IFileSystemMonitoringEventData | undefined];

        // Act, When

        sut.onDeleted.add((result, data) => {
          eventReceived = [result, data];
        });

        fs.unlinkSync(file);

        setTimeout(() => {
          // Assert, Then

          expect(eventReceived).toBeDefined();

          if (eventReceived) {
            const result = eventReceived[0];
            const eventData = eventReceived[1];

            expect(result).toBe(true);
            expect(eventData).toBeDefined();
            expect(eventData?.before.exists).toBe(true);
            expect(eventData?.after.exists).toBe(false);
          }

          // Tear Down

          sut.stop();

          resolve();
        }, intervalToWaitFor * 2);
      });
    });
    describe('onModified', () => {
      test('ao modificar arquivo deve disparar o evento', async () => {
        return new Promise<void>(resolve => {
          // Arrange, Given

          const intervalToWaitFor = 5;
          const file = `test-file-${Math.random()}.txt`;
          fs.writeFileSync(file, Math.random().toString());

          const sut = new FileSystemMonitoring(file, intervalToWaitFor);

          let eventReceived:
            | undefined
            | [boolean, IFileSystemMonitoringEventData | undefined];

          // Act, When

          sut.onModified.add((result, data) => {
            eventReceived = [result, data];
          });

          fs.appendFileSync(file, Math.random().toString());

          setTimeout(() => {
            // Assert, Then

            expect(eventReceived).toBeDefined();

            if (eventReceived) {
              const result = eventReceived[0];
              const eventData = eventReceived[1];

              expect(result).toBe(true);
              expect(eventData).toBeDefined();
              expect(eventData?.before.modification).toBeDefined();
              expect(eventData?.after.modification).toBeDefined();
              expect(eventData?.before.size).toBeDefined();
              expect(eventData?.after.size).toBeDefined();
              expect(
                (eventData?.before.modification as Date).getTime()
              ).toBeLessThan((eventData?.after.modification as Date).getTime());
              expect(eventData?.before.size as number).toBeLessThan(
                eventData?.after.size as number
              );
            }

            // Tear Down

            sut.stop();

            resolve();
          }, intervalToWaitFor * 2);
        });
      });
      test('não deve disparar se o arquivo for criado', async () => {
        return new Promise<void>(resolve => {
          // Arrange, Given

          const intervalToWaitFor = 5;
          const file = `test-file-${Math.random()}.txt`;

          const sut = new FileSystemMonitoring(file, intervalToWaitFor);

          let eventReceived = false;

          // Act, When

          sut.onModified.add(() => {
            eventReceived = true;
          });
          fs.writeFileSync(file, Math.random().toString());

          setTimeout(() => {
            // Assert, Then

            expect(eventReceived).toBe(false);

            // Tear Down

            sut.stop();

            resolve();
          }, intervalToWaitFor * 2);
        });
      });
      test('não deve disparar se o arquivo for excluído', async () => {
        return new Promise<void>(resolve => {
          // Arrange, Given

          const intervalToWaitFor = 5;
          const file = `test-file-${Math.random()}.txt`;
          fs.writeFileSync(file, Math.random().toString());

          const sut = new FileSystemMonitoring(file, intervalToWaitFor);

          let eventReceived = false;

          // Act, When

          sut.onModified.add(() => {
            eventReceived = true;
          });
          fs.unlinkSync(file);

          setTimeout(() => {
            // Assert, Then

            expect(eventReceived).toBe(false);

            // Tear Down

            sut.stop();

            resolve();
          }, intervalToWaitFor * 2);
        });
      });
    });
  });
});
