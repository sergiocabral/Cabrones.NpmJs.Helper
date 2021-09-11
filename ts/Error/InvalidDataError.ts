import { GenericError } from './GenericError';

/**
 * Erro quando um dado é inválido.
 */
export class InvalidDataError extends GenericError {
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
    super(message, innerError, 'InvalidDataError');
  }
}
