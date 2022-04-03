import { FileSystemFields, HelperFileSystem } from '../../../ts';
import fs from 'fs';

describe('Classe FileSystemFields', () => {
  const originals: Record<string, any> = {};

  beforeEach(() => {
    originals['FileSystemFields.isEquals'] = FileSystemFields.isEquals;
    originals['FileSystemFields.diff'] = FileSystemFields.diff;
  });

  afterEach(() => {
    FileSystemFields.isEquals = originals['FileSystemFields.isEquals'];
    FileSystemFields.diff = originals['FileSystemFields.diff'];

    const items = fs.readdirSync('.').filter(item => item.startsWith('test-'));
    for (const item of items) {
      HelperFileSystem.deleteRecursive(item);
    }
  });

  describe('Construtor', () => {
    test('deve poder instanciar sem parâmetros', () => {
      // Arrange, Given
      // Act, When

      const sut = new FileSystemFields();

      // Assert, Then

      expect(sut.path).toBeUndefined();
    });
    test('deve poder instanciar especificando o caminho', () => {
      // Arrange, Given

      const path = Math.random().toString();

      // Act, When

      const sut = new FileSystemFields(path);

      // Assert, Then

      expect(sut.path).toBe(path);
    });
  });
  describe('isEquals', () => {
    test('isEquals deve chamar diff', () => {
      // Arrange, Given

      const mockFunction = jest.fn(() => []);
      FileSystemFields.diff = mockFunction;

      // Act, When

      FileSystemFields.isEquals(undefined, undefined);

      // Assert, Then

      expect(mockFunction).toBeCalledTimes(1);
    });
    test('isEquals da instância deve chamar o método estático', () => {
      // Arrange, Given

      const mockFunction = jest.fn();
      FileSystemFields.isEquals = mockFunction;

      // Act, When

      new FileSystemFields().isEquals(undefined);

      // Assert, Then

      expect(mockFunction).toBeCalledTimes(1);
    });
    test('isEquals deve ser TRUE quando o array de diff NÃO TEM ITENS', () => {
      // Arrange, Given

      const expectedResult = true;

      const mockFunction = jest.fn(() => []);
      FileSystemFields.diff = mockFunction;

      // Act, When

      const result = FileSystemFields.isEquals(undefined, undefined);

      // Assert, Then

      expect(result).toBe(expectedResult);
    });
    test('isEquals deve ser FALSE quando o array de diff TEM ITENS', () => {
      // Arrange, Given

      const expectedResult = false;

      const mockFunction = jest.fn(() => ['123']);
      FileSystemFields.diff = mockFunction;

      // Act, When

      const result = FileSystemFields.isEquals(undefined, undefined);

      // Assert, Then

      expect(result).toBe(expectedResult);
    });
  });
  describe('diff', () => {
    test('diff da instância deve chamar o método estático', () => {
      // Arrange, Given

      const mockFunction = jest.fn();
      FileSystemFields.diff = mockFunction;

      // Act, When

      new FileSystemFields().diff(undefined);

      // Assert, Then

      expect(mockFunction).toBeCalledTimes(1);
    });
  });

  // TODO: Testar método `diff`
});
