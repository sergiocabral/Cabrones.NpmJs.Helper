import {
  HelperFileSystem,
  HelperNodeJs,
  HelperObject,
  InvalidExecutionError
} from '../../ts';
import fs from 'fs';

describe('Classe HelperNodeJs', () => {
  const originals: Record<string, any> = {};

  beforeEach(() => {
    originals['HelperNodeJs.getAllPreviousPackagesFiles'] =
      HelperNodeJs.getAllPreviousPackagesFiles;
    originals['HelperNodeJs.getAllPackagesFiles'] =
      HelperNodeJs.getAllPackagesFiles;
  });

  afterEach(() => {
    HelperNodeJs.getAllPreviousPackagesFiles =
      originals['HelperNodeJs.getAllPreviousPackagesFiles'];
    HelperNodeJs.getAllPackagesFiles =
      originals['HelperNodeJs.getAllPackagesFiles'];

    const items = fs.readdirSync('.').filter(item => item.startsWith('test-'));
    for (const item of items) {
      HelperFileSystem.deleteRecursive(item);
    }
  });
  test('Não deve permitir instanciar', () => {
    // Arrange, Given
    // Act, When

    const instantiate = () => new HelperNodeJs();

    // Assert, Then

    expect(instantiate).toThrowError(InvalidExecutionError);
  });
  describe('getAllPreviousPackagesFiles', () => {
    test('deve encontrar apenas o arquivo package.json', () => {
      // Arrange, Given

      const invalidName = 'package2.json';

      const directoryBase = `test-dir-delete-me-${Math.random()}`;

      HelperFileSystem.createRecursive(`${directoryBase}/package.json`, `{}`);
      HelperFileSystem.createRecursive(`${directoryBase}/${invalidName}`, `{}`);

      // Act, When

      const files = HelperNodeJs.getAllPreviousPackagesFiles(directoryBase);

      // Assert, Then

      expect(files.filter(file => file.endsWith(invalidName)).length).toBe(0);
    });
    test('lista os arquivos package.json em pastas prévias', () => {
      // Arrange, Given

      const directoryBase = `test-dir-delete-me-${Math.random()}`;
      const directoryInto = `${directoryBase}/dir1/dir2/dir3`;

      HelperFileSystem.createRecursive(
        `${directoryBase}/dir1/dir2/dir3/package.json`,
        `{}`
      );
      HelperFileSystem.createRecursive(
        `${directoryBase}/dir1/dir2/package.json`,
        `{}`
      );
      HelperFileSystem.createRecursive(
        `${directoryBase}/dir1/package.json`,
        `{}`
      );

      // Act, When

      const files = HelperNodeJs.getAllPreviousPackagesFiles(directoryInto);

      // Assert, Then

      expect(files.length).toBeGreaterThanOrEqual(3);
      expect(files.filter(file => file.includes('dir1')).length).toBe(3);
      expect(files.filter(file => file.includes('dir2')).length).toBe(2);
      expect(files.filter(file => file.includes('dir3')).length).toBe(1);
    });
    test('se não informar diretório usa o projeto atual', () => {
      // Arrange, Given
      // Act, When

      const files = HelperNodeJs.getAllPreviousPackagesFiles();

      // Assert, Then

      expect(files.length).toBeGreaterThanOrEqual(1);
    });
  });
  describe('getAllPackagesFiles', () => {
    test('deve encontrar apenas o arquivo package.json', () => {
      // Arrange, Given

      const invalidName = 'package2.json';

      const directoryBase = `test-dir-delete-me-${Math.random()}`;

      HelperFileSystem.createRecursive(
        `${directoryBase}/dir1/dir2/dir3/package.json`,
        `{}`
      );
      HelperFileSystem.createRecursive(
        `${directoryBase}/dir1/dir2/dir3/${invalidName}`,
        `{}`
      );

      // Act, When

      const files = HelperNodeJs.getAllPackagesFiles(directoryBase);

      // Assert, Then

      expect(files.length).toBe(1);
      expect(files.filter(file => file.endsWith(invalidName)).length).toBe(0);
    });
    test('lista os arquivos package.json em pastas posteriores', () => {
      // Arrange, Given

      const directoryBase = `test-dir-delete-me-${Math.random()}`;

      HelperFileSystem.createRecursive(
        `${directoryBase}/dir1/dir2/dir3/package.json`,
        `{}`
      );
      HelperFileSystem.createRecursive(
        `${directoryBase}/dir1/dir2/package.json`,
        `{}`
      );
      HelperFileSystem.createRecursive(
        `${directoryBase}/dir1/package.json`,
        `{}`
      );

      // Act, When

      const files = HelperNodeJs.getAllPackagesFiles(directoryBase);

      // Assert, Then

      expect(files.length).toBe(3);
      expect(files.filter(file => file.includes('dir1')).length).toBe(3);
      expect(files.filter(file => file.includes('dir2')).length).toBe(2);
      expect(files.filter(file => file.includes('dir3')).length).toBe(1);
    });
  });
  describe('getAllPreviousPackagesJson', () => {
    test('deve usar getAllPreviousPackagesFiles como base', () => {
      // Arrange, Given

      const mockFunction = jest.fn(() => []);
      HelperNodeJs.getAllPreviousPackagesFiles = mockFunction;

      // Act, When

      HelperNodeJs.getAllPreviousPackagesJson();

      // Assert, Then

      expect(mockFunction).toBeCalledTimes(1);
    });
    test('lista package.json válidos em pastas prévias', () => {
      // Arrange, Given

      const directoryBase = `test-dir-delete-me-${Math.random()}`;
      const directoryInto = `${directoryBase}/dir1/dir2/dir3`;

      HelperFileSystem.createRecursive(
        `${directoryBase}/dir1/dir2/dir3/package.json`,
        `JSON inválido`
      );
      HelperFileSystem.createRecursive(
        `${directoryBase}/dir1/dir2/package.json`,
        `JSON inválido`
      );
      HelperFileSystem.createRecursive(
        `${directoryBase}/dir1/package.json`,
        `{}`
      );

      // Act, When

      const files = HelperNodeJs.getAllPreviousPackagesJson(directoryInto);

      // Assert, Then

      expect(files.length).toBeGreaterThanOrEqual(1);
      expect(files[0].Key.includes('dir1')).toBe(true);
      expect(files[0].Value).toBeDefined();
      expect(files.filter(file => file.Key.includes('dir2')).length).toBe(0);
      expect(files.filter(file => file.Key.includes('dir3')).length).toBe(0);
    });
    test('se não informar diretório usa o projeto atual', () => {
      // Arrange, Given
      // Act, When

      const files = HelperNodeJs.getAllPreviousPackagesJson();

      // Assert, Then

      expect(files.length).toBeGreaterThanOrEqual(1);
      expect(files[0].Value).toBeDefined();
      expect(files[0].Value.name).toBeDefined();
      expect(files[0].Value.version).toBeDefined();
    });
  });
  describe('getAllPackagesJson', () => {
    test('deve usar getAllPackagesFiles como base', () => {
      // Arrange, Given

      const mockFunction = jest.fn(() => []);
      HelperNodeJs.getAllPackagesFiles = mockFunction;

      // Act, When

      HelperNodeJs.getAllPackagesJson(Math.random().toString());

      // Assert, Then

      expect(mockFunction).toBeCalledTimes(1);
    });
    test('lista package.json válidos em pastas posteriores', () => {
      // Arrange, Given

      const directoryBase = `test-dir-delete-me-${Math.random()}`;

      HelperFileSystem.createRecursive(
        `${directoryBase}/dir1/dir2/dir3/package.json`,
        `{}`
      );
      HelperFileSystem.createRecursive(
        `${directoryBase}/dir1/dir2/package.json`,
        `JSON inválido`
      );
      HelperFileSystem.createRecursive(
        `${directoryBase}/dir1/package.json`,
        `JSON inválido`
      );

      // Act, When

      const files = HelperNodeJs.getAllPackagesJson(directoryBase);

      // Assert, Then

      expect(files.length).toBeGreaterThanOrEqual(1);
      expect(files[0].Key.includes('dir3')).toBe(true);
      expect(files[0].Value).toBeDefined();
    });
  });
});
