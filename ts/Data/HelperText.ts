import { InvalidExecutionError } from '../Error/InvalidExecutionError';
import { FiltersType } from '../Type/Data/FiltersType';
import { HelperObject } from './HelperObject';
import { Buffer } from 'buffer';
import { InvalidArgumentError } from '../Error/InvalidArgumentError';

/**
 * Utilitários para texto (string).
 */
export class HelperText {
  /**
   * Construtor proibido.
   */
  public constructor() {
    throw new InvalidExecutionError('This is a static class.');
  }

  /**
   * Substituir valores dentro de um template de texto.
   * @param template Template contendo variáveis como {0}, {1}... ou {prop1}, {prop2}...
   * @param values Valores. Podendo ser array, object ou o próprio valor.
   */
  public static querystring(template: string, values: unknown): string {
    const doNotTreatAsObject = (values: unknown): boolean =>
      values === undefined || values === null || values instanceof Date;
    const doNotTreatAsString = (values: unknown): boolean =>
      values === undefined || values === null;
    const isArray = Array.isArray(values);
    let text = template;
    if (!isArray && typeof values === 'object' && !doNotTreatAsObject(values)) {
      const objectValue = values as Record<string, unknown>;
      const properties = Object.keys(objectValue);
      for (const property of properties) {
        const value = String(objectValue[property]);
        text = HelperText.replaceAll(text, `{${property}}`, value);
      }
    } else {
      const array = isArray ? values : [values];
      for (let index = 0; index < array.length; index++) {
        const value: unknown = array[index];
        if (!doNotTreatAsString(value)) {
          text = HelperText.replaceAll(text, `{${index}}`, String(value));
        }
      }
    }
    return text;
  }

  /**
   * Escapa os caracteres que são expeciais para um expressão regular.
   * @param value Texto de entrada.
   * @returns Texto escapado.
   */
  public static escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Substitui todas as ocorrências de um texto.
   * @param value Entrada.
   * @param search Texto a ser localizado.
   * @param replacement Texto para substituição.
   * @returns Texto de saída com as substituições.
   */
  public static replaceAll(
    value: string,
    search: string,
    replacement: string
  ): string {
    return value.replace(
      new RegExp(HelperText.escapeRegExp(search), 'g'),
      replacement
    );
  }

  /**
   * Extrai de uma linha de comando os arquivos em list.
   * @param commandLine
   */
  public static getCommandArguments(commandLine: string): string[] {
    const charZero = String.fromCharCode(0);
    const regexQuoted = /(?<=^|\s)(['"]).*?\1(?=\s|$)/g;
    const intoQuotes = commandLine.match(regexQuoted);
    if (intoQuotes) {
      intoQuotes.forEach(
        match =>
          (commandLine = commandLine.replace(
            match,
            match.replace(/\s/g, charZero)
          ))
      );
    }
    const regexStartAndEndWithQuote = /^(["']).*\1$/;
    return commandLine
      .split(/\s+/)
      .map(argument =>
        regexStartAndEndWithQuote.test(argument)
          ? argument.substr(1, argument.length - 2).replace(/\0/g, ' ')
          : argument
      );
  }

  /**
   * Remove acentuação do texto.
   * @param text
   */
  public static removeAccents(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  /**
   * Converte um texto para representação de slug.
   * @param text
   */
  public static slugify(text: string): string {
    const regexDiscardChars = /[^a-z0-9-]/g;
    const regexSpaces = /(^-+|-+$|(?<=-)-+)/g;
    return this.removeAccents(text)
      .toLowerCase()
      .replace(regexDiscardChars, '-')
      .replace(regexSpaces, '');
  }

  /**
   * Verifica se um texto é valido para um determinado filtro.
   * @param text Texto de entrada.
   * @param filter Filtro como string, RegExp, ou lista mista de ambos.
   * @return Retrona true quando o filtro é correspondente.
   */
  public static matchFilter(text: string, filter: FiltersType): boolean {
    if (!Array.isArray(filter)) {
      filter = [filter];
    }
    for (const filterTest of filter) {
      if (filterTest instanceof RegExp) {
        if (filterTest.test(text)) {
          return true;
        }
      } else {
        if (String(filterTest) == text) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Formata um erro em texto.
   * @param error
   */
  public static formatError(error: unknown): string {
    let errorAsText;
    return error instanceof Error
      ? error.message
        ? error.message
        : `${error.constructor.name}: ${HelperObject.toText(error, 0)}`
      : (errorAsText = String(error).trim())
      ? errorAsText
      : `Unknown error: ${HelperObject.toText(error, 0)}`;
  }

  /**
   * Gera um texto aleatório.
   * @param length Comprimento do texto.
   */
  public static random(length = 10): string {
    if (length < 1) {
      throw new InvalidArgumentError('Length mut be greater than zero.');
    }
    let result = '';
    while (result.length < length) {
      result += Buffer.from(
        (new Date().getMilliseconds() * Math.random())
          .toString()
          .replace('.', ''),
        'hex'
      )
        .toString('base64')
        .replace(/\W/g, '');
    }
    return result.substring(0, length);
  }

  /**
   * Quebra um texto em linhas.
   * @param text Texto de entrada.
   * @param trim Remove espaços no começo e fim de linha.
   * @param breaks Sequências onde a quebra é realizada.
   * @param removeEmptyLines Remove linhas vazias.
   */
  public static breakLines(
    text: string,
    trim = false,
    removeEmptyLines = false,
    breaks: Array<string | RegExp> = ['\r\n', '\n\r', '\n', '\r']
  ): string[] {
    let lines = [text];

    for (const toBreak of breaks) {
      lines = lines.reduce((result: string[], content: string): string[] => {
        result.push(...content.split(toBreak));
        return result;
      }, []);
    }

    if (trim) {
      for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        lines[lineIndex] = lines[lineIndex].trim();
      }

      while (lines[0] === '') {
        lines.splice(0, 1);
      }

      while (lines[lines.length - 1] === '') {
        lines.splice(lines.length - 1, 1);
      }
    }

    if (removeEmptyLines) {
      let lineIndex = 0;
      while (lineIndex < lines.length) {
        if (lines[lineIndex] === '') {
          lines.splice(lineIndex, 1);
          lineIndex--;
        }
        lineIndex++;
      }
    }
    return lines;
  }
}
