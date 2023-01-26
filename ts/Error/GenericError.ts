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
  public constructor(
    message?: string,
    public readonly innerError?: Error | GenericError | unknown,
    prefix = 'GenericError'
  ) {
    super(
      [prefix, message ?? '']
        .map(text => text.trim())
        .filter(text => text.length)
        .join(': ')
    );
    this.firstError =
      (innerError as GenericError)?.firstError ?? innerError ?? this;
  }

  /**
   * Primeiro erro da pilha.
   */
  public readonly firstError?: Error | unknown;
}
