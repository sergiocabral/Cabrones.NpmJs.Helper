import { LogLevel } from './LogLevel';
import { ILogWriter } from './ILogWriter';
import { LogWriterToConsole } from "./LogWriterToConsole";

/**
 * Agrupador de escritores de log.
 */
export class Logger implements ILogWriter {
  /**
   * Construtor.
   * @param writers Lista de escritores de log
   */
  public constructor(private writers: ILogWriter[]) {}

  /**
   * Logger padrão.
   */
  public static defaultLogger: ILogWriter | null = new LogWriterToConsole();

  /**
   * Posta uma mensagem de log.
   * @param messageTemplate Mensagem como template.
   * @param values Valores associados.
   * @param level Nível.
   * @param section Seção, ou contexto, relacionado.
   */
  public static post(
    messageTemplate: string | (() => string),
    values?: unknown | (() => unknown),
    level?: LogLevel,
    section?: string
  ): void {
    if (this.defaultLogger !== null) {
      this.defaultLogger.post(messageTemplate, values, level, section);
    }
  }

  /**
   * Posta uma mensagem de log.
   * @param messageTemplate Mensagem como template.
   * @param values Valores associados.
   * @param level Nível.
   * @param section Seção, ou contexto, relacionado.
   */
  public post(
    messageTemplate: string | (() => string),
    values?: unknown | (() => unknown),
    level?: LogLevel,
    section?: string
  ): void {
    for (const writer of this.writers) {
      writer.post(messageTemplate, values, level, section);
    }
  }
}
