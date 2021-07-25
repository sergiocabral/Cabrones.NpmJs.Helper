/**
 * Nível do log.
 */
export enum LogLevel {
  /**
   * Informações com muito detalhamento.
   */
  Verbose = 0,

  /**
   * Informações de depuração.
   */
  Debug = 1,

  /**
   * Informações em geral.
   */
  Information = 2,

  /**
   * Pontos de atenção.
   */
  Warning = 3,

  /**
   * Erros em geral.
   */
  Error = 4,

  /**
   * Erros dignos de atenção imediata.
   */
  Critical = 5,

  /**
   * Erros que encerram a execução do programa.
   */
  Fatal = 6
}
