import {HelperFileSystem, InvalidArgumentError, InvalidExecutionError} from '../../ts';

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
      // Act, When

      const instantiate = () => HelperFileSystem.splitPath('', []);

      // Assert, Then

      expect(instantiate).toThrowError(InvalidArgumentError);
    });
    test('Deve separar caminho por padrão para qualquer barras \\ ou \/', () => {
      // Arrange, Given

      const path = '/folder1/folder2\\folder3\\folder4';

      // Act, When

      const parts = HelperFileSystem.splitPath(path);

      // Assert, Then

      expect(parts.length).toBe(5);
      expect(parts).toStrictEqual(['', 'folder1', 'folder2', 'folder3', 'folder4']);
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
      const separators: string[] = ['|', '///', ':']

      // Act, When

      const parts = HelperFileSystem.splitPath(path, separators);

      // Assert, Then

      expect(parts.length).toBe(4);
      expect(parts).toStrictEqual(['part1', 'part2', 'part3', 'part4']);
    });
  });
});
