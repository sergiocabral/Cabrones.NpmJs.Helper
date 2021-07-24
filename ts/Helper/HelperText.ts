/**
 * Utilitários para texto (string).
 */
export class HelperText {
  /**
   * Escapa os caracteres que são expeciais para um expressão regular.
   * @param value Texto de entrada.
   * @returns Texto escapado.
   */
  public static escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Substitui todas as ocorrências de um texto.
   * @param value Entrada.
   * @param search Texto a ser localizado.
   * @param replacement Texto para substituição.
   * @returns Texto de saída com as substituições.
   */
  public static replaceAll(value: string, search: string, replacement: string): string {
    return value.replace(new RegExp(HelperText.escapeRegExp(search), 'g'), replacement);
  }
}
