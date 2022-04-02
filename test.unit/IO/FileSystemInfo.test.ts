import { FileSystemInfo } from '../../ts';

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
});
