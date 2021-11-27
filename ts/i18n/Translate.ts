import { ITranslate } from './ITranslate';
import { TranslateSet } from './TranslateSet';

/**
 * Serviço de tradução.
 */
export class Translate implements ITranslate {
  /**
   * Nome do idioma padrão.
   */
  public static readonly defaultLanguageName = 'default';

  /**
   * Instância padrão de tradução.
   */
  public static default: ITranslate = new Translate();

  /**
   * Planifica um Conjunto de traduções em uma lista de chave e valor.
   * @param translationSet Conjunto de traduções.
   */
  public static flatten(translationSet: TranslateSet): Map<string, string> {
    const result = new Map<string, string>();
    const preventRecursion = new Set<unknown>();
    const walkThrough = (data: TranslateSet): void => {
      for (const [key, translate] of Object.entries(data)) {
        if (typeof translate === 'object' && translate !== null) {
          if (!preventRecursion.has(translate)) {
            preventRecursion.add(translate);
            walkThrough(translate);
          }
        } else if (translate !== undefined && translate !== null) {
          result.set(key, String(translate));
        }
      }
    };
    walkThrough(translationSet);
    return result;
  }

  /**
   * Idioma selecionado para fornecer traduções de chaves.
   */
  public selectedLanguage: string;

  /**
   * Idioma consultado caso o idioma selecionado não tenha determinada chave.
   */
  public fallbackLanguage: string;

  /**
   *
   * @param selectedLanguage Idioma selecionado para fornecer traduções de chaves.
   * @param fallbackLanguage Idioma consultado caso o idioma selecionado não tenha determinada chave.
   * @param setAsDefault Define como a instância padrão de tradução em Translate.default.
   */
  public constructor(
    selectedLanguage?: string,
    fallbackLanguage?: string,
    setAsDefault?: boolean
  ) {
    this.selectedLanguage = selectedLanguage ?? Translate.defaultLanguageName;
    this.fallbackLanguage = fallbackLanguage ?? this.selectedLanguage;
    if (setAsDefault === true) {
      Translate.default = this;
    }
  }

  /**
   * Banco de dados.
   */
  private database: Map<string, Map<string, string>> = new Map<
    string,
    Map<string, string>
  >();

  /**
   * Idiomas disponíveis.
   */
  public get availableLanguages(): string[] {
    return Array.from(this.database.keys());
  }

  /**
   * Carrega um conjunto de traduções para determinado idioma.
   * @param translationSet Traduções.
   * @param language Idioma. Se não informado usa o idioma selecionado.
   */
  public load(translationSet: TranslateSet, language?: string): void {
    const translations = Translate.flatten(translationSet);
    if (translations.size > 0) {
      const database = this.getLanguageDatabase(language);
      for (const translation of translations) {
        const key = translation[0];
        const translate = translation[1];
        database.set(key, translate);
      }
    }
  }

  /**
   * Define uma tradução para uma determinada chave.
   * @param key Chave.
   * @param text Tradução.
   * @param language Idioma. Se não informado usa o idioma selecionado.
   */
  public set(key: string, text: string, language?: string): void {
    const database = this.getLanguageDatabase(language);
    database.set(key, text);
  }

  /**
   * Retorna uma tradução para determinada chave.
   * @param key Chave.
   * @param language Idioma. Se não informado usa o idioma selecionado.
   */
  public get(key: string, language?: string): string {
    language = language ?? this.selectedLanguage;
    let translations = this.database.get(language);
    if (translations === undefined && language !== this.fallbackLanguage) {
      translations = this.database.get(this.fallbackLanguage);
    }
    return translations?.get(key) ?? key;
  }

  /**
   * Remove uma tradução.
   * @param key Chave.
   * @param language Idioma. Se não informado usa o idioma selecionado.
   * @returns Retorna true se dados foram apagados.
   */
  public delete(key: string, language?: string): boolean {
    language = language ?? this.selectedLanguage;
    const databaseLanguage = this.database.get(language);
    if (databaseLanguage !== undefined) {
      const deleted = databaseLanguage.delete(key);
      if (deleted && databaseLanguage.size === 0) {
        this.database.delete(language);
      }
      return deleted;
    }
    return false;
  }

  /**
   * Remove um idioma e suas traduções.
   * @param language Idioma.
   * @returns Retorna true se dados foram apagados.
   */
  public deleteLanguage(language: string): boolean {
    return this.database.delete(language);
  }

  /**
   * Remove todos os idiomas e suas traduções.
   * @returns Retorna true se dados foram apagados.
   */
  public deleteAll(): boolean {
    const hadData = this.database.size > 0;
    this.database.clear();
    return hadData;
  }

  /**
   * Retorna ou cria a lista de traduções para um idioma.
   * @param language Idioma. Se não informado usa o idioma selecionados.
   */
  private getLanguageDatabase(language?: string): Map<string, string> {
    language = language ?? this.selectedLanguage;

    let languageDatabase = this.database.get(language);
    if (languageDatabase === undefined) {
      languageDatabase = new Map<string, string>();
      this.database.set(language, languageDatabase);
    }

    return languageDatabase;
  }
}
