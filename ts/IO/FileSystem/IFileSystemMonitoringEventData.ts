import { FileSystemMonitoring } from './FileSystemMonitoring';
import { IFileSystemFields } from './IFileSystemFields';

/**
 * Coleção de informações para evento de monitoramento de objeto de disco.
 */
export interface IFileSystemMonitoringEventData {
  /**
   * Instância.
   */
  instance: FileSystemMonitoring;

  /**
   * Antes da modificação.
   */
  before: Partial<IFileSystemFields>;

  /**
   * Depois da modificação.
   */
  after: Partial<IFileSystemFields>;
}
