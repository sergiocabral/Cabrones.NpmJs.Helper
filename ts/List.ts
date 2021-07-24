/**
 * Utilitários para listas (array).
 */
export abstract class List {
  /**
   * Captura um item aleatório na lista.
   * @param array Lista.
   */
  public static getRandom<T>(array: T[]): T {
    const randomIndex = Math.floor(Math.random() * array.length * 10) % array.length;
    return array[randomIndex];
  }
}
