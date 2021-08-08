import { HelperNumeric } from '../HelperNumeric';
import { NumericFormat } from '../NumericFormat';

declare global {
  /**
   * Estender objetos tipo Number.
   */
  interface Number {
    /**
     * Formata a exibição de um número.
     * @param format Opcional. Configurações de formatação.
     * @returns Número formatado como texto.
     */
    format(format?: NumericFormat): string;
  }
}

Number.prototype.format = function (format?: NumericFormat): string {
  return HelperNumeric.format(Number(this), format);
};

export {};
