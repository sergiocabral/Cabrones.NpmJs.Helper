/**
 * Estados de uma conexão.
 */
export enum ConnectionState {
  /**
   * Fechado.
   */
  Closed,

  /**
   * Alternando entre estados.
   */
  Switching,

  /**
   * Conectado e prontro para uso..
   */
  Ready
}
