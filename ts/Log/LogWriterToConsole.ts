import { ILogMessage } from './ILogMessage';
import { LogLevel } from './LogLevel';
import { LogWriter } from './LogWriter';

/**
 * Escritor de log para o console.
 */
export class LogWriterToConsole extends LogWriter {
  /**
   * Escreve o log de fato.
   * @param message
   * @protected
   */
  protected override write(message: ILogMessage): void {
    const text = `${message.timestamp.toLocaleString()} [${
      LogLevel[message.level] + (message.section ? ': ' + message.section : '')
    }] ${message.message}`;

    let log;
    switch (message.level) {
      case LogLevel.Debug:
        log = console.log;
        break;
      case LogLevel.Information:
        log = console.info;
        break;
      case LogLevel.Warning:
        log = console.warn;
        break;
      case LogLevel.Error:
      case LogLevel.Critical:
      case LogLevel.Fatal:
        log = console.error;
        break;
      default:
        log = console.debug;
        break;
    }

    log(text);
  }
}
