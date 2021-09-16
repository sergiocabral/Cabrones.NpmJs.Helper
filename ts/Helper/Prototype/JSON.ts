import { HelperObject } from '../HelperObject';

declare global {
  /**
   * Estender objetos tipo Array.
   */
  interface JSON {
    /**
     * Converte qualquer objeto em string
     * @param instance Instância.
     * @param space Espaçamento da identação.
     */
    stringify2(instance: unknown, space?: undefined | string | number): string;
  }
}

JSON.stringify2 = function (
  instance: unknown,
  space?: undefined | string | number
): string {
  return HelperObject.toText(instance, space);
};

export {};
