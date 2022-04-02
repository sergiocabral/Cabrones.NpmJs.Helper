import { InvalidExecutionError } from '../Error/InvalidExecutionError';
import { InvalidArgumentError } from '../Error/InvalidArgumentError';
import { HelperText } from '../Data/HelperText';
import * as fs from 'fs';
import { default as pathNode } from 'path';

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
   * Retorna todos os arquivos recursivamente de um caminho.
   */
  public static getAllFiles(directoryPath: string): string[] {
    const result: string[] = [];
    directoryPath = fs.realpathSync(directoryPath);
    const items = fs.readdirSync(directoryPath);
    for (const item of items) {
      const itemPath = pathNode.join(directoryPath, item);
      const stats = fs.lstatSync(itemPath);
      if (stats.isDirectory()) {
        result.push(...this.getAllFiles(itemPath));
      } else {
        result.push(itemPath);
      }
    }
    return result;
  }
}
