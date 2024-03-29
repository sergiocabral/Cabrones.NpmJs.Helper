import { InvalidArgumentError } from '../Error/InvalidArgumentError';
import { InvalidExecutionError } from '../Error/InvalidExecutionError';
import { INumericFormat } from './INumericFormat';
import { NumericFormat } from './NumericFormat';

/**
 * Informações numéricas.
 */
type NumberData = {
  isNegative: boolean;
  integers: number[];
  decimals: number[];
};

/**
 * Utilitários para manipulação de números.
 */
export class HelperNumeric {
  /**
   * Construtor proibido.
   */
  public constructor() {
    throw new InvalidExecutionError('This is a static class.');
  }

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
   * Retorna informações sobre o número informado.
   * @param value Número como texto.
   * @private
   */
  private static getNumberData(value: string): NumberData {
    const regexNumeric = /^[+-]?(\d+\.?\d*|\d*\.?\d+)$/;
    if (!regexNumeric.test(value)) {
      throw new InvalidArgumentError(
        'Expected numeric value, but received {value}.'.querystring({ value })
      );
    }
    const regexDigits = /\d+/g;
    const digits = value.match(regexDigits) as RegExpMatchArray;

    if (digits.length === 1) {
      if (value.includes('.')) digits.unshift('0');
      else digits.push('0');
    }

    const signal = value.substr(0, 1) === '-' ? '-' : '+';
    const getNumbers = (digits: string) =>
      digits.split('').map((digit: string) => Number.parseInt(signal + digit));

    return {
      isNegative: signal === '-',
      integers: getNumbers(digits[0]),
      decimals: getNumbers(digits[1])
    };
  }

  /**
   * Equaliza o comprimento de dois números para realizar operações matemáticas.
   * @param number1
   * @param number2
   * @private
   */
  private static equalizeNumbers(
    number1: NumberData,
    number2: NumberData
  ): void {
    const paddingZero = (
      numbers: number[],
      length: number,
      side: 'left' | 'right'
    ) => {
      while (numbers.length < length) {
        switch (side) {
          case 'left':
            numbers.unshift(0);
            break;
          case 'right':
            numbers.push(0);
            break;
        }
      }
    };

    const equalizeZeros = (
      numbers1: number[],
      numbers2: number[],
      side: 'left' | 'right'
    ): void => {
      const digits = HelperNumeric.max(numbers1.length, numbers2.length);
      paddingZero(numbers1, digits, side);
      paddingZero(numbers2, digits, side);
    };

    equalizeZeros(number1.integers, number2.integers, 'left');
    equalizeZeros(number1.decimals, number2.decimals, 'right');
  }

  /**
   * Soma valores numéricos de qualquer comprimento
   * @param value1 Valor 1
   * @param value2 Valor 2
   */
  public static sum(value1: string, value2: string): string {
    const value1data = HelperNumeric.getNumberData(value1);
    const value2data = HelperNumeric.getNumberData(value2);
    HelperNumeric.equalizeNumbers(value1data, value2data);

    let numbers1 = Array<number>()
      .concat(value1data.integers, value1data.decimals)
      .reverse();
    let numbers2 = Array<number>()
      .concat(value2data.integers, value2data.decimals)
      .reverse();

    const value1isNegative = value1.substr(0, 1) === '-';
    const value2isNegative = value2.substr(0, 1) === '-';
    const bothNegative = value1isNegative && value2isNegative;

    if (bothNegative) {
      const abs = (numbers: number[]) => numbers.map(digit => Math.abs(digit));
      numbers1 = abs(numbers1);
      numbers2 = abs(numbers2);
    } else if (value1isNegative) {
      const swap = numbers1;
      numbers1 = numbers2;
      numbers2 = swap;
    }

    const cannotSum = (): boolean => {
      if (value1isNegative !== value2isNegative)
        for (let i = numbers1.length - 1; i >= 0; i--) {
          const number2 = Math.abs(numbers2[i]);
          if (number2 > numbers1[i]) return true;
          else if (number2 < numbers1[i]) return false;
        }
      return false;
    };
    const inverse = cannotSum();

    const result: number[] = [];
    let pendingSum = 0;
    for (let i = 0; i < numbers1.length && i < numbers2.length; i++) {
      const number1 = numbers1[i] + pendingSum;
      const number2 = numbers2[i];
      let sum = number1 + number2;

      if (sum > 9 || (inverse && sum > 0)) {
        sum -= 10;
        pendingSum = +1;
      } else if (sum < 0 && !inverse) {
        sum += 10;
        pendingSum = -1;
      } else {
        pendingSum = 0;
      }

      result.push(sum);
    }
    result.push(pendingSum);
    let resultAsText = result
      .reverse()
      .map(digit => Math.abs(digit))
      .join('');
    const floatPoint = resultAsText.length - value1data.decimals.length;
    resultAsText =
      resultAsText.substr(0, floatPoint) +
      '.' +
      resultAsText.substr(floatPoint);
    const regexPaddingZero = /(^0*|0*$)/g;
    resultAsText = resultAsText.replace(regexPaddingZero, '');
    if (resultAsText.endsWith('.')) {
      resultAsText = resultAsText.substr(0, resultAsText.length - 1);
    }
    if (resultAsText.startsWith('.')) {
      resultAsText = '0' + resultAsText;
    }
    const signal =
      bothNegative || inverse || result.find(n => n < 0) !== undefined
        ? '-'
        : '';
    return signal + resultAsText;
  }

  /**
   * Retorna o maior ou menor número de uma lista.
   * @param numbers
   * @param mode
   */
  private static minOrMax(numbers: number[], mode: 'min' | 'max'): number {
    if (numbers.length === 0)
      throw new InvalidArgumentError('Expected one or more numbers.');
    const ordered = numbers.sort(HelperNumeric.sortCompare);
    switch (mode) {
      case 'min':
        return ordered[0];
      case 'max':
        return ordered[ordered.length - 1];
    }
  }

  /**
   * Retorna o maior número de uma lista.
   * @param numbers
   */
  public static max(...numbers: number[]): number {
    return HelperNumeric.minOrMax(numbers, 'max');
  }

  /**
   * Retorna o maior número de uma lista.
   * @param numbers
   */
  public static min(...numbers: number[]): number {
    return HelperNumeric.minOrMax(numbers, 'min');
  }

  /**
   * Função para realizar ordenação numérica.
   * @param number1
   * @param number2
   */
  public static sortCompare = (number1: number, number2: number): number => {
    if (number1 < number2) return -1;
    if (number1 > number2) return +1;
    return 0;
  };

  /**
   * Função para realizar ordenação numérica.
   * @param number1
   * @param number2
   */
  public static reverseCompare = (number1: number, number2: number): number => {
    if (number1 < number2) return +1;
    if (number1 > number2) return -1;
    return 0;
  };

  /**
   * Formata a exibição de um número.
   * @param value Valor.
   * @param format Opcional. Configurações de formatação.
   * @returns Número formatado como texto.
   */
  public static format(value: number, format?: INumericFormat): string {
    const formatFullFill = NumericFormat.get(format);

    let result: string = value.toFixed(formatFullFill.digits);
    if (formatFullFill.miles) {
      const decimal = '.';
      const integer = result.substr(0, (result + decimal).indexOf(decimal));
      const decimals = result.substr(integer.length);
      result =
        integer.replace(/\B(?=(\d{3})+(?!\d))/g, formatFullFill.miles) +
        decimals;
    }
    if (formatFullFill.decimal !== '.') {
      result = result.replace('.', formatFullFill.decimal);
    }
    if (formatFullFill.showPositive && value >= 0) result = '+' + result;
    return `${formatFullFill.prefix}${result}${formatFullFill.suffix}`;
  }

  /**
   * Converte um número em notação exponencial para número plano como texto
   * @param dot Exibição do sinal de separação entre inteiro e decimal.
   ******************************************************************
   * Adaptação do algoritmo obtido em https://stackoverflow.com/a/66072001/1396511
   * @function eToNumber(number)
   * @version  1.00
   * @param   {e nottation Number} number Number in exponent format.
   *          pass number as a string for very large 'e' numbers or with large fractions
   *          (none 'e' number returned as is).
   * @return  {string}  a decimal number string.
   * @author  Mohsen Alyafei
   * @date    17 Jan 2020
   * Note: No check is made for NaN or undefined input numbers.
   *
   *****************************************************************/
  public static fromENotation(
    number: number | string,
    dot: '.' | ',' = '.'
  ): string {
    if (
      (typeof number === 'string' &&
        (number.length === 0 ||
          !Number.isFinite(Number(number.replace(dot, '.'))))) ||
      (typeof number === 'number' && !Number.isFinite(number))
    ) {
      throw new InvalidArgumentError('Expected a valid number.');
    }

    let numberAsString = String(number);

    const sign = numberAsString[0] === '-' ? '-' : '';
    if (sign !== '') {
      numberAsString = numberAsString.substring(1);
    }

    const partsNumberAndExponential = numberAsString.split(/e/gi);
    if (partsNumberAndExponential.length < 2) {
      return sign + numberAsString;
    }

    const partExponential = Number(partsNumberAndExponential[1]);
    const partNumber = partsNumberAndExponential[0].replace(/^0+/, '');
    const onlyDigits = partNumber.replace(dot, '');
    const dotPosition = partNumber.split(dot)[1]
      ? partNumber.indexOf(dot) + partExponential
      : onlyDigits.length + partExponential;
    const padding = dotPosition - onlyDigits.length;
    const onlyDigitsFormatted = BigInt(onlyDigits).toString();

    let result = onlyDigits;
    result =
      partExponential >= 0
        ? padding >= 0
          ? onlyDigitsFormatted + '0'.repeat(padding)
          : replace()
        : dotPosition <= 0
        ? '0' + dot + '0'.repeat(Math.abs(dotPosition)) + onlyDigitsFormatted
        : replace();

    const partIntegerAndDecimal = result.split(dot);
    const partInteger = Number(partIntegerAndDecimal[0]);
    const partDecimal = Number(partIntegerAndDecimal[1]);
    if (
      (partInteger === 0 && partDecimal === 0) ||
      (Number(result) == 0 && Number(onlyDigitsFormatted) == 0)
    ) {
      result = '0'; //** added 9/10/2021
    }

    return sign + result;

    function replace() {
      return result.replace(
        new RegExp(`^(.{${dotPosition}})(.)`),
        `$1${dot}$2`
      );
    }
  }
}
