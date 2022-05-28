import { LogLevel } from './LogLevel';
import { ILogMessageAndData } from './ILogMessageAndData';
import { LogWriter } from './LogWriter';
import { LogWriterToConsole } from './LogWriterToConsole';
import { HelperText } from '../Data/HelperText';
import { InvalidArgumentError } from '../Error/InvalidArgumentError';
import { ConnectionState } from '../Type/Connection/ConnectionState';
import { IConnectionState } from '../Type/Connection/IConnectionState';

/**
 * Escritor de log para um banco de dados genérico.
 */
export class LogWriterToPersistent extends LogWriter {
  /**
   * Espera padrão em milissegundos em caso de erro
   */
  public static waitInMillisecondsOnError = 60000;

  /**
   * Construtor.
   * @param connection Conexão com a base persistente.
   * @param save Função que vai gravar o log na base persistente.
   * @param minimumLevel Nível mínimo de log para aceitar escrita do log recebido.
   * @param defaultLogLevel Nível padrão de log quando não informado
   * @param waitInMillisecondsOnError Espera em milissegundos em caso de erro.
   */
  public constructor(
    public readonly connection: IConnectionState,
    protected readonly save: (
      messageAndData: ILogMessageAndData
    ) => Promise<void> | void,
    minimumLevel: LogLevel = LogWriter.minimumLevel,
    defaultLogLevel: LogLevel = LogWriter.defaultLogLevel,
    waitInMillisecondsOnError = LogWriterToPersistent.waitInMillisecondsOnError
  ) {
    super(minimumLevel, defaultLogLevel);
    this.waitInMillisecondsOnErrorValue = this.waitInMillisecondsOnError =
      waitInMillisecondsOnError;
  }

  /**
   * Buffer de mensagens
   */
  private readonly buffer: ILogMessageAndData[] = [];

  /**
   * Esperar em milissegundos em caso de erro
   */
  private waitInMillisecondsOnErrorValue: number;

  /**
   * Esperar em milissegundos em caso de erro.
   */
  public get waitInMillisecondsOnError(): number {
    return this.waitInMillisecondsOnErrorValue;
  }

  /**
   * Esperar em milissegundos em caso de erro.
   */
  public set waitInMillisecondsOnError(value: number) {
    if (!Number.isFinite(value) || value < 0) {
      throw new InvalidArgumentError(
        'Expected value greater than or equal to zero..'
      );
    }
    this.waitInMillisecondsOnErrorValue = value;
  }

  /**
   * Escreve o log de fato.
   */
  protected override write(messageAndData: ILogMessageAndData): void {
    this.buffer.push(messageAndData);
    void this.flush();
  }

  /**
   * Sinaliza o flush em andamento.
   */
  private isFlushing = false;

  /**
   * Timeout do método flush()
   */
  private flushTimeout?: NodeJS.Timeout;

  /**
   * Processa as mensagens no buffer se houver
   */
  public async flush(): Promise<void> {
    clearTimeout(this.flushTimeout);

    if (this.isFlushing) {
      return;
    }
    this.isFlushing = true;

    let messageAndData: ILogMessageAndData | undefined;
    while (
      this.connection.state === ConnectionState.Ready &&
      (messageAndData = this.buffer.shift())
    ) {
      try {
        await this.save(messageAndData);
      } catch (error) {
        this.buffer.unshift(messageAndData);
        const logger = LogWriterToConsole.getConsoleFunction('error');
        logger(
          `Error saving log message to persistence: ${HelperText.formatError(
            error
          )}`
        );
        break;
      }
    }

    if (this.buffer.length > 0) {
      this.flushTimeout = setTimeout(
        () => void this.flush(),
        this.waitInMillisecondsOnError
      );
    }

    this.isFlushing = false;
  }
}
