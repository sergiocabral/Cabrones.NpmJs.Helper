import { InvalidExecutionError } from '../Error/InvalidExecutionError';
import { InvalidArgumentError } from '../Error/InvalidArgumentError';
import { HelperText } from '../Data/HelperText';

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
}
