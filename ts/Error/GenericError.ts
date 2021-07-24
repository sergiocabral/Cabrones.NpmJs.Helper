/**
 * Erro genérico.
 */
export class GenericError extends Error {
  /**
   * Construtor.
   * @param message Mensagem de erro.
   * @param innerError Erro original.
   * @param prefix Prefixo para exibir na mensagem de erro.
   * @protected
   */
  public constructor(message?: string, public innerError?: Error | GenericError, prefix = 'GenericError') {
    super(
      [prefix, message ?? '']
        .map(text => text.trim())
        .filter(text => text.length)
        .join(': ')
    );
    this.firstError = (innerError as GenericError)?.firstError ?? innerError;
  }

  /**
   * Primeiro erro da pilha.
   */
  public firstError?: Error;
}