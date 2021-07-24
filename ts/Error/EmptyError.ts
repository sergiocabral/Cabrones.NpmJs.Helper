import { GenericError } from './GenericError';

/**
 * Erro quando não deveria ser vazio.
 */
export class EmptyError extends GenericError {
  /**
   * Construtor.
   * @param message Mensagem de erro.
   * @param innerError Erro original.
   * @protected
   */
  public constructor(message?: string, public innerError?: Error) {
    super(message, innerError, 'EmptyError');
  }
}
