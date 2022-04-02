import { HelperObject } from '../Data/HelperObject';
import { HelperText } from '../Data/HelperText';
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
    public minimumLevel: LogLevel = LogWriter.minimumLevel,
    public defaultLogLevel: LogLevel = LogWriter.defaultLogLevel
  ) {}

  /**
   * Nível mínimo de log para aceitar escrita do log recebido.
   */
  public static minimumLevel: LogLevel = LogLevel.Verbose;

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
    messageTemplate =
      typeof messageTemplate === 'string' ? messageTemplate : messageTemplate();
    values = !HelperObject.isFunction(values)
      ? values
      : (values as () => unknown)();
    const message = HelperText.querystring(messageTemplate, values);
    const timestamp = new Date();
    const logMessage: ILogMessage = { message, timestamp, level, section };
    this.write(logMessage, messageTemplate, values);
  }

  /**
   * Função para personalizar a exibição de uma mensagem de log.
   */
  public customFactoryMessage?: (message: ILogMessage) => string;

  /**
   * Construção do texto da mensagem de log.
   * @param message
   * @private
   */
  public static factoryMessage(message: ILogMessage): string {
    return `${message.timestamp.format({ mask: 'universal' })} [${
      LogLevel[message.level] + (message.section ? ': ' + message.section : '')
    }] ${message.message}`;
  }

  /**
   * Construção do texto da mensagem de log.
   * @param message
   * @private
   */
  protected factoryMessage(message: ILogMessage): string {
    return (this.customFactoryMessage ?? LogWriter.factoryMessage)(message);
  }

  /**
   * Escreve o log de fato.
   * @param message
   * @param messageTemplate
   * @param values
   * @protected
   */
  protected abstract write(
    message: ILogMessage,
    messageTemplate: string,
    values?: unknown
  ): void;
}
