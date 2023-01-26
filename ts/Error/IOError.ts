import { GenericError } from './GenericError';

/**
 * Erro quando uma operação de entrada e saída falha.
 */
export class IOError extends GenericError {
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
    super(message, innerError, 'IOError');
  }
}
