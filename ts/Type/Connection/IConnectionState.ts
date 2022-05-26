import { ConnectionState } from './ConnectionState';

/**
 * Interface de classes que sinalizam o estado de uma conexão.
 */
export interface IConnectionState {
  /**
   * Estado da conexão.
   */
  get state(): ConnectionState;
}
