import { LogLevel } from './LogLevel';

/**
 * Representação de uma mensagem de log.
 */
export interface ILogMessage {
  /**
   * Momento.
   */
  timestamp: Date;

  /**
   * Mensagem
   */
  message: string;

  /**
   * Nível.
   */
  level: LogLevel;

  /**
   * Seção, ou contexto, relacionado.
   */
  section?: string;
}
