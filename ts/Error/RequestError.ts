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
  public constructor(message?: string, public innerError?: Error) {
    super(message, innerError, 'RequestError');
  }
}
