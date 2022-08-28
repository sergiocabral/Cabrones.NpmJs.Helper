/**
 * Estados possíveis do lock.
 */
export enum LockState {
  /**
   * Quando ainda não foi definido.
   */
  Undefined = 'Undefined',

  /**
   * Quando ainda está em bloqueio.
   */
  Locked = 'Locked',

  /**
   * Quando é liberado e permite a execução do que está pendente.
   */
  Unlocked = 'Unlocked',

  /**
   * Quando o tempo de vida acaba. Não deve executar nada pendente.
   */
  Expired = 'Expired',

  /**
   * Quando é cancelado. Não deve executar nada pendente.
   */
  Canceled = 'Canceled'
}
