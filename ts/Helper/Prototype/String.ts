import { HelperText } from '../HelperText';

declare global {
  /**
   * Estender objetos tipo String.
   */
  interface String {
    /**
     * Substituir valores dentro de um template de texto.
     * @param values Valores. Podendo ser array, object ou o próprio valor.
     */
    querystring(values: unknown): string;

    /**
     * Substitui todas as ocorrências de um texto.
     * @param search Texto a ser localizado.
     * @param replacement Texto para substituição.
     * @returns Texto de saída com as substituições.
     */
    replaceAll(search: string, replacement: string): string;

    /**
     * Escapa os caracteres que são expeciais para um expressão regular.
     * @returns Texto escapado.
     */
    escapeRegExp(): string;
  }
}

String.prototype.querystring = function (values: unknown): string {
  return HelperText.querystring(String(this), values);
};

if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function (search: string, replacement: string): string {
    return HelperText.replaceAll(String(this), search, replacement);
  };
}

String.prototype.escapeRegExp = function (): string {
  return HelperText.escapeRegExp(String(this));
};

export {};
