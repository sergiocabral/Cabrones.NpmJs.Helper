/**
 * Estados possíveis do lock.
 */
export enum LockState {
  /**
   * Quando ainda não foi definido.
   */
  Undefined = 'Undefined',

  /**
   * Quando é cancelado. Não deve executar nada pendente.
   */
  Canceled = 'Canceled',

  /**
   * Quando o tempo de vida acaba. Não deve executar nada pendente.
   */
  Expired = 'Expired',

  /**
   * Quando é liberado e permite a execução do que está pendente.
   */
  Unlocked = 'Unlocked',

  /**
   * Quando ainda está em bloqueio.
   */
  Locked = 'Locked'
}
