import { LogLevel } from './LogLevel';

/**
 * Escritor de mensagem de log.
 */
export interface ILogWriter {
  /**
   * Posta uma mensagem de log.
   * @param messageTemplate Mensagem como template.
   * @param values Valores associados.
   * @param level Nível.
   * @param section Seção, ou contexto, relacionado.
   */
  post(
    messageTemplate: string | (() => string),
    values?: unknown | (() => unknown),
    level?: LogLevel,
    section?: string
  ): void;

  /**
   * Sinaliza se o log está ativo ou não para postar.
   */
  enabled: boolean;

  /**
   * Nível mínimo de log para aceitar escrita do log recebido.
   */
  minimumLevel: LogLevel;

  /**
   * Nível padrão de log quando não informado.
   */
  defaultLogLevel: LogLevel;

  /**
   * Valores padrão associados a cada log.
   */
  defaultValues: Record<string, unknown | (() => unknown)>;
}
