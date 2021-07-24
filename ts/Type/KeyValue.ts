/**
 * Dicionário de dados com chave e valor.
 */
export type KeyValue<Type = unknown> = {
  /**
   * Chave como string e valor como tipo Type
   */
  [index: string]: Type;
};
