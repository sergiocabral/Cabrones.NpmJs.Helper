import { GenericError } from './GenericError';

/**
 * Erro quando uma ação do usuário é inválida ou não permitida.
 */
export class InvalidUserOperationError extends GenericError {
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
    super(message, innerError, 'InvalidUserOperationError');
  }
}
