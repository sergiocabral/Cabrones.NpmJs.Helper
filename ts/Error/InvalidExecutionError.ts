import { GenericError } from './GenericError';

/**
 * Erro quando uma execução do programa é inválida.
 */
export class InvalidExecutionError extends GenericError {
  /**
   * Construtor.
   * @param message Mensagem de erro.
   * @param innerError Erro original.
   * @protected
   */
  public constructor(message?: string, public innerError?: Error) {
    super(message, innerError, 'InvalidExecutionError');
  }
}
