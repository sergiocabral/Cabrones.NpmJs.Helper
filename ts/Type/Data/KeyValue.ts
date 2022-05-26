/**
 * Agrupamento de informação tipo chave/valor.
 */
export type KeyValue<TValue = string, TKey = string> = {
  /**
   * Chave.
   */
  Key: TKey;

  /**
   * Valor.
   */
  Value: TValue;
};
