/**
 * Utilitários para listas (array).
 */
import { InvalidExecutionError } from '../Error/InvalidExecutionError';

export class HelperList {
  /**
   * Construtor proibido.
   */
  public constructor() {
    throw new InvalidExecutionError('This is a static class.');
  }

  /**
   * Captura um item aleatório na lista.
   * @param array Lista.
   * @returns Item aleatório.
   */
  public static getRandom<T>(array: T[]): T {
    const randomIndex = Math.floor(Math.random() * array.length * 10) % array.length;
    return array[randomIndex];
  }
}
