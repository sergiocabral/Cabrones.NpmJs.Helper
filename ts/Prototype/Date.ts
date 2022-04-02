import { HelperDate } from '../Data/HelperDate';
import { IDateTimeFormat } from '../Data/IDateTimeFormat';

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
    format(format?: IDateTimeFormat): string;

    /**
     * Adiciona tempo a uma data: milissegundos
     * @param milliseconds milissegundos
     */
    addMilliseconds(milliseconds: number): Date;

    /**
     * Adiciona tempo a uma data: segundos
     * @param seconds segundos
     */
    addSeconds(seconds: number): Date;

    /**
     * Adiciona tempo a uma data: minutos
     * @param minutes minutos
     */
    addMinutes(minutes: number): Date;

    /**
     * Adiciona tempo a uma data: horas
     * @param hours horas
     */
    addHours(hours: number): Date;

    /**
     * Adiciona tempo a uma data: dias
     * @param days dias
     */
    addDays(days: number): Date;
  }
}

Date.prototype.format = function (format?: IDateTimeFormat): string {
  return HelperDate.format(this, format);
};

Date.prototype.addMilliseconds = function (milliseconds: number): Date {
  return HelperDate.addMilliseconds(milliseconds, this);
};

Date.prototype.addSeconds = function (seconds: number): Date {
  return HelperDate.addSeconds(seconds, this);
};

Date.prototype.addMinutes = function (minutes: number): Date {
  return HelperDate.addMinutes(minutes, this);
};

Date.prototype.addHours = function (hours: number): Date {
  return HelperDate.addHours(hours, this);
};

Date.prototype.addDays = function (days: number): Date {
  return HelperDate.addDays(days, this);
};

export {};
