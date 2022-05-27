import { LogWriter } from './LogWriter';
import fs from 'fs';
import { LogWriterToConsole } from './LogWriterToConsole';
import { HelperText } from '../Data/HelperText';
import * as os from 'os';
import { ILogMessageAndData } from './ILogMessageAndData';
import { LogWriterToPersistent } from './LogWriterToPersistent';
import { LogLevel } from './LogLevel';
import { ConnectionState } from '../Type/Connection/ConnectionState';

/**
 * Escritor de log para o arquivo.
 */
export class LogWriterToFile extends LogWriterToPersistent {
  /**
   * Espera padrão em milissegundos em caso de erro
   */
  public static waitInMillisecondsOnError =
    LogWriterToPersistent.waitInMillisecondsOnError;

  /**
   * Retorna o nome de arquivo padrão baseado em data.
   */
  public static defaultFileNameByDate(): string {
    return `log-${new Date().format({ mask: 'y-M-d' })}.log`;
  }

  /**
   * Construtor.
   * @param file Nome do arquivo ou construtor do nome de forma dinâmica.
   * @param minimumLevel Nível mínimo de log para aceitar escrita do log recebido.
   * @param defaultLogLevel Nível padrão de log quando não informado
   * @param waitInMillisecondsOnError Espera em milissegundos em caso de erro.
   */
  public constructor(
    file?: string | (() => string),
    minimumLevel: LogLevel = LogWriter.minimumLevel,
    defaultLogLevel: LogLevel = LogWriter.defaultLogLevel,
    waitInMillisecondsOnError = LogWriterToFile.waitInMillisecondsOnError
  ) {
    super(
      { state: ConnectionState.Ready },
      (messageAndData: ILogMessageAndData) =>
        this.saveToPersistence(messageAndData),
      minimumLevel,
      defaultLogLevel,
      waitInMillisecondsOnError
    );

    this.file =
      file ?? LogWriterToFile.defaultFileNameByDate.bind(LogWriterToFile);
  }

  /**
   * Nome do arquivo ou construtor do nome de forma dinâmica.
   */
  public file: string | (() => string);

  /**
   * Escreve o log de fato.
   */
  private saveToPersistence(messageAndData: ILogMessageAndData): void {
    const text = this.factoryMessage(messageAndData.logMessage);
    const file = typeof this.file === 'string' ? this.file : this.file();

    try {
      fs.appendFileSync(file, text + os.EOL);
    } catch (error) {
      const logger = LogWriterToConsole.getConsoleFunction('error');
      logger(
        `Error writing log message to file: ${HelperText.formatError(error)}`
      );
    }
  }
}
