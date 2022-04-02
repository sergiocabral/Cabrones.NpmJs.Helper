import { InvalidExecutionError } from '../Error/InvalidExecutionError';

/**
 * Utilitário relacionado ao ambiente NodeJS
 */
export class HelperNodeJs {
  /**
   * Construtor proibido.
   */
  public constructor() {
    throw new InvalidExecutionError('This is a static class.');
  }

  // TODO: Implementar funcionalidades.
}
