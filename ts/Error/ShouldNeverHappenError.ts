import { GenericError } from './GenericError';

/**
 * Erro impossível. Por essa o desenvolvedor não esperava.
 */
export class ShouldNeverHappenError extends GenericError {
  /**
   * Construtor.
   * @param message Mensagem de erro.
   * @param innerError Erro original.
   * @protected
   */
  public constructor(message?: string, public innerError?: Error) {
    super(message, innerError, 'ShouldNeverHappenError');
  }
}
