import { FileSystemInfo } from '../../ts';

describe('Classe FileSystemInfo', () => {
  test('Pode instanciar com qualquer caminho de arquivo', () => {
      // Arrange, Given

      const invalidFileName = `!@#$%¨&*()${Math.random()}<>:^\`{}][´~;.,]`;

      // Act, When

      const sut = new FileSystemInfo(invalidFileName);

      // Assert, Then

      expect(sut.path).toBe(invalidFileName);
  });
  test('Ao instanciar deve obter o nome do arquivo', () => {
      // Arrange, Given

      const name = `file-${Math.random()}.log`;
      const path = `/mnt/sda/folder/${name}`;

      // Act, When

      const sut = new FileSystemInfo(path);

      // Assert, Then

      expect(sut.name).toBe(name);
  });
});
