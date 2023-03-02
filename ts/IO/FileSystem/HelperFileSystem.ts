import { InvalidExecutionError } from '../../Error/InvalidExecutionError';
import { InvalidArgumentError } from '../../Error/InvalidArgumentError';
import { HelperText } from '../../Data/HelperText';
import * as fs from 'fs';
import { default as pathNode } from 'path';
import { FiltersType } from '../../Type/Data/FiltersType';
import { Stats } from 'fs';

/**
 * Utilitário para arquivo e diretórios.
 */
export class HelperFileSystem {
  /**
   * Construtor proibido.
   */
  public constructor() {
    throw new InvalidExecutionError('This is a static class.');
  }

  /**
   * Unifica partes de um path em um caminho completo com o separador do sistema operacional.
   * @param parts Partes do caminho.
   */
  public static joinPath(...parts: string[]): string {
    const path = parts
      .map(part =>
        HelperFileSystem.splitPath(part)
          .filter(part => Boolean(part.trim()))
          .join(pathNode.sep)
      )
      .filter(part => Boolean(part.trim()))
      .join(pathNode.sep);
    const isRoot =
      parts.join(pathNode.sep).replace(/[\\/]/g, pathNode.sep).trim()[0] ===
      pathNode.sep;
    return isRoot ? pathNode.sep + path : path;
  }

  /**
   * Separa um caminho em suas partes.
   * @param path Caminho.
   * @param separators Separadores válidos. Por padrão barras: \ ou /
   */
  public static splitPath(
    path: string,
    separators: string[] = ['\\', '/']
  ): string[] {
    if (separators.length == 0) {
      throw new InvalidArgumentError('Empty list for separators.');
    }

    const regexSeparators = new RegExp(
      `${separators
        .map(separator => HelperText.escapeRegExp(separator))
        .join('|')}`
    );

    return path.split(regexSeparators);
  }

  /**
   * Obtem a extensão de um arquivo.
   * @param path Caminho ou arquivo.
   * @param extensionMarks Marcadores de extensão de arquivo. Por padrão ponto: .
   */
  public static getExtension(
    path: string,
    extensionMarks: string[] = ['.']
  ): string {
    if (extensionMarks.length == 0) {
      throw new InvalidArgumentError('Empty list for extension marks.');
    }

    for (const extensionMark of extensionMarks) {
      if (extensionMark.length === 0) {
        throw new InvalidArgumentError('Empty extension mark.');
      }

      const index = path.lastIndexOf(extensionMark);
      if (index >= 0) {
        return path.substring(index);
      }
    }

    return '';
  }

  /**
   * Apaga recursivamente todos os itens no caminho.
   * @param path Caminho
   * @return Retorna o total de itens excluídos.
   */
  public static deleteRecursive(path: string): number {
    if (!fs.existsSync(path)) {
      return 0;
    }

    const isDirectory = fs.lstatSync(path).isDirectory();

    if (!isDirectory) {
      fs.unlinkSync(path);
      return 1;
    }

    let affected = 1;
    const items = fs.readdirSync(path);
    for (const item of items) {
      affected += this.deleteRecursive(pathNode.join(path, item));
    }

    fs.rmdirSync(path);

    return affected;
  }

  /**
   * Cria recursivamente todos os itens de um caminho
   * @param path Caminho.
   * @param createAsFileContent Se especificado cria como conteúdo de arquivo. Do contrário criar como diretório.
   */
  public static createRecursive(
    path: string,
    createAsFileContent?: string
  ): number {
    if (fs.existsSync(path)) {
      const isDirectory = fs.lstatSync(path).isDirectory();
      const isFile = createAsFileContent !== undefined;

      if (isDirectory === isFile) {
        throw new InvalidExecutionError(
          'Path already exists but has other type.'
        );
      }

      return 0;
    }

    fs.mkdirSync(path, {
      recursive: true
    });

    const absolutePath = fs.realpathSync(path);

    if (createAsFileContent !== undefined) {
      fs.rmdirSync(absolutePath);
      fs.writeFileSync(absolutePath, createAsFileContent);
    }

    return HelperFileSystem.splitPath(path).filter(item => Boolean(item))
      .length;
  }

  /**
   * Calcula o tamanho de um diretório em bytes.
   */
  public static getDirectorySize(path: string): number {
    let size = 0;
    const items = fs.readdirSync(path).map(item => pathNode.join(path, item));
    for (const itemPath of items) {
      const stats = fs.lstatSync(itemPath);
      if (stats.isDirectory()) {
        size += this.getDirectorySize(itemPath);
      } else {
        size += stats.size;
      }
    }
    return size;
  }

  /**
   * Localiza arquivos recursivamente dentro de um caminho.
   * @param directoryPath Caminho
   * @param allowFileName Filtro para localizar nomes de arquivos.
   * @param limitCount Limite de arquivos para encontrar.
   * @param denyDirectoryName Filtro para ignorar nomes de diretórios
   */
  public static findFilesInto(
    directoryPath: string,
    allowFileName?: FiltersType,
    limitCount?: number,
    denyDirectoryName?: FiltersType
  ): string[] {
    const result: string[] = [];
    directoryPath = fs.realpathSync(directoryPath);
    const directoryName = pathNode.basename(directoryPath);
    if (
      denyDirectoryName === undefined ||
      !HelperText.matchFilter(directoryName, denyDirectoryName)
    ) {
      const items = fs.readdirSync(directoryPath);
      for (const item of items) {
        if (limitCount !== undefined && result.length >= limitCount) {
          break;
        }
        const itemPath = pathNode.join(directoryPath, item);
        const stats = HelperFileSystem.getStats(itemPath);
        if (stats !== undefined) {
          if (stats.isDirectory()) {
            result.push(
              ...this.findFilesInto(
                itemPath,
                allowFileName,
                limitCount,
                denyDirectoryName
              )
            );
          } else {
            if (
              allowFileName === undefined ||
              HelperText.matchFilter(item, allowFileName)
            ) {
              result.push(itemPath);
            }
          }
        }
      }
    }
    return result;
  }

  /**
   * Localiza arquivos recursivamente subindo diretórios em um caminho.
   * @param directoryPath Caminho
   * @param filter Filtros
   * @param limitCount Limite de arquivos para encontrar.
   */
  public static findFilesOut(
    directoryPath: string,
    filter?: FiltersType,
    limitCount?: number
  ): string[] {
    const result: string[] = [];
    if (limitCount !== undefined && limitCount <= 0) {
      return result;
    }
    directoryPath = fs.realpathSync(directoryPath);
    const items = fs.readdirSync(directoryPath);
    for (const item of items) {
      if (limitCount !== undefined && result.length >= limitCount) {
        break;
      }
      const itemPath = pathNode.join(directoryPath, item);
      const stats = HelperFileSystem.getStats(itemPath);
      if (stats !== undefined && !stats.isDirectory()) {
        if (filter === undefined || HelperText.matchFilter(item, filter)) {
          result.push(itemPath);
        }
      }
    }
    const parentDirectoryPath = pathNode.dirname(directoryPath);
    if (
      parentDirectoryPath !== directoryPath &&
      (limitCount === undefined || result.length < limitCount)
    ) {
      result.push(
        ...this.findFilesOut(
          parentDirectoryPath,
          filter,
          limitCount === undefined ? limitCount : limitCount - result.length
        )
      );
    }
    return result;
  }

  /**
   * Lê os stats de um caminho sem lançar erro.
   * @param path
   */
  public static getStats(path: string): Stats | undefined {
    try {
      return fs.lstatSync(path);
    } catch (error) {
      return undefined;
    }
  }
}
