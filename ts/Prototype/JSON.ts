import { HelperObject } from '../Data/HelperObject';

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
     * @param includeObjectMembers Inclui os membros presentes no tipo base Object.
     * @param filter Função para filtrar membros que serão listados
     */
    describe(
      instance: unknown,
      deep?: boolean,
      includeObjectMembers?: boolean,
      filter?: (name: string, type: string) => boolean
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
  includeObjectMembers = true,
  filter?: (name: string, type: string) => boolean
): string {
  return HelperObject.describe(instance, deep, includeObjectMembers, filter);
};

export {};
