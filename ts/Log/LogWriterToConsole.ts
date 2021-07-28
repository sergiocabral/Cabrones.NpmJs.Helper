import { ILogMessage } from './ILogMessage';
import { LogLevel } from './LogLevel';
import { LogWriter } from './LogWriter';

/**
 * Escritor de log para o console.
 */
export class LogWriterToConsole extends LogWriter {
  /**
   * Retorna a função de log correspondente ao nome.
   * @param functionName Nome da função de log.
   * @protected
   */
  public getConsoleFunction(functionName: 'error' | 'warn' | 'info' | 'log' | 'debug'): (message: string) => void {
    switch (functionName) {
      case 'error':
        return console.error;
      case 'warn':
        return console.warn;
      case 'info':
        return console.info;
      case 'debug':
        return console.debug;
      default:
        return console.log;
    }
  }

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
        log = this.getConsoleFunction('log');
        break;
      case LogLevel.Information:
        log = this.getConsoleFunction('info');
        break;
      case LogLevel.Warning:
        log = this.getConsoleFunction('warn');
        break;
      case LogLevel.Error:
      case LogLevel.Critical:
      case LogLevel.Fatal:
        log = this.getConsoleFunction('error');
        break;
      case LogLevel.Verbose:
      default:
        log = this.getConsoleFunction('debug');
        break;
    }

    log(text);
  }
}
