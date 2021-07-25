import { HelperList } from '../HelperList';

declare global {
  /**
   * Estender objetos tipo Array.
   */
  interface Array<T = unknown> {
    getRandom(): T;
  }
}

Array.prototype.getRandom = function <T = unknown>(): T {
  return HelperList.getRandom<T>(this);
};

export {};
