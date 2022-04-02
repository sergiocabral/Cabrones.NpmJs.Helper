import { FileSystemInfo } from '../../ts';
import * as fs from "fs";
import {IFindFileSystemInfoConfiguration} from "../../ts/IO/IFindFileSystemInfoConfiguration";

describe('Classe FileSystemInfo', () => {
  test('Aceita qualquer caminho', () => {
      // Arrange, Given

      const invalidFileName = `!@#$%¨&*()${Math.random()}<>:^\`{}][´~;.,]`;

      // Act, When

      const sut = new FileSystemInfo(invalidFileName);

      // Assert, Then

      expect(sut.path).toBe(invalidFileName);
  });
  test('Se não houver caminho o nome será igual', () => {
      // Arrange, Given

      const name = `file-${Math.random()}.log`;

      // Act, When

      const sut = new FileSystemInfo(name);

      // Assert, Then

      expect(sut.path).toBe(name);
      expect(sut.name).toBe(name);
  });
  test('Deve obter o nome do arquivo', () => {
      // Arrange, Given

      const name = `file-${Math.random()}.log`;
      const path = `/mnt/sda/folder/${name}`;

      // Act, When

      const sut = new FileSystemInfo(path);

      // Assert, Then

      expect(sut.name).toBe(name);
  });
  test('Deve obter a extensão do arquivo', () => {
      // Arrange, Given

      const name = `file-${Math.random()}.log`;
      const path = `/mnt/sda/folder/${name}`;

      // Act, When

      const sut = new FileSystemInfo(path);

      // Assert, Then

      expect(sut.extension).toBe('.log');
  });
  test('Deve resultar em extensão vazia se não houver', () => {
      // Arrange, Given

      const name = `file-without-extension`;
      const path = `/mnt/sda/folder/${name}`;

      // Act, When

      const sut = new FileSystemInfo(path);

      // Assert, Then

      expect(sut.extension).toBe('');
  });
  describe('Verificar existência', () => {
      test('O item existe mas não foi especificado essa verificação', () => {
          // Arrange, Given

          const directory = `test-dir-delete-me-${Math.random()}`;
          const file = `test-file-delete-me-${Math.random()}`;

          fs.mkdirSync(directory);
          fs.writeFileSync(file, 'Created by test. Delete me, please.');

          // Act, When

          const sutDirectory = new FileSystemInfo(directory);
          const sutFile = new FileSystemInfo(file);

          // Assert, Then

          expect(sutDirectory.exists).toBe(false);
          expect(sutFile.exists).toBe(false);

          fs.unlinkSync(file);
          fs.rmdirSync(directory);
      });
      test('O item existe', () => {
          // Arrange, Given

          const configuration: Partial<IFindFileSystemInfoConfiguration> = {
            checkExistence: true
          };

          const directory = `test-dir-delete-me-${Math.random()}`;
          const file = `test-file-delete-me-${Math.random()}`;

          fs.mkdirSync(directory);
          fs.writeFileSync(file, 'Created by test. Delete me, please.');

          // Act, When

          const sutDirectory = new FileSystemInfo(directory, configuration);
          const sutFile = new FileSystemInfo(file, configuration);

          // Assert, Then

          expect(sutDirectory.exists).toBe(true);
          expect(sutFile.exists).toBe(true);

          fs.unlinkSync(file);
          fs.rmdirSync(directory);
      });
  })
});
