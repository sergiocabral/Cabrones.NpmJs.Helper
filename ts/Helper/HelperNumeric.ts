/**
 * Utilitários para manipulação de números.
 */
import { InvalidArgumentError } from '../Error/InvalidArgumentError';

export class HelperNumeric {
  /**
   * Retorna um número inteiro aleatório
   * @param length Dígitos inteiros
   * @returns Número como String;
   */
  public static random(length = 10): string {
    let result = '';
    do {
      result += Math.random().toString().substr(2).replace(/^0+/, '');
    } while (result.length < length);
    return result.substr(0, length);
  }

  /**
   * Retorna um valor aleatório entre dois números.
   * @param min Menor número (inclusivo).
   * @param max Maior número (inclusivo).
   * @returns Número como Number.
   */
  public static between(min = 0, max = 100): number {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  }

  /**
   * Incrementa um valor numérico de qualquer comprimento.
   * @param value Número em formato texto.
   * @param increment Valor a ser adicionado.
   */
  public static increment(value: string, increment = 1): string {
    if (increment === 0) return value;

    if (increment < 0) throw new InvalidArgumentError('Only positive increment is acceptable.');

    const regexNotNumber = /(\D|^$)/;
    if (regexNotNumber.test(value)) throw new InvalidArgumentError('Expected only numbers.');

    const numbers = value
      .split('')
      .map(number => parseInt(number))
      .reverse();

    let toSum = increment;
    for (let i = 0; i < numbers.length; i++) {
      numbers[i] += toSum;
      if (numbers[i] >= 10) {
        const numberAsText = numbers[i].toString();
        const numberToStay = numberAsText.substr(numberAsText.length - 1);
        const numberToSum = numberAsText.substr(0, numberAsText.length - 1);
        numbers[i] = parseInt(numberToStay);
        toSum = parseInt(numberToSum);
      } else {
        toSum = 0;
      }
    }

    if (toSum > 0) numbers.push(toSum);

    return numbers
      .reverse()
      .map(number => number.toString())
      .join('');
  }
}
