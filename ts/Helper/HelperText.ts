/**
 * Utilitários para texto (string).
 */
export class HelperText {
  /**
   * Escapa os caracteres que são expeciais para um expressão regular.
   * @param {string} value Texto de entrada.
   * @return {string} Texto escapado.
   */
  public static escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Substitui todas as ocorrências de um texto.
   * @param {string} value Entrada.
   * @param {string} search Texto a ser localizado.
   * @param {string} replacement Texto para substituição.
   * @return {string} Texto de saída com as substituições.
   */
  public static replaceAll(value: string, search: string, replacement: string): string {
    return value.replace(new RegExp(HelperText.escapeRegExp(search), "g"), replacement);
  }
}
