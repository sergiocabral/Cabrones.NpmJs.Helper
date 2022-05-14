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
    return this.getGreaterValueFromWriters('minimumLevel');
  }

  /**
   * Nível padrão de log quando não informado.
   */
  public get defaultLogLevel(): LogLevel {
    return this.getGreaterValueFromWriters('defaultLogLevel');
  }

  /**
   * Valores padrão associados a cada log.
   */
  public defaultValues: Record<string, unknown | (() => unknown)> = {};

  /**
   * Busca o valor mais alto para um propriedade LogLevel.
   * @param propertyName Nome da propriedade LogLevel
   */
  private getGreaterValueFromWriters(propertyName: keyof ILogWriter): LogLevel {
    let result = 0 as LogLevel;
    for (const writer of this.writers) {
      if (writer[propertyName] > result) {
        result = writer[propertyName] as LogLevel;
      }
    }
    return result;
  }
}
