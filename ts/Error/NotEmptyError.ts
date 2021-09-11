import { GenericError } from './GenericError';

/**
 * Erro quando deveria ser vazio.
 */
export class NotEmptyError extends GenericError {
  /**
   * Construtor.
   * @param message Mensagem de erro.
   * @param innerError Erro original.
   * @protected
   */
  public constructor(
    message?: string,
    public innerError?: Error | GenericError | unknown
  ) {
    super(message, innerError, 'NotEmptyError');
  }
}
