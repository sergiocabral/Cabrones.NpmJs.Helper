import { ILogMessage } from './ILogMessage';
import { LogWriter } from './LogWriter';
import fs from 'fs';
import { LogWriterToConsole } from './LogWriterToConsole';
import { HelperText } from '../Data/HelperText';
import * as os from 'os';

/**
 * Escritor de log para o arquivo.
 */
export class LogWriterToFile extends LogWriter {
  /**
   * Retorna o nome de arquivo padrão baseado em data.
   */
  public static defaultFileNameByDate(): string {
    return `log-${new Date().format({ mask: 'y-M-d' })}.log`;
  }

  /**
   * Construtor.
   * @param file Nome do arquivo ou construtor do nome de forma dinâmica.
   */
  public constructor(file?: string | (() => string)) {
    super();

    this.file =
      file ?? LogWriterToFile.defaultFileNameByDate.bind(LogWriterToFile);
  }

  /**
   * Nome do arquivo ou construtor do nome de forma dinâmica.
   */
  public file: string | (() => string);

  /**
   * Escreve o log de fato.
   * @param message
   * @protected
   */
  protected override write(message: ILogMessage): void {
    const text = this.factoryMessage(message);
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
