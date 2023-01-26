import { GenericError } from './GenericError';

/**
 * Erro para quando o desenvolvedor deixou de implementar algo.
 */
export class NotImplementedError extends GenericError {
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
    super(message, innerError, 'NotImplementedError');
  }
}
