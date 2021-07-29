/**
 * Utilitários para manipulação de números.
 */
export class HelperNumeric {
  /**
   * Retorna um número inteiro aleatório
   * @param length Dígitos inteiros
   * @returns Número como String;
   */
  public static random(length = 10): string {
    let result = '';
    do {
      result += Math.random().toString().substr(2).replace(/^0+/, '');
    } while (result.length < length);
    return result.substr(0, length);
  }

  /**
   * Retorna um valor aleatório entre dois números.
   * @param min Menor número (inclusivo).
   * @param max Maior número (inclusivo).
   * @returns Número como Number.
   */
  public static between(min = 0, max = 100): number {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  }
}
