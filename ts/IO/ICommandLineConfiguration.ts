/**
 * Configurações usadas para o parse da linha de comando.
 */
export interface ICommandLineConfiguration {
  /**
   * Ignora minúsculas e maiúsculas para nomes de argumentos.
   */
  caseInsensitiveForName: boolean;

  /**
   * Ignora minúsculas e maiúsculas para valores de argumentos.
   */
  caseInsensitiveForValue: boolean;

  /**
   * Caracteres que indicam atriuição de valor.
   */
  attribution: string;

  /**
   * Sequência de caracteres usados como aspas
   */
  quotes: Array<[string, string]>;
}
