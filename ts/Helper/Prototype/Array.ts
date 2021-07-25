import { HelperList } from '../HelperList';

declare global {
  /**
   * Estender objetos tipo Array.
   */
  interface Array<T> {
    getRandom<T>(): T;
  }
}

Array.prototype.getRandom = function <T>(): T {
  return HelperList.getRandom(this);
};

export {};
