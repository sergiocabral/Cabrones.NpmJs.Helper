import { InvalidExecutionError } from '../Error/InvalidExecutionError';

/**
 * Utilitários para objetos, classes, etc.
 */
export class HelperObject {
  /**
   * Construtor proibido.
   */
  public constructor() {
    throw new InvalidExecutionError('This is a static class.');
  }

  /**
   * Verifica se uma variável é uma função.
   * @param variable Variável.
   */
  public static isFunction(variable: unknown): boolean {
    return (
      Boolean(variable) && {}.toString.call(variable) === '[object Function]'
    );
  }

  /**
   * Retorna um nome identificador do tipo de uma instância.
   * @param instance Instância.
   * @returns Nome.
   */
  public static getName(instance: unknown): string {
    if (typeof instance === 'object' && instance !== null) {
      return instance.constructor.name;
    } else if (typeof instance === 'function') {
      return instance.name;
    }
    return String(instance);
  }
}
