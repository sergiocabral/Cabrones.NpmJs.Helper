import { LogLevel } from './LogLevel';
import { ILogWriter } from './ILogWriter';
import { LogWriterToConsole } from './LogWriterToConsole';
import { LogWriter } from './LogWriter';

/**
 * Agrupador de escritores de log.
 */
export class Logger implements ILogWriter {
  /**
   * Construtor.
   * @param writers Lista de escritores de log
   */
  public constructor(public writers: ILogWriter[]) {}

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
    if (this.enabled) {
      const mergedValues = LogWriter.mergeValues(values, this.defaultValues);
      for (const writer of this.writers) {
        writer.post(messageTemplate, mergedValues, level, section);
      }
    }
  }

  /**
   * Sinaliza se o log está ativo ou não para postar.
   */
  public get enabled(): boolean {
    for (const writer of this.writers) {
      if (writer.enabled) {
        return true;
      }
    }
    return false;
  }

  /**
   * Sinaliza se o log está ativo ou não para postar.
   */
  public set enabled(value: boolean) {
    for (const writer of this.writers) {
      writer.enabled = value;
    }
  }

  /**
   * Nível mínimo de log para aceitar escrita do log recebido.
   */
  public get minimumLevel(): LogLevel {
    return Logger.maxLogLevel(
      ...this.writers.map(writer => writer.minimumLevel)
    );
  }

  /**
   * Nível padrão de log quando não informado.
   */
  public get defaultLogLevel(): LogLevel {
    return Logger.maxLogLevel(
      ...this.writers.map(writer => writer.defaultLogLevel)
    );
  }

  /**
   * Valores padrão associados a cada log.
   */
  public defaultValues: Record<string, unknown | (() => unknown)> = {};

  /**
   * Retorna o menor nível de log na lista.
   */
  public static minLogLevel(...logLevels: LogLevel[]): LogLevel {
    let result = Number.MAX_SAFE_INTEGER as LogLevel;
    logLevels.push(LogLevel.Fatal);
    logLevels.forEach(
      logLevel => (result = result <= logLevel ? result : logLevel)
    );
    return result;
  }

  /**
   * Retorna o maior nível de log na lista.
   */
  public static maxLogLevel(...logLevels: LogLevel[]): LogLevel {
    let result = Number.MIN_SAFE_INTEGER as LogLevel;
    logLevels.push(LogLevel.Verbose);
    logLevels.forEach(
      logLevel => (result = result >= logLevel ? result : logLevel)
    );
    return result;
  }
}
