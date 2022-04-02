import {
  HelperFileSystem,
  InvalidArgumentError,
  InvalidExecutionError
} from '../../ts';

describe('Classe HelperFileSystem', () => {
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
  });
});
