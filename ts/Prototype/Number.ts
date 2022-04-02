import { HelperNumeric } from '../Data/HelperNumeric';
import { INumericFormat } from '../Data/INumericFormat';

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
    format(format?: INumericFormat): string;
  }
}

Number.prototype.format = function (format?: INumericFormat): string {
  return HelperNumeric.format(Number(this), format);
};

export {};
