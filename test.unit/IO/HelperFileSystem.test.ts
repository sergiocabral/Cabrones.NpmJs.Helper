import {
  HelperFileSystem,
  InvalidArgumentError,
  InvalidExecutionError
} from '../../ts';
import * as fs from 'fs';

describe('Classe HelperFileSystem', () => {
  afterEach(() => {
    const items = fs.readdirSync('.').filter(item => item.startsWith('test-'));
    for (const item of items) {
      HelperFileSystem.deleteRecursive(item);
    }
  });
  test('Não deve permitir instanciar', () => {
    // Arrange, Given
    // Act, When

    const instantiate = () => new HelperFileSystem();

    // Assert, Then

    expect(instantiate).toThrowError(InvalidExecutionError);
  });
  describe('splitPath()', () => {
    test('Deve lançar erro se separadores não forem informados', () => {
      // Arrange, Given

      const emptySeparators: string[] = [];

      // Act, When

      const instantiate = () => HelperFileSystem.splitPath('', emptySeparators);

      // Assert, Then

      expect(instantiate).toThrowError(InvalidArgumentError);
    });
    test('Deve separar caminho por padrão para qualquer barras \\ ou /', () => {
      // Arrange, Given

      const path = '/folder1/folder2\\folder3\\folder4';

      // Act, When

      const parts = HelperFileSystem.splitPath(path);

      // Assert, Then

      expect(parts.length).toBe(5);
      expect(parts).toStrictEqual([
        '',
        'folder1',
        'folder2',
        'folder3',
        'folder4'
      ]);
    });
    test('Ao separar deve manter as partes como são', () => {
      // Arrange, Given

      const path = '  /  espaço  //  ';

      // Act, When

      const parts = HelperFileSystem.splitPath(path);

      // Assert, Then

      expect(parts).toStrictEqual(['  ', '  espaço  ', '', '  ']);
    });
    test('Pode especificar outros separadores', () => {
      // Arrange, Given

      const path = 'part1:part2///part3|part4';
      const separators: string[] = ['|', '///', ':'];

      // Act, When

      const parts = HelperFileSystem.splitPath(path, separators);

      // Assert, Then

      expect(parts.length).toBe(4);
      expect(parts).toStrictEqual(['part1', 'part2', 'part3', 'part4']);
    });
  });
  describe('getExtension()', () => {
    test('Deve lançar erro se marcadores de extensão não forem informados', () => {
      // Arrange, Given

      const emptyExtensionMarks: string[] = [];

      // Act, When

      const instantiate = () =>
        HelperFileSystem.getExtension('', emptyExtensionMarks);

      // Assert, Then

      expect(instantiate).toThrowError(InvalidArgumentError);
    });
    test('Deve lançar erro se um marcador for vazio', () => {
      // Arrange, Given

      const listWithemptyExtensionMark: string[] = ['.', ''];

      // Act, When

      const instantiate = () =>
        HelperFileSystem.getExtension('', listWithemptyExtensionMark);

      // Assert, Then

      expect(instantiate).toThrowError(InvalidArgumentError);
    });
    test('Pega a extensão por padrão separada por ponto .', () => {
      // Arrange, Given

      const expectedExtension = '.exe';
      const filename = `file.name${expectedExtension}`;

      // Act, When

      const receivedExtension = HelperFileSystem.getExtension(filename);

      // Assert, Then

      expect(receivedExtension).toBe(expectedExtension);
    });
    test('Pega a extensão especificando o marcadores', () => {
      // Arrange, Given

      const extensionMark = '---';
      const expectedExtension = `${extensionMark}exe`;
      const filename = `file${extensionMark}name${expectedExtension}`;

      // Act, When

      const receivedExtension = HelperFileSystem.getExtension(filename, [
        extensionMark
      ]);

      // Assert, Then

      expect(receivedExtension).toBe(expectedExtension);
    });
    test('Pega a extensão especificando múltiplos marcadores', () => {
      // Arrange, Given

      const mark1 = '@@';
      const mark2 = '##';
      const extension = 'exe';
      const filename1 = `file${mark1}${extension}`;
      const filename2 = `file${mark2}${extension}`;

      // Act, When

      const receivedExtension1 = HelperFileSystem.getExtension(filename1, [
        mark1,
        mark2
      ]);
      const receivedExtension2 = HelperFileSystem.getExtension(filename2, [
        mark1,
        mark2
      ]);

      // Assert, Then

      expect(receivedExtension1).toBe(`${mark1}${extension}`);
      expect(receivedExtension2).toBe(`${mark2}${extension}`);
    });
    test('Pega a extensão baseada no primeiro marcador na lista', () => {
      // Arrange, Given

      const mark1 = '@@';
      const mark2 = '##';
      const expectedExtension = 'exe';
      const notExpectedExtension = 'com';
      const filename = `file${mark2}${notExpectedExtension}${mark1}${expectedExtension}`;

      // Act, When

      const receivedExtension = HelperFileSystem.getExtension(filename, [
        mark1,
        mark2
      ]);

      // Assert, Then

      expect(receivedExtension).not.toBe(`${mark2}${notExpectedExtension}`);
      expect(receivedExtension).toBe(`${mark1}${expectedExtension}`);
    });
    test('Pega a extensão baseada no primeiro marcador na lista mesmo que contenha outros marcadores', () => {
      // Arrange, Given

      const mark1 = '@@';
      const mark2 = '##';
      const extensionFirst = 'exe';
      const extensionSecond = 'com';
      const filename = `file${mark1}${extensionSecond}${mark2}${extensionFirst}`;

      // Act, When

      const receivedExtension = HelperFileSystem.getExtension(filename, [
        mark1,
        mark2
      ]);

      // Assert, Then

      expect(receivedExtension).not.toBe(`${mark2}${extensionFirst}`);
      expect(receivedExtension).toBe(
        `${mark1}${extensionSecond}${mark2}${extensionFirst}`
      );
    });
    test('Deve pegar a extensão junto com o marcador', () => {
      // Arrange, Given

      const mark = '@@';
      const extension = 'exe';
      const filename = `file${mark}${extension}`;

      // Act, When

      const receivedExtension = HelperFileSystem.getExtension(filename, [mark]);

      // Assert, Then

      expect(receivedExtension).not.toBe(extension);
      expect(receivedExtension).toBe(`${mark}${extension}`);
    });
    test('Extensão deve ser vazia se não existir', () => {
      // Arrange, Given

      const filename = `file-without-extension`;

      // Act, When

      const receivedExtension = HelperFileSystem.getExtension(filename);

      // Assert, Then

      expect(receivedExtension).toBe('');
    });
  });
  describe('deleteRecursive', () => {
    test('Se caminho não existir não dá erro e retorna zero.', () => {
      // Arrange, Given

      const path = '/non/exists/file/or/dir';

      // Act, When

      const affected = HelperFileSystem.deleteRecursive(path);

      // Assert, Then

      expect(affected).toBe(0);
    });
    test('Deve excluir arquivo e retorna 1 (um)', () => {
      // Arrange, Given

      const file = `test-file-${Math.random()}`;
      fs.writeFileSync(file, 'Created by test. Delete me, please.');

      // Act, When

      const affected = HelperFileSystem.deleteRecursive(file);
      const fileExists = fs.existsSync(file);

      // Assert, Then

      expect(fileExists).toBe(false);
      expect(affected).toBe(1);
    });
    test('Deve excluir diretórios e retorna o total excluído', () => {
      // Arrange, Given

      const directoryBase = `test-dir-${Math.random()}`;
      fs.mkdirSync(directoryBase);
      fs.mkdirSync(`${directoryBase}/subdir`);
      fs.mkdirSync(`${directoryBase}/subdir2`);
      fs.writeFileSync(
        `${directoryBase}/subdir2/file2`,
        'Created by test. Delete me, please.'
      );

      // Act, When

      const affected = HelperFileSystem.deleteRecursive(directoryBase);
      const fileExists = fs.existsSync(directoryBase);

      // Assert, Then

      expect(fileExists).toBe(false);
      expect(affected).toBe(4);
    });
  });
  describe('createRecursive', () => {
    test('se já existir diretório e criar diretório retorna zero', () => {
      // Arrange, Given

      const directoryBase = `test-dir-${Math.random()}`;
      fs.mkdirSync(directoryBase);

      // Act, When

      const affected = HelperFileSystem.createRecursive(directoryBase);

      // Assert, Then

      expect(affected).toBe(0);
    });
    test('se já existir diretório e criar arquivo lança erro', () => {
      // Arrange, Given

      const createFile = 'Created by test. Delete-me, please.';
      const directoryBase = `test-dir-${Math.random()}`;
      fs.mkdirSync(directoryBase);

      // Act, When

      const action = () =>
        HelperFileSystem.createRecursive(directoryBase, createFile);

      // Assert, Then

      expect(action).toThrowError(InvalidExecutionError);
    });
    test('se já existir arquivo e criar arquivo retorna zero', () => {
      // Arrange, Given

      const createFile = 'Created by test. Delete-me, please.';
      const file = `test-file-${Math.random()}`;
      fs.writeFileSync(file, 'Created by test. Delete me, please.');

      // Act, When

      const affected = HelperFileSystem.createRecursive(file, createFile);

      // Assert, Then

      expect(affected).toBe(0);
    });
    test('se já existir arquivo e criar diretório lança erro', () => {
      // Arrange, Given

      const file = `test-file-${Math.random()}`;
      fs.writeFileSync(file, 'Created by test. Delete me, please.');

      // Act, When

      const action = () => HelperFileSystem.createRecursive(file);

      // Assert, Then

      expect(action).toThrowError(InvalidExecutionError);
    });
    test('criar diretório', () => {
      // Arrange, Given

      const directory = `test-dir-${Math.random()}/dir2/dir3/dir4`;
      const existsBefore = fs.existsSync(directory);

      // Act, When

      const affected = HelperFileSystem.createRecursive(directory);
      const existsAfter = fs.existsSync(directory);
      const isDirectory = fs.lstatSync(directory).isDirectory();

      // Assert, Then

      expect(existsBefore).toBe(false);
      expect(existsAfter).toBe(true);
      expect(isDirectory).toBe(true);
      expect(affected).toBe(4);
    });
    test('criar diretório com barras repetidas', () => {
      // Arrange, Given

      const directory = `test-dir-${Math.random()}/\\   \\dir2/dir3////dir4`;
      const existsBefore = fs.existsSync(directory);

      // Act, When

      const affected = HelperFileSystem.createRecursive(directory);
      const existsAfter = fs.existsSync(directory);
      const isDirectory = fs.lstatSync(directory).isDirectory();

      // Assert, Then

      expect(existsBefore).toBe(false);
      expect(existsAfter).toBe(true);
      expect(isDirectory).toBe(true);
      expect(affected).toBe(5);
    });
    test('criar arquivo', () => {
      // Arrange, Given

      const createFile = 'Created by test. Delete-me, please.';
      const file = `test-dir-${Math.random()}/dir2/dir3/file`;
      const existsBefore = fs.existsSync(file);

      // Act, When

      const affected = HelperFileSystem.createRecursive(file, createFile);
      const existsAfter = fs.existsSync(file);
      const isFile = !fs.lstatSync(file).isDirectory();

      // Assert, Then

      expect(existsBefore).toBe(false);
      expect(existsAfter).toBe(true);
      expect(isFile).toBe(true);
      expect(affected).toBe(4);
    });
    test('criar arquivo com barras repetidas', () => {
      // Arrange, Given

      const createFile = 'Created by test. Delete-me, please.';
      const file = `test-dir-${Math.random()}/\\   \\dir2/dir3////file`;
      const existsBefore = fs.existsSync(file);

      // Act, When

      const affected = HelperFileSystem.createRecursive(file, createFile);
      const existsAfter = fs.existsSync(file);
      const isFile = !fs.lstatSync(file).isDirectory();

      // Assert, Then

      expect(existsBefore).toBe(false);
      expect(existsAfter).toBe(true);
      expect(isFile).toBe(true);
      expect(affected).toBe(5);
    });
    test('criar arquivo com respectivo conteúdo', () => {
      // Arrange, Given

      const fileContent = `Created by test. Delete me, please. ${Math.random().toString()}`;
      const file = `test-file-${Math.random()}`;

      // Act, When

      HelperFileSystem.createRecursive(file, fileContent);
      const fileContentReaded = fs.readFileSync(file).toString();

      // Assert, Then

      expect(fileContentReaded).toBe(fileContent);
    });
  });
  describe('getDirectorySize()', () => {
    test('Se caminho não existe deve lançar erro', () => {
      // Arrange, Given

      const directory = '/dir1/dir2';

      // Act, When

      const action = () => HelperFileSystem.getDirectorySize(directory);

      // Assert, Then

      expect(action).toThrowError();
    });
    test('Se caminho é um arquivo deve lançar erro', () => {
      // Arrange, Given

      const file = `test-file-${Math.random()}`;
      HelperFileSystem.createRecursive(
        file,
        'Created by test. Delete me, please.'
      );

      // Act, When

      const action = () => HelperFileSystem.getDirectorySize(file);

      // Assert, Then

      expect(action).toThrowError();
    });
    test('Deve calcular o tamanho em bytes do diretório', () => {
      // Arrange, Given

      const content = `Created by test. Delete me, please. ${Math.random()}`;
      const directoryBase = `test-dir-delete-me-${Math.random()}`;

      HelperFileSystem.createRecursive(
        `${directoryBase}/dir1/dir2/file1.txt`,
        content
      );
      HelperFileSystem.createRecursive(
        `${directoryBase}/dir1/dir2/file2.txt`,
        content
      );
      HelperFileSystem.createRecursive(
        `${directoryBase}/dir1/file3.txt`,
        content
      );

      const expectedSize = content.length * 3;

      // Act, When

      const size = HelperFileSystem.getDirectorySize(directoryBase);

      // Assert, Then

      expect(size).toBe(expectedSize);
    });
  });
});
