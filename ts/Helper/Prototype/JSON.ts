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

    /**
     * Descreve um objeto com suas propriedades e métodos.
     * @param instance
     * @param deep Navega até o último nível da herança.
     * @param ignoreObjectMembers Ignora os membros presentes no tipo base Object.
     */
    describe(
      instance: unknown,
      deep?: boolean,
      ignoreObjectMembers?: boolean
    ): string;
  }
}

JSON.stringify2 = function (
  instance: unknown,
  space?: undefined | string | number
): string {
  return HelperObject.toText(instance, space);
};
JSON.describe = function (
  instance: unknown,
  deep = true,
  ignoreObjectMembers = false
): string {
  return HelperObject.describe(instance, deep, ignoreObjectMembers);
};

export {};
