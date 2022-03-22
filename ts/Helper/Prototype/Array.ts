import { HelperList } from '../HelperList';

declare global {
  /**
   * Estender objetos tipo Array.
   */
  interface Array<T = unknown> {
    getRandom(): T | undefined;
  }
}

Array.prototype.getRandom = function <T = unknown>(): T | undefined {
  return HelperList.getRandom<T>(this as T[]);
};

export {};
