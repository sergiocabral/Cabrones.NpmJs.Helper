import { TranslateSet } from './TranslateSet';

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
   * Idiomas disponíveis.
   */
  get availableLanguages(): string[];

  /**
   * Carrega um conjunto de traduções para determinado idioma.
   * @param translationSet Traduções.
   * @param language Idioma. Se não informado usa o idioma selecionado.
   */
  load(translationSet: TranslateSet, language?: string): void;

  /**
   * Define uma tradução para uma determinada chave.
   * @param key Chave.
   * @param text Tradução.
   * @param language Idioma. Se não informado usa o idioma selecionado.
   */
  set(key: string, text: string, language?: string): void;

  /**
   * Retorna uma tradução para determinada chave.
   * @param key Chave.
   * @param language Idioma. Se não informado usa o idioma selecionado.
   */
  get(key: string, language?: string): string;

  /**
   * Remove uma tradução.
   * @param key Chave.
   * @param language Idioma. Se não informado usa o idioma selecionado.
   * @returns Retorna true se dados foram apagados.
   */
  delete(key: string, language?: string): boolean;

  /**
   * Remove um idioma e suas traduções.
   * @param language Idioma.
   * @returns Retorna true se dados foram apagados.
   */
  deleteLanguage(language: string): boolean;

  /**
   * Remove todos os idiomas e suas traduções.
   * @returns Retorna true se dados foram apagados.
   */
  deleteAll(): boolean;
}
