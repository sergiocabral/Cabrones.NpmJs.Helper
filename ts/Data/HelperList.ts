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
  public static getRandom<T>(array: T[]): T | undefined {
    const randomIndex =
      Math.floor(Math.random() * array.length * 10) % array.length;
    return array[randomIndex];
  }

  /**
   * Retorna o mesmo array com valores únicos.
   * @param array Lista.
   */
  public static unique<T>(array: T[]): T[] {
    return array.filter((value, index) => array.indexOf(value) === index);
  }

  /**
   * Retorna o par de chave e valor de um enum
   * @param enumType Enum.
   */
  public static enumEntries(
    enumType: Record<string, string | number>
  ): Array<[string, string | number]> {
    return Object.entries(enumType).filter(([key]) => !~~key && key !== '0');
  }

  /**
   * Retorna as chaves de um enum.
   * @param enumType Enum.
   */
  public static enumKeys(enumType: Record<string, string | number>): string[] {
    return HelperList.enumEntries(enumType).map(entry => entry[0]);
  }

  /**
   * Retorna os valores de um enum.
   * @param enumType Enum.
   */
  public static enumValues(
    enumType: Record<string, string | number>
  ): Array<string | number> {
    return HelperList.enumEntries(enumType).map(entry => entry[1]);
  }
}
