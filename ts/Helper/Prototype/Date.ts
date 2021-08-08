import { DateTimeFormat } from '../DateTimeFormat';
import { HelperDate } from '../HelperDate';

declare global {
  /**
   * Estender objetos tipo Date.
   */
  interface Date {
    /**
     * Formata a exibição de uma data.
     * @param format Opcional. Configurações de formatação.
     * @returns Data formatada como texto.
     */
    format(format?: DateTimeFormat): string;
  }
}

Date.prototype.format = function (format?: DateTimeFormat): string {
  return HelperDate.format(this, format);
};

export {};
