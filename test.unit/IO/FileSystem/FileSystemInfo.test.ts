import { FileSystemInfo, HelperFileSystem, HelperText } from '../../../ts';
import * as fs from 'fs';
import { default as pathNode } from 'path';
import { IFindFileSystemInfoConfiguration } from '../../../ts/IO/FileSystem/IFindFileSystemInfoConfiguration';

describe('Classe FileSystemInfo', () => {
  const originals: Record<string, any> = {};

  beforeEach(() => {
    originals['HelperText.matchFilter'] = HelperText.matchFilter;
  });

  afterEach(() => {
    HelperText.matchFilter = originals['HelperText.matchFilter'];

    const items = fs.readdirSync('.').filter(item => item.startsWith('test-'));
    for (const item of items) {
      HelperFileSystem.deleteRecursive(item);
    }
  });

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
    });
  });
  describe('Verificar se é diretório', () => {
    test('Não especificado essa verificação', () => {
      // Arrange, Given

      const directory = `test-dir-delete-me-${Math.random()}`;
      const file = `test-file-delete-me-${Math.random()}`;

      fs.mkdirSync(directory);
      fs.writeFileSync(file, 'Created by test. Delete me, please.');

      // Act, When

      const sutDirectory = new FileSystemInfo(directory);
      const sutFile = new FileSystemInfo(file);

      // Assert, Then

      expect(sutDirectory.isDirectory).toBe(false);
      expect(sutDirectory.isFile).toBe(false);
      expect(sutFile.isDirectory).toBe(false);
      expect(sutFile.isFile).toBe(false);
    });
    test('Verificação especificada', () => {
      // Arrange, Given

      const configuration: Partial<IFindFileSystemInfoConfiguration> = {
        loadStats: true
      };

      const directory = `test-dir-delete-me-${Math.random()}`;
      const file = `test-file-delete-me-${Math.random()}`;

      fs.mkdirSync(directory);
      fs.writeFileSync(file, 'Created by test. Delete me, please.');

      // Act, When

      const sutDirectory = new FileSystemInfo(directory, configuration);
      const sutFile = new FileSystemInfo(file, configuration);

      // Assert, Then

      expect(sutDirectory.isDirectory).toBe(true);
      expect(sutDirectory.isFile).toBe(false);
      expect(sutFile.isDirectory).toBe(false);
      expect(sutFile.isFile).toBe(true);
    });
    test('Verificação especificada mas itens não existem', () => {
      // Arrange, Given

      const configuration: Partial<IFindFileSystemInfoConfiguration> = {
        loadStats: true
      };

      const directory = `test-dir-delete-me-${Math.random()}`;
      const file = `test-file-delete-me-${Math.random()}`;

      // Act, When

      const sutDirectory = new FileSystemInfo(directory, configuration);
      const sutFile = new FileSystemInfo(file, configuration);

      // Assert, Then

      expect(sutDirectory.isDirectory).toBe(false);
      expect(sutDirectory.isFile).toBe(false);
      expect(sutFile.isDirectory).toBe(false);
      expect(sutFile.isFile).toBe(false);
    });
  });
  describe('Lista de diretórios pai', () => {
    test('Parâmetro não especificado', () => {
      // Arrange, Given

      const path = `/dir1/dir2/dir3/file`;

      // Act, When

      const sut = new FileSystemInfo(path);

      // Assert, Then

      expect(sut.parents.length).toBe(0);
    });
    test('Parâmetro é especificado e tem diretórios pai', () => {
      // Arrange, Given

      const configuration: Partial<IFindFileSystemInfoConfiguration> = {
        fillParents: true
      };

      const path = `/dir1/dir2/dir3/file`;

      // Act, When

      const sut = new FileSystemInfo(path, configuration);

      // Assert, Then

      expect(sut.parents.length).toBe(3);
      expect(sut.parents).toStrictEqual(['dir1', 'dir2', 'dir3']);
    });
    test('Parâmetro é especificado e não tem diretórios pai', () => {
      // Arrange, Given

      const configuration: Partial<IFindFileSystemInfoConfiguration> = {
        fillParents: true
      };

      const path = `/file`;

      // Act, When

      const sut = new FileSystemInfo(path, configuration);

      // Assert, Then

      expect(sut.parents.length).toBe(0);
    });
    test('Parâmetro é especificado e tem diretórios pai e barras duplicadas', () => {
      // Arrange, Given

      const configuration: Partial<IFindFileSystemInfoConfiguration> = {
        fillParents: true
      };

      const path = `/\\/\\//dir//file`;

      // Act, When

      const sut = new FileSystemInfo(path, configuration);

      // Assert, Then

      expect(sut.parents.length).toBe(1);
      expect(sut.parents).toStrictEqual(['dir']);
    });
  });
  describe('absolutePath', () => {
    test('Parâmetro não é especificado', () => {
      // Arrange, Given

      const path = `test-file-delete-me-${Math.random()}`;

      // Act, When

      const sut = new FileSystemInfo(path);

      // Assert, Then

      expect(sut.absolutePath).toBeUndefined();
    });
    test('Parâmetro é especificado mas path não existe e não é raiz', () => {
      // Arrange, Given

      const configuration: Partial<IFindFileSystemInfoConfiguration> = {
        fillAbsolutePath: true
      };

      const path = `dir1/dir2/file`;
      const expectedPath = pathNode.join(fs.realpathSync('.'), path);

      // Act, When

      const sut = new FileSystemInfo(path, configuration);

      // Assert, Then

      expect(sut.absolutePath).toBeDefined();
      expect(sut.absolutePath).toBe(expectedPath);
    });
    test('Parâmetro é especificado mas path não existe e tem barras duplicadas e não é raiz', () => {
      // Arrange, Given

      const configuration: Partial<IFindFileSystemInfoConfiguration> = {
        fillAbsolutePath: true
      };

      const path = `dir1//\\dir2/\\file`;
      const expectedPath = pathNode.join(fs.realpathSync('.'), path);

      // Act, When

      const sut = new FileSystemInfo(path, configuration);

      // Assert, Then

      expect(sut.absolutePath).toBeDefined();
      expect(sut.absolutePath).toBe(expectedPath);
    });
    test('Parâmetro é especificado mas path não existe e é raiz Unix', () => {
      // Arrange, Given

      const configuration: Partial<IFindFileSystemInfoConfiguration> = {
        fillAbsolutePath: true
      };

      const path = `/dir1/dir2/file`;
      const expectedPath = path.replace(/[\\/]/g, pathNode.sep);

      // Act, When

      const sut = new FileSystemInfo(path, configuration);

      // Assert, Then

      expect(sut.absolutePath).toBeDefined();
      expect(sut.absolutePath).toBe(expectedPath);
    });
    test('Parâmetro é especificado mas path não existe e tem barras duplicadas e é raiz Unix', () => {
      // Arrange, Given

      const configuration: Partial<IFindFileSystemInfoConfiguration> = {
        fillAbsolutePath: true
      };

      const path = `/dir1//\\dir2/\\file`;
      const expectedPath = pathNode.join(path.replace(/[\\/]/g, pathNode.sep));

      // Act, When

      const sut = new FileSystemInfo(path, configuration);

      // Assert, Then

      expect(sut.absolutePath).toBeDefined();
      expect(sut.absolutePath).toBe(expectedPath);
    });
    test('Parâmetro é especificado mas path não existe e tem barras duplicadas e é raiz Windows', () => {
      // Arrange, Given

      const configuration: Partial<IFindFileSystemInfoConfiguration> = {
        fillAbsolutePath: true
      };

      const path = `w:/dir1//\\dir2/\\file`;
      const expectedPath = pathNode.join(path.replace(/[\\/]/g, pathNode.sep));

      // Act, When

      const sut = new FileSystemInfo(path, configuration);

      // Assert, Then

      expect(sut.absolutePath).toBeDefined();
      expect(sut.absolutePath).toBe(expectedPath);
    });
    test('Deve ser igual se path existir e é relativo', () => {
      // Arrange, Given

      const configurationCheckExist: Partial<IFindFileSystemInfoConfiguration> =
        {
          checkExistence: true,
          fillAbsolutePath: true
        };

      const configurationNotCheckExist: Partial<IFindFileSystemInfoConfiguration> =
        {
          checkExistence: false,
          fillAbsolutePath: true
        };

      const directory = `test-dir-delete-me-${Math.random()}`;
      const file = `test-file-delete-me-${Math.random()}`;
      const path = `${directory}/${file}`;

      HelperFileSystem.createRecursive(
        path,
        'Created by test. Delete me, please.'
      );

      // Act, When

      const sut1 = new FileSystemInfo(path, configurationCheckExist);
      const sut2 = new FileSystemInfo(path, configurationNotCheckExist);

      // Assert, Then

      expect(sut1.absolutePath).toBe(sut2.absolutePath);
    });
    test('Deve ser igual se path existir e é absoluto', () => {
      // Arrange, Given

      const configurationCheckExist: Partial<IFindFileSystemInfoConfiguration> =
        {
          checkExistence: true,
          fillAbsolutePath: true
        };

      const configurationNotCheckExist: Partial<IFindFileSystemInfoConfiguration> =
        {
          checkExistence: false,
          fillAbsolutePath: true
        };

      const directory = `test-dir-delete-me-${Math.random()}`;
      const file = `test-file-delete-me-${Math.random()}`;
      const path = pathNode.join(fs.realpathSync('.'), `${directory}/${file}`);

      HelperFileSystem.createRecursive(
        path,
        'Created by test. Delete me, please.'
      );

      // Act, When

      const sut1 = new FileSystemInfo(path, configurationCheckExist);
      const sut2 = new FileSystemInfo(path, configurationNotCheckExist);

      // Assert, Then

      expect(sut1.absolutePath).toBe(sut2.absolutePath);
    });
  });
  describe('Carregar parent', () => {
    test('Parâmetro não é especificado', () => {
      // Arrange, Given

      const path = `/dir/file`;

      // Act, When

      const sut = new FileSystemInfo(path);

      // Assert, Then

      expect(sut.parent).toBeUndefined();
    });
    test('Parâmetro é especificado para path relativo', () => {
      // Arrange, Given

      const configuration: Partial<IFindFileSystemInfoConfiguration> = {
        fillParent: true
      };

      const path = `dir1/dir2/file`;

      // Act, When

      const sut = new FileSystemInfo(path, configuration);

      // Assert, Then

      expect(sut.parent).toBeDefined();
      expect(sut.parent?.parent).toBeDefined();
      expect(sut.parent?.parent?.parent).toBeUndefined();
      expect(sut.name).toBe('file');
      expect(sut.parent?.name).toBe('dir2');
      expect(sut.parent?.parent?.name).toBe('dir1');
    });
    test('Parâmetro é especificado para path absoluto', () => {
      // Arrange, Given

      const configuration: Partial<IFindFileSystemInfoConfiguration> = {
        fillParent: true
      };

      const path = `c:/dir1/dir2/file`;

      // Act, When

      const sut = new FileSystemInfo(path, configuration);

      // Assert, Then

      expect(sut.parent).toBeDefined();
      expect(sut.parent?.parent).toBeDefined();
      expect(sut.parent?.parent?.parent).toBeUndefined();
      expect(sut.name).toBe('file');
      expect(sut.parent?.name).toBe('dir2');
      expect(sut.parent?.parent?.name).toBe('dir1');
    });
  });
  describe('children', () => {
    test('Se não especificado deve ter a lista vazia se caminho existe', () => {
      // Arrange, Given

      const path = `dir1/dir2/file`;

      // Act, When

      const sut = new FileSystemInfo(path);

      // Assert, Then

      expect(sut.children.length).toBe(0);
    });
    test('Se não especificado deve ter a lista vazia mesmo se caminho existe', () => {
      // Arrange, Given

      const directory = `test-dir-delete-me-${Math.random()}`;
      const file = `test-file-delete-me-${Math.random()}`;
      const path = `${directory}/${file}`;

      HelperFileSystem.createRecursive(
        path,
        'Created by test. Delete me, please.'
      );

      // Act, When

      const sut = new FileSystemInfo(path);

      // Assert, Then

      expect(sut.children.length).toBe(0);
    });
    test('Deve ter a lista vazia se caminho não existe', () => {
      // Arrange, Given

      const configuration: Partial<IFindFileSystemInfoConfiguration> = {
        fillChildren: true
      };

      const path = `dir1/dir2/file`;

      // Act, When

      const sut = new FileSystemInfo(path, configuration);

      // Assert, Then

      expect(sut.children.length).toBe(0);
    });
    test('Se especificado deve ter a lista carregada se caminho existe', () => {
      // Arrange, Given

      const configuration: Partial<IFindFileSystemInfoConfiguration> = {
        fillChildren: true
      };

      const directoryBase = `test-dir-delete-me-${Math.random()}`;

      HelperFileSystem.createRecursive(
        `${directoryBase}/dir1/dir2/file1.txt`,
        'Created by test. Delete me, please.'
      );
      HelperFileSystem.createRecursive(
        `${directoryBase}/dir1/dir2/file2.txt`,
        'Created by test. Delete me, please.'
      );
      HelperFileSystem.createRecursive(
        `${directoryBase}/dir1/file3.txt`,
        'Created by test. Delete me, please.'
      );

      // Act, When

      const sut = new FileSystemInfo(directoryBase, configuration);

      // Assert, Then

      expect(sut.children.length).toBe(1);
      expect(sut.children[0].children.length).toBe(2);
      expect(sut.children[0].children[0].children.length).toBe(2);
    });
  });
  describe('size', () => {
    test('Se não especificado deve ter valor negativo mesmo que exista', () => {
      // Arrange, Given

      const file = `test-file-delete-me-${Math.random()}`;

      HelperFileSystem.createRecursive(
        file,
        'Created by test. Delete me, please.'
      );

      // Act, When

      const sut = new FileSystemInfo(file);

      // Assert, Then

      expect(sut.size).toBe(-1);
    });
    test('se não existe retorna -1', () => {
      // Arrange, Given

      const configuration: Partial<IFindFileSystemInfoConfiguration> = {
        fillDirectorySize: true
      };

      const file = `dir1/file`;

      // Act, When

      const sut = new FileSystemInfo(file, configuration);

      // Assert, Then

      expect(sut.size).toBe(-1);
    });
    test('Retorna o tamanho de arquivo', () => {
      // Arrange, Given

      const configuration: Partial<IFindFileSystemInfoConfiguration> = {
        loadStats: true
      };

      const content = `Created by test. Delete me, please. ${Math.random()}`;
      const file = `test-file-delete-me-${Math.random()}`;

      HelperFileSystem.createRecursive(file, content);

      const expectedSize = content.length;

      // Act, When

      const sut = new FileSystemInfo(file, configuration);

      // Assert, Then

      expect(sut.size).toBe(expectedSize);
    });
    test('Retorna o tamanho de diretório', () => {
      // Arrange, Given

      const configuration: Partial<IFindFileSystemInfoConfiguration> = {
        fillDirectorySize: true
      };

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

      const sut = new FileSystemInfo(directoryBase, configuration);

      // Assert, Then

      expect(sut.size).toBe(expectedSize);
    });
  });
  describe('children usando filter', () => {
    test('Filtro de arquivo', () => {
      // Arrange, Given

      const configuration: Partial<IFindFileSystemInfoConfiguration> = {
        fillChildren: true,
        fileFilter: [/fileA1/, /fileA3/]
      };

      const directoryBase = `test-dir-delete-me-${Math.random()}`;

      HelperFileSystem.createRecursive(
        `${directoryBase}/dir/fileA1.txt`,
        'Created by test. Delete me, please.'
      );
      HelperFileSystem.createRecursive(
        `${directoryBase}/dir/fileA2.txt`,
        'Created by test. Delete me, please.'
      );
      HelperFileSystem.createRecursive(
        `${directoryBase}/dir/fileA3.txt`,
        'Created by test. Delete me, please.'
      );
      HelperFileSystem.createRecursive(
        `${directoryBase}/fileA1.txt`,
        'Created by test. Delete me, please.'
      );
      HelperFileSystem.createRecursive(
        `${directoryBase}/fileA2.txt`,
        'Created by test. Delete me, please.'
      );
      HelperFileSystem.createRecursive(
        `${directoryBase}/fileA3.txt`,
        'Created by test. Delete me, please.'
      );

      // Act, When

      const sut = new FileSystemInfo(directoryBase, configuration);

      // Assert, Then

      expect(sut.children.length).toBe(3);
      expect(sut.children[0].name).toBe('dir');
      expect(sut.children[1].name).toBe('fileA1.txt');
      expect(sut.children[2].name).toBe('fileA3.txt');
      expect(sut.children[0].children.length).toBe(2);
      expect(sut.children[0].children[0].name).toBe('fileA1.txt');
      expect(sut.children[0].children[1].name).toBe('fileA3.txt');
    });
    test('Filtro de diretório', () => {
      // Arrange, Given

      const configuration: Partial<IFindFileSystemInfoConfiguration> = {
        fillChildren: true,
        directoryFilter: [/dirA1/, /dirA3/]
      };

      const directoryBase = `test-dir-delete-me-${Math.random()}`;

      HelperFileSystem.createRecursive(
        `${directoryBase}/dirA1/fileA1.txt`,
        'Created by test. Delete me, please.'
      );
      HelperFileSystem.createRecursive(
        `${directoryBase}/dirA2/fileA2.txt`,
        'Created by test. Delete me, please.'
      );
      HelperFileSystem.createRecursive(
        `${directoryBase}/dirA3/fileA3.txt`,
        'Created by test. Delete me, please.'
      );
      HelperFileSystem.createRecursive(
        `${directoryBase}/dirA3/dirA1/fileA4.txt`,
        'Created by test. Delete me, please.'
      );
      HelperFileSystem.createRecursive(
        `${directoryBase}/dirA3/dirA2/fileA5.txt`,
        'Created by test. Delete me, please.'
      );

      // Act, When

      const sut = new FileSystemInfo(directoryBase, configuration);

      // Assert, Then

      expect(sut.children.length).toBe(2);
      expect(sut.children[0].name).toBe('dirA1');
      expect(sut.children[1].name).toBe('dirA3');
      expect(sut.children[0].children.length).toBe(1);
      expect(sut.children[0].children[0].name).toBe('fileA1.txt');
      expect(sut.children[1].children.length).toBe(2);
      expect(sut.children[1].children[0].name).toBe('dirA1');
      expect(sut.children[1].children[1].name).toBe('fileA3.txt');
      expect(sut.children[1].children[0].children.length).toBe(1);
      expect(sut.children[1].children[0].children[0].name).toBe('fileA4.txt');
    });
    test('Filtro de arquivo quando só há diretórios', () => {
      // Arrange, Given

      const configuration: Partial<IFindFileSystemInfoConfiguration> = {
        fillChildren: true,
        fileFilter: [/dirA1/, /dirA3/]
      };

      const directoryBase = `test-dir-delete-me-${Math.random()}`;

      HelperFileSystem.createRecursive(`${directoryBase}/dirA1/dirA2/dirA3`);

      // Act, When

      const sut = new FileSystemInfo(directoryBase, configuration);

      // Assert, Then

      expect(sut.children.length).toBe(1);
      expect(sut.isDirectory).toBe(true);
      expect(sut.children[0].children.length).toBe(1);
      expect(sut.children[0].isDirectory).toBe(true);
      expect(sut.children[0].children[0].children.length).toBe(1);
      expect(sut.children[0].children[0].isDirectory).toBe(true);
      expect(sut.children[0].children[0].children[0].children.length).toBe(0);
    });
    test('Filtro de arquivo deve usar HelperText.matchFilter', () => {
      // Arrange, Given

      const mockFunction = jest.fn();
      HelperText.matchFilter = mockFunction;

      const configuration: Partial<IFindFileSystemInfoConfiguration> = {
        fillChildren: true,
        fileFilter: 'filtro'
      };

      const directoryBase = `test-dir-delete-me-${Math.random()}`;

      HelperFileSystem.createRecursive(
        `${directoryBase}/dir/fileA1.txt`,
        'Created by test. Delete me, please.'
      );

      // Act, When

      new FileSystemInfo(directoryBase, configuration);

      // Assert, Then

      expect(mockFunction).toBeCalledTimes(1);
    });
    test('Filtro de diretório deve usar HelperText.matchFilter', () => {
      // Arrange, Given

      const mockFunction = jest.fn();
      HelperText.matchFilter = mockFunction;

      const configuration: Partial<IFindFileSystemInfoConfiguration> = {
        fillChildren: true,
        directoryFilter: 'filtro'
      };

      const directoryBase = `test-dir-delete-me-${Math.random()}`;

      HelperFileSystem.createRecursive(
        `${directoryBase}/dir/fileA1.txt`,
        'Created by test. Delete me, please.'
      );

      // Act, When

      new FileSystemInfo(directoryBase, configuration);

      // Assert, Then

      expect(mockFunction).toBeCalledTimes(1);
    });
  });
});
