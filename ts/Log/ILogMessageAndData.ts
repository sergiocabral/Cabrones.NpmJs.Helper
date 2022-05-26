import { ILogMessage } from './ILogMessage';

/**
 * Representação de uma mensagem de log junto com seus dados vinculados.
 */
export interface ILogMessageAndData {
  /**
   * Mensagem de log.
   */
  logMessage: ILogMessage;

  /**
   * Template da mensagem.
   */
  messageTemplate: string;

  /**
   * Valores associados.
   */
  values?: unknown;
}
