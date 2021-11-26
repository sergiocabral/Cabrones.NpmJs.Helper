import { TranslationSet } from './TranslationSet';

/**
 * Representa um serviço de tradução.
 */
export interface ITranslate {
  /**
   * Idioma consultado caso o idioma selecionado não tenha determinada chave.
   */
  fallbackLanguage: string;

  /**
   * Idioma selecionado para fornecer traduções de chaves.
   */
  selectedLanguage: string;

  /**
   * Idioma disponíveis,
   */
  get availableLanguages(): string[];

  /**
   * Remove traduções.
   * @param language Idioma. Caso não informado, todos os idiomas.
   * @param key Chave de tradução. Caso não informado, todos as chaves de tradução.
   * @returns Retorna true se chaves foram apagadas.
   */
  clear(language?: string, key?: string): boolean;

  /**
   * Carrega um conjunto de traduções para determinado idioma.
   * @param language Idioma.
   * @param translationSet Traduções.
   */
  load(language: string, translationSet: TranslationSet): void;

  /**
   * Retorna uma tradução para determinada chave.
   * @param key Chave de tradução.
   * @param language Força especificação do idioma
   */
  get(key: string, language?: string): string;

  /**
   * Define uma tradução para determinada chave.
   * @param key Chave de tradução.
   * @param language Idioma.
   * @param text Texto associado à chave.
   */
  set(key: string, language: string, text: string): void;
}
