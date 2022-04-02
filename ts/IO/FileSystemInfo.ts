import { IFileSystemInfo } from './IFileSystemInfo';
import { IFindFileSystemInfoConfiguration } from './IFindFileSystemInfoConfiguration';
import { HelperFileSystem } from './HelperFileSystem';
import * as fs from 'fs';
import { default as pathNode } from 'path';
import { Stats } from 'fs';
import { FilterType } from '../Data/FilterType';
import { HelperText } from '../Data/HelperText';

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

    const regexWindowsRootDirectory = /^[A-Z]:[\\/]?$/i;

    const parts = HelperFileSystem.splitPath(path);

    this.name = parts[parts.length - 1];
    this.extension = HelperFileSystem.getExtension(path);
    this.exists =
      configuration?.checkExistence ||
      configuration?.loadStats ||
      configuration?.fillChildren ||
      configuration?.fillDirectorySize
        ? fs.existsSync(path)
        : false;

    let lstat: Stats | undefined = undefined;

    this.isDirectory = false;
    this.isFile = false;
    this.size = -1;
    if (
      (configuration?.loadStats ||
        configuration?.fillChildren ||
        configuration?.fillDirectorySize) &&
      this.exists
    ) {
      lstat = fs.lstatSync(path);
      this.isDirectory = lstat.isDirectory();
      this.isFile = lstat.isFile();
      if (this.isFile) {
        this.size = lstat.size;
      }
    }

    this.parents = [];
    if (configuration?.fillParents) {
      this.parents = HelperFileSystem.splitPath(path).filter(directory =>
        Boolean(directory)
      );
      this.parents.pop();
    }

    this.absolutePath = undefined;
    if (configuration?.fillAbsolutePath) {
      if (this.exists) {
        this.absolutePath = fs.realpathSync(path);
      } else {
        const parts = pathNode.join(path).split(pathNode.sep);

        this.absolutePath = parts
          .filter(item => Boolean(item))
          .join(pathNode.sep);

        const rootWindows =
          parts.length && regexWindowsRootDirectory.test(parts[0]);
        const rootUnix = parts.length && parts[0] === '';

        if (rootUnix) {
          this.absolutePath = pathNode.sep + this.absolutePath;
        } else if (!rootWindows) {
          this.absolutePath = pathNode.join(
            fs.realpathSync('.'),
            this.absolutePath
          );
        }
      }
    }

    this.parent = undefined;
    if (configuration?.fillParent) {
      const parentDirectory = pathNode.dirname(pathNode.join(path));
      if (
        parentDirectory !== '.' &&
        !regexWindowsRootDirectory.test(parentDirectory)
      ) {
        this.parent = new FileSystemInfo(parentDirectory, configuration);
      }
    }

    this.children = [];
    if (configuration?.fillChildren && lstat !== undefined) {
      const children = this.isDirectory ? fs.readdirSync(path) : [];
      for (const child of children) {
        const childPath = pathNode.join(path, child);

        if (configuration.directoryFilter || configuration.fileFilter) {
          const stats = fs.lstatSync(childPath);
          const filter: FilterType | undefined = stats.isDirectory()
            ? configuration.directoryFilter
            : stats.isFile()
            ? configuration.fileFilter
            : undefined;

          const ignore =
            filter !== undefined && !HelperText.matchFilter(child, filter);

          if (ignore) {
            continue;
          }
        }
        this.children.push(new FileSystemInfo(childPath, configuration));
      }
    }

    if (configuration?.fillDirectorySize && this.isDirectory) {
      this.size = HelperFileSystem.getDirectorySize(path);
    }
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
   * Caminho absoluto.
   */
  public readonly absolutePath: string | undefined;

  /**
   * Dados do item.
   */
  public readonly stats: Stats | undefined;

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
