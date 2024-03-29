import { Translate } from '../i18n/Translate';
import { HelperText } from '../Data/HelperText';

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

    // /**
    //  * Substitui todas as ocorrências de um texto.
    //  * @param search Texto a ser localizado.
    //  * @param replacement Texto para substituição.
    //  * @returns Texto de saída com as substituições.
    //  */
    // replaceAll(search: string, replacement: string): string;

    /**
     * Escapa os caracteres que são expeciais para um expressão regular.
     * @returns Texto escapado.
     */
    escapeRegExp(): string;

    /**
     * Remove acentuação do texto.
     * @returns Texto sem acentos.
     */
    removeAccents(): string;

    /**
     * Converte um texto para representação de slug.
     * @returns Texto no formato slug.
     */
    slugify(): string;

    /**
     * Retorna a tradução de um termo (se for capaz).
     * @returns Tradução ou a própria string.
     */
    translate(language?: string): string;
  }
}

String.prototype.querystring = function (values: unknown): string {
  return HelperText.querystring(String(this), values);
};

// if (!String.prototype.replaceAll) {
//   String.prototype.replaceAll = function (
//     search: string,
//     replacement: string
//   ): string {
//     return HelperText.replaceAll(String(this), search, replacement);
//   };
// }

String.prototype.escapeRegExp = function (): string {
  return HelperText.escapeRegExp(String(this));
};

String.prototype.removeAccents = function (): string {
  return HelperText.removeAccents(String(this));
};

String.prototype.slugify = function (): string {
  return HelperText.slugify(String(this));
};

String.prototype.translate = function (language?: string): string {
  const translated = Translate.default?.get(String(this), language);
  return translated !== undefined && translated !== null
    ? String(translated)
    : String(this);
};

export {};
