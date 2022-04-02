import { InvalidExecutionError } from '../Error/InvalidExecutionError';
import { default as pathNode } from 'path';
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
   * @param separators Separadores válidos. Por padrão \ ou /
   */
  public static splitPath(
    path: string,
    separators: string[] = ['\\', '/']
  ): string[] {
    if (separators.length == 0) {
      throw new InvalidArgumentError('Empty separator list.');
    }

    const regexSeparators = new RegExp(
      `${separators
        .map(separator => HelperText.escapeRegExp(separator))
        .join('|')}`
    );

    return path.split(regexSeparators);
  }
}
