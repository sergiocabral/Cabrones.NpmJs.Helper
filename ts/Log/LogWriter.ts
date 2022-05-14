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
   * Faz a junção aplicando os valores atuais sobre os valores padrão.
   * @param values Valores atuais.
   * @param defaultValues Valores padrão.
   */
  public static mergeValues(
    values: unknown | (() => unknown),
    defaultValues?: Record<string, unknown | (() => unknown)>
  ): unknown {
    const extractValue = (input: unknown | (() => unknown)) =>
      !HelperObject.isFunction(input) ? input : (input as () => unknown)();
    const doNotTreatAsObject = (values: unknown): boolean =>
      values === undefined || values === null || values instanceof Date;

    if (
      values !== undefined &&
      defaultValues !== undefined &&
      Object.keys(defaultValues).length > 0
    ) {
      values = extractValue(values);

      if (
        !Array.isArray(values) &&
        typeof values === 'object' &&
        !doNotTreatAsObject(values)
      ) {
        values = {
          ...defaultValues,
          ...values
        };
      } else {
        const valuesArray = Array.isArray(values) ? values : [values];
        for (const defaultValuesKey in defaultValues) {
          valuesArray.push(defaultValues[defaultValuesKey]);
        }
        values = valuesArray;
      }

      return values;
    } else if (
      values !== undefined &&
      (defaultValues === undefined || Object.keys(defaultValues).length === 0)
    ) {
      return extractValue(values);
    } else if (
      values === undefined &&
      defaultValues !== undefined &&
      Object.keys(defaultValues).length > 0
    ) {
      for (const defaultValuesKey in defaultValues) {
        defaultValues[defaultValuesKey] = extractValue(
          defaultValues[defaultValuesKey]
        );
      }
      return defaultValues;
    }

    return undefined;
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
    if (!this.enabled) return;
    level = level ?? this.defaultLogLevel;
    if (level < this.minimumLevel) return;
    messageTemplate =
      typeof messageTemplate === 'string' ? messageTemplate : messageTemplate();
    values = LogWriter.mergeValues(values, this.defaultValues);
    const message = HelperText.querystring(messageTemplate, values);
    const timestamp = new Date();
    const logMessage: ILogMessage = { message, timestamp, level, section };
    this.write(logMessage, messageTemplate, values);
  }

  /**
   * Sinaliza se o log está ativo ou não para postar.
   */
  public enabled = true;

  /**
   * Valores padrão associados a cada log.
   */
  public defaultValues: Record<string, unknown | (() => unknown)> = {};

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
