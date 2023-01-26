import { GenericError } from './GenericError';

/**
 * Erro quando uma requisição de um recurso falha.
 */
export class RequestError extends GenericError {
  /**
   * Construtor.
   * @param message Mensagem de erro.
   * @param innerError Erro original.
   * @protected
   */
  public constructor(
    message?: string,
    public readonly innerError?: Error | GenericError | unknown
  ) {
    super(message, innerError, 'RequestError');
  }
}
