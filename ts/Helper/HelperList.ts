/**
 * Utilitários para listas (array).
 */
export class HelperList {
  /**
   * Captura um item aleatório na lista.
   * @param {T[]} array Lista.
   * @return {T} Item aleatório.
   */
  public static getRandom<T>(array: T[]): T {
    const randomIndex = Math.floor(Math.random() * array.length * 10) % array.length;
    return array[randomIndex];
  }
}
