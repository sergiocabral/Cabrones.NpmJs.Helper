import { InvalidExecutionError } from '../Error/InvalidExecutionError';

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
}
