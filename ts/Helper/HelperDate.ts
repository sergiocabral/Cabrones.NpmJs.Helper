import { InvalidExecutionError } from '../Error/InvalidExecutionError';
import { DateTimeFormat } from './DateTimeFormat';

/**
 * Utilitários para manipulação de datas.
 */
export class HelperDate {
  /**
   * Construtor proibido.
   */
  public constructor() {
    throw new InvalidExecutionError('This is a static class.');
  }

  /**
   * Adiciona tempo a uma data: milissegundos
   * @param milliseconds milissegundos
   * @param fromDate Data de partida. Quando não informado usa a data atual.
   */
  public static addMilliseconds(milliseconds: number, fromDate?: Date): Date {
    const fromMillisecond = fromDate
      ? fromDate.getTime()
      : new Date().getTime();
    return new Date(fromMillisecond + milliseconds);
  }

  /**
   * Adiciona tempo a uma data: segundos
   * @param seconds segundos
   * @param fromDate Data de partida. Quando não informado usa a data atual.
   */
  public static addSeconds(seconds: number, fromDate?: Date): Date {
    return HelperDate.addMilliseconds(seconds * 1000, fromDate);
  }

  /**
   * Adiciona tempo a uma data: minutos
   * @param minutes minutos
   * @param fromDate Data de partida. Quando não informado usa a data atual.
   */
  public static addMinutes(minutes: number, fromDate?: Date): Date {
    return HelperDate.addSeconds(minutes * 60, fromDate);
  }

  /**
   * Adiciona tempo a uma data: horas
   * @param hours horas
   * @param fromDate Data de partida. Quando não informado usa a data atual.
   */
  public static addHours(hours: number, fromDate?: Date): Date {
    return HelperDate.addMinutes(hours * 60, fromDate);
  }

  /**
   * Adiciona tempo a uma data: dias
   * @param days dias
   * @param fromDate Data de partida. Quando não informado usa a data atual.
   */
  public static addDays(days: number, fromDate?: Date): Date {
    return HelperDate.addHours(days * 24, fromDate);
  }

  /**
   * Formata a exibição de uma data.
   * @param value Valor.
   * @param format Configurações de formatação.
   * @returns Data formatada como texto.
   */
  public static format(value: Date, format?: DateTimeFormat): string {
    const formatFullFill = DateTimeFormat.get(format);

    switch (formatFullFill.mask) {
      case 'running':
        formatFullFill.mask = 'D h:m:s';
        break;
    }

    if (formatFullFill.useUTC) {
      const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
      value = new Date(value.getTime() + timezoneOffset);
    }

    const y = value.getFullYear().toString();
    const M = (value.getMonth() + 1).toString().padStart(2, '0');
    const d = value.getDate().toString().padStart(2, '0');
    const h = value.getHours().toString().padStart(2, '0');
    const m = value.getMinutes().toString().padStart(2, '0');
    const s = value.getSeconds().toString().padStart(2, '0');
    const z = value.getMilliseconds().toString().padStart(3, '0');
    let D = 0;
    let labelD = '';
    if ((formatFullFill.mask as string).indexOf('D') >= 0) {
      D =
        (new Date(y + '-' + M + '-' + d).getTime() -
          new Date('1970-01-01').getTime()) /
        1000 /
        60 /
        60 /
        24;
      if (D === 0) labelD = '';
      else if (Math.abs(D) === 1) {
        labelD = formatFullFill.day as string;
      } else {
        labelD = formatFullFill.days as string;
      }
    }

    return (formatFullFill.mask as string)
      .replaceAll('y', y)
      .replaceAll('M', M)
      .replaceAll('d', d)
      .replaceAll('h', h)
      .replaceAll('m', m)
      .replaceAll('s', s)
      .replaceAll('z', z)
      .replaceAll('D', D === 0 ? '' : `${D} ${labelD}`)
      .trim();
  }
}
