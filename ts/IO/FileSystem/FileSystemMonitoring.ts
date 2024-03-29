import { InvalidArgumentError } from '../../Error/InvalidArgumentError';
import { ResultEvent } from '../../Type/Event/ResultEvent';
import { IFileSystemFields } from './IFileSystemFields';
import { FileSystemFields } from './FileSystemFields';
import { IFileSystemMonitoringEventData } from './IFileSystemMonitoringEventData';

/**
 * Monitoramento de arquivo ou diretório em disco.
 */
export class FileSystemMonitoring {
  /**
   * Construtor.
   * @param path Caminho.
   * @param interval Intervalo entre cada verificação.
   * @param getStarted Já começa o monitoramento após instanciar.
   */
  public constructor(
    public readonly path: string,
    interval = 1000,
    getStarted = true
  ) {
    if (path.trim() === '') {
      throw new InvalidArgumentError('Empty path.');
    }
    this.interval = interval;
    if (getStarted) {
      this.start();
    }
  }

  /**
   * Controle de timeout.
   */
  private lastTimeout?: NodeJS.Timeout;

  /**
   * Intervalo entre cada verificação
   */
  private intervalValue = 1000;

  /**
   * Intervalo entre cada verificação
   */
  public get interval(): number {
    return this.intervalValue;
  }

  /**
   * Intervalo entre cada verificação
   */
  public set interval(value: number) {
    value = Math.floor(value);
    if (!Number.isFinite(value) || value <= 0) {
      throw new InvalidArgumentError('Interval must be greater than zero.');
    }
    const alreadyStarted = this.isActive;
    if (alreadyStarted) {
      this.stop();
    }
    this.intervalValue = value;
    if (alreadyStarted) {
      this.start();
    }
  }

  /**
   * Últimos dados de verificação.
   */
  private lastFieldsValue: Partial<IFileSystemFields> = new FileSystemFields();

  /**
   * Últimos dados de verificação.
   */
  public get lastFields(): Partial<IFileSystemFields> {
    return JSON.parse(
      JSON.stringify(this.lastFieldsValue)
    ) as Partial<IFileSystemFields>;
  }

  /**
   * Sinaliza monitoramento ativo
   */
  private isActiveValue = false;

  /**
   * Sinaliza monitoramento ativo.
   */
  public get isActive(): boolean {
    return this.isActiveValue;
  }

  /**
   * Inicia o monitoramento.
   */
  public start(): void {
    if (this.isActiveValue) {
      return;
    }

    this.isActiveValue = true;
    const monitoring = (triggerEvent = true) => {
      clearTimeout(this.lastTimeout);
      if (this.isActiveValue) {
        this.verify(triggerEvent);
        this.lastTimeout = setTimeout(monitoring, this.interval);
      }
    };
    monitoring(false);
  }

  /**
   * Interrompe o monitoramento.
   */
  public stop(): void {
    this.isActiveValue = false;
    clearTimeout(this.lastTimeout);
  }

  /**
   * Limpa todas as inscrições em todos os eventos.
   */
  public clearListeners(): void {
    this.onCreated.clear();
    this.onDeleted.clear();
    this.onModified.clear();
  }

  /**
   * Quando criado.
   */
  public onCreated: Set<ResultEvent<IFileSystemMonitoringEventData>> = new Set<
    ResultEvent<IFileSystemMonitoringEventData>
  >();

  /**
   * Quando apagado.
   */
  public onDeleted: Set<ResultEvent<IFileSystemMonitoringEventData>> = new Set<
    ResultEvent<IFileSystemMonitoringEventData>
  >();

  /**
   * Quando modificado.
   */
  public onModified: Set<ResultEvent<IFileSystemMonitoringEventData>> = new Set<
    ResultEvent<IFileSystemMonitoringEventData>
  >();

  /**
   * Realiza a verificação do arquivo.
   * @param triggerEvent Dispara evento se houver.
   */
  private verify(triggerEvent: boolean): void {
    const currentFields = new FileSystemFields(this.path);
    const diff = currentFields.diff(this.lastFieldsValue);
    if (diff.length > 0) {
      if (triggerEvent) {
        if (diff.includes('exists')) {
          if (currentFields.exists) {
            void this.trigger(
              this.onCreated,
              this.lastFieldsValue,
              currentFields
            );
          } else {
            void this.trigger(
              this.onDeleted,
              this.lastFieldsValue,
              currentFields
            );
          }
        } else if (diff.includes('size') || diff.includes('modification')) {
          void this.trigger(
            this.onModified,
            this.lastFieldsValue,
            currentFields
          );
        }
      }
      this.lastFieldsValue = currentFields;
    }
  }

  /**
   * Sinaliza o evento em uma listas
   */
  private async trigger(
    listeners: Set<ResultEvent<IFileSystemMonitoringEventData>>,
    before: Partial<IFileSystemFields>,
    after: Partial<IFileSystemFields>
  ): Promise<void> {
    for (const listener of listeners) {
      await listener(true, {
        instance: this,
        before,
        after
      });
    }
  }
}
