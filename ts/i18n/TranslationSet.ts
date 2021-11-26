/**
 * Conjunto de traduções.
 */
export type TranslationSet = {
  /**
   * Chave como string e valor como string ou outro conjunto.
   */
  [key: string]: TranslationSet | string;
};
