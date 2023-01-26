import { GenericError } from './GenericError';

/**
 * Erro quando uma comunicação através da rede falha.
 */
export class NetworkError extends GenericError {
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
    super(message, innerError, 'NetworkError');
  }
}
