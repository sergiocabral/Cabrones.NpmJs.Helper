import { InvalidExecutionError } from '../Error/InvalidExecutionError';
import { HelperList } from './HelperList';

/**
 * Gerador de palavras aleatórias;
 */

export class WordGenerator {
  /**
   * Construtor proibido.
   */
  constructor() {
    throw new InvalidExecutionError('This is a static class.');
  }

  /**
   * Consoantes para conectar com vogais.
   * @private
   */
  private static consonants: string[] = [
    'b',
    'c',
    'd',
    'f',
    'g',
    'h',
    'j',
    'k',
    'l',
    'm',
    'n',
    'p',
    'q',
    'r',
    's',
    't',
    'v',
    'w',
    'x',
    'z',
    'br',
    'cr',
    'fr',
    'gr',
    'kr',
    'pr',
    'tr',
    'vr',
    'ch',
    'dh',
    'lh',
    'nh'
  ];

  /**
   * Lista de vogais.
   * @private
   */
  private static vowels: string[] = ['a', 'e', 'i', 'o', 'u', 'y'];

  /**
   * Retorna uma consoante aleatória.
   * @private
   */
  private static get consonant(): string {
    return HelperList.getRandom(this.consonants);
  }

  /**
   * Retorna uma vogal aleatória.
   * @private
   */
  private static get vowel(): string {
    return HelperList.getRandom(this.vowels);
  }

  /**
   * Retorna uma sílaba pronunciável.
   */
  private static get syllable(): string {
    const consonant = this.consonant;
    const vowel = this.vowel;
    let otherVowel = '';

    const twentyPerCent = Math.random() * 100 < 20;
    if (twentyPerCent) {
      do {
        otherVowel = this.vowel;
      } while (otherVowel === vowel);
    }

    return consonant + vowel + otherVowel;
  }

  /**
   * Retorna uma palavra pronunciável.
   */
  public static getWord(syllablesCount = 3, firstLetterUpper = true): string {
    const syllables: string[] = [];
    while (syllables.length < syllablesCount) {
      syllables.push(this.syllable);
    }
    let word = syllables.join('');
    if (firstLetterUpper) {
      word = word[0].toUpperCase() + word.substr(1);
    }
    return word;
  }
}
