/**
 * Mesmo que Record, mas com as chaves sendo opcionais.
 */
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export type PartialRecord<K extends keyof any, T> = {
  /**
   * Chave e valor.
   */
  [P in K]?: T;
};
