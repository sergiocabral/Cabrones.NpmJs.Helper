import { LogLevel } from './LogLevel';
import { LogWriter } from './LogWriter';
import { ILogMessageAndData } from './ILogMessageAndData';

/**
 * Escritor de log para o console.
 */
export class LogWriterToConsole extends LogWriter {
  /**
   * Retorna a função de log correspondente ao nome.
   * @param functionName Nome da função de log.
   * @protected
   */
  public static getConsoleFunction(
    functionName: 'error' | 'warn' | 'info' | 'log' | 'debug'
  ): (message: string) => void {
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
   */
  protected override write(messageAndData: ILogMessageAndData): void {
    const text = this.factoryMessage(messageAndData.logMessage);

    let log;
    switch (messageAndData.logMessage.level) {
      case LogLevel.Debug:
        log = LogWriterToConsole.getConsoleFunction('log');
        break;
      case LogLevel.Information:
        log = LogWriterToConsole.getConsoleFunction('info');
        break;
      case LogLevel.Warning:
        log = LogWriterToConsole.getConsoleFunction('warn');
        break;
      case LogLevel.Error:
      case LogLevel.Critical:
      case LogLevel.Fatal:
        log = LogWriterToConsole.getConsoleFunction('error');
        break;
      case LogLevel.Verbose:
      default:
        log = LogWriterToConsole.getConsoleFunction('debug');
        break;
    }

    log(text);
  }
}
