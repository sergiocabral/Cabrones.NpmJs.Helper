/**
 * Utilitários para manipulação de números.
 */
import { InvalidArgumentError } from "../Error/InvalidArgumentError";

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
  public static increment(value: string, increment: number = 1): string {
    const numbers = value
      .split('')
      .map(number => parseInt(number))
      .reverse();

    let toSum = increment;
    for (let i = 0; i < numbers.length; i++) {
      if (!Number.isFinite(numbers[i])) {
        throw new InvalidArgumentError('Expected a number, but found "{notNumber}" at {position} index.'.querystring({
          notNumber:numbers[i],
          position: i
        }));
      }
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
    if (toSum > 0) {
      numbers.push(toSum);
    }
    return numbers
      .reverse()
      .map(number => number.toString())
      .join('');
  }
}
