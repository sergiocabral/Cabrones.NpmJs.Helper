/**
 * Conjunto de traduções.
 */
export type TranslateSet = {
  /**
   * Chave como string e valor como string ou outro conjunto.
   */
  [key: string]: TranslateSet | string;
};
