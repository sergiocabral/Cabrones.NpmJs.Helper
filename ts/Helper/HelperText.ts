/**
 * Utilitários para texto (string).
 */
export class HelperText {
  /**
   * Escapa uma string para ser usada como literal em uma expressão regular.
   * @param value Valor.
   */
  public static escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
