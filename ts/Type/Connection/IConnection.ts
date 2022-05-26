import { IConnectionState } from './IConnectionState';

/**
 * Interface de classes que estabelecem conexão.
 */
export interface IConnection extends IConnectionState {
  /**
   * Fecha a conexão.
   */
  close(): Promise<void> | void;

  /**
   * Abre a conexão.
   */
  open(): Promise<void> | void;
}
