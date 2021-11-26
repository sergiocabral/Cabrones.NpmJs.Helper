import { ITranslate } from "./ITranslate";
import { TranslationSet } from "./TranslationSet";

/**
 * Serviço de tradução.
 */
export class Translate implements ITranslate {
  /**
   * Instância padrão de tradução.
   */
  public static default: ITranslate = new Translate();

  /**
   * Idioma consultado caso o idioma selecionado não tenha determinada chave.
   */
  public fallbackLanguage = '';

  /**
   * Idioma selecionado para fornecer traduções de chaves.
   */
  public selectedLanguage = '';

  /**
   * Idioma disponíveis,
   */
  public get availableLanguages(): string[] {
    return [];
  }

  /**
   * Remove traduções.
   * @param language Idioma. Caso não informado, todos os idiomas.
   * @param key Chave de tradução. Caso não informado, todos as chaves de tradução.
   * @returns Retorna true se chaves foram apagadas.
   */
  public clear(language?: string, key?: string): boolean {
    return false;
  }

  /**
   * Carrega um conjunto de traduções para determinado idioma.
   * @param language Idioma.
   * @param translationSet Traduções.
   */
  public load(language: string, translationSet: TranslationSet): void {

  }

  /**
   * Retorna uma tradução para determinada chave.
   * @param key Chave de tradução.
   * @param language Força especificação do idioma
   */
  public get(key: string, language?: string): string {
    return '';
  }

  /**
   * Define uma tradução para determinada chave.
   * @param key Chave de tradução.
   * @param language Idioma.
   * @param text Texto associado à chave.
   */
  public set(key: string, language: string, text: string): void {

  }
}
