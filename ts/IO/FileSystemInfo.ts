import { IFileSystemInfo } from './IFileSystemInfo';
import { IFindFileSystemInfoConfiguration } from './IFindFileSystemInfoConfiguration';
import { HelperFileSystem } from './HelperFileSystem';
import * as fs from 'fs';

/**
 * Representação de um arquivo ou diretório.
 */
export class FileSystemInfo implements IFileSystemInfo {
  /**
   * Construtor.
   * @param path Caminho a ser analizado.
   * @param configuration Configuração durante a busca de arquivos e diretórios.
   */
  public constructor(
    public readonly path: string,
    private readonly configuration?: Partial<IFindFileSystemInfoConfiguration>
  ) {
    // TODO: Implementar classe.

    const parts = HelperFileSystem.splitPath(path);

    this.name = parts[parts.length - 1];
    this.extension = HelperFileSystem.getExtension(path);
    this.exists = configuration?.checkExistence ? fs.existsSync(path) : false;

    this.isDirectory = false;
    this.isFile = false;
    if (configuration?.checkIfFileOrDirectory) {
      try {
        this.isDirectory = fs.lstatSync(path).isDirectory();
        this.isFile = !this.isDirectory;
      } catch (error) {
        // Ignore
      }
    }

    this.parents = [];
    if (configuration?.fillParents) {
      this.parents = HelperFileSystem.splitPath(path).filter(directory =>
        Boolean(directory)
      );
      this.parents.pop();
    }

    this.parent = undefined;
    this.children = [];
    this.size = 0;
  }

  /**
   * Nome.
   */
  public readonly name: string;

  /**
   * Extensão do arquivo.
   */
  public readonly extension: string;

  /**
   * Sinaliza se existe ou não.
   */
  public readonly exists: boolean;

  /**
   * Sinaliza ser arquivo.
   */
  public readonly isFile: boolean;

  /**
   * Sinaliza ser diretório.
   */
  public readonly isDirectory: boolean;

  /**
   * Diretórios ancestrais.
   */
  public readonly parents: string[];

  /**
   * Diretório pai.
   */
  public readonly parent?: IFileSystemInfo;

  /**
   * Arquivos e diretórios filhos.
   */
  public readonly children: IFileSystemInfo[];

  /**
   * Tamanho em bytes.
   */
  public readonly size: number;
}
