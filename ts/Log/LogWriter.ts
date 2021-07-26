import { HelperObject } from '../Helper/HelperObject';
import { HelperText } from '../Helper/HelperText';
import { ILogMessage } from './ILogMessage';
import { ILogWriter } from './ILogWriter';
import { LogLevel } from './LogLevel';

/**
 * Implementação básica para escritores de log.
 */
export abstract class LogWriter implements ILogWriter {
  /**
   * Construtor.
   * @param minimumLevel Nível mínimo de log para aceitar escrita do log recebido.
   * @param defaultLogLevel Nível padrão de log quando não informado
   */
  public constructor(
    public minimumLevel: LogLevel = LogLevel.Verbose,
    public defaultLogLevel: LogLevel = LogWriter.defaultLogLevel
  ) {}

  /**
   * Nível padrão de log quando não informado.
   */
  public static defaultLogLevel: LogLevel = LogLevel.Debug;

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
    level = level ?? this.defaultLogLevel;
    if (level < this.minimumLevel) return;
    messageTemplate = typeof messageTemplate === 'string' ? messageTemplate : messageTemplate();
    values = !HelperObject.isFunction(values) ? values : (values as () => unknown)();
    const message = HelperText.querystring(messageTemplate, values);
    const timestamp = new Date();
    level = level ?? this.defaultLogLevel;
    const logMessage: ILogMessage = { message, timestamp, level, section };
    this.write(logMessage, messageTemplate, values);
  }

  /**
   * Escreve o log de fato.
   * @param message
   * @param messageTemplate
   * @param values
   * @protected
   */
  protected abstract write(message: ILogMessage, messageTemplate: string, values?: unknown): void;
}