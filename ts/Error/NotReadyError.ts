import { GenericError } from './GenericError';

/**
 * Erro quando uma condição esperada não está pronta.
 */
export class NotReadyError extends GenericError {
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
    super(message, innerError, 'NotReadyError');
  }
}
