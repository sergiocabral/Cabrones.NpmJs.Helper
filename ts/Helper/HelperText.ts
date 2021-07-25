/**
 * Utilitários para texto (string).
 */
import { InvalidExecutionError } from "../Error/InvalidExecutionError";
import { KeyValue } from '../Type/KeyValue';

export class HelperText {
  /**
   * Construtor proibido.
   */
  public constructor () {
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
    const doNotTreatAsString = (values: unknown): boolean => values === undefined || values === null;
    let text = template;
    if (Array.isArray(values)) {
      for (let valueIndex = 0; valueIndex < values.length; valueIndex++) {
        text = HelperText.replaceAll(text, `{${valueIndex}}`, values[valueIndex]);
      }
    } else if (typeof values === 'object' && !doNotTreatAsObject(values)) {
      const objectValue = values as KeyValue;
      const properties = Object.keys(objectValue);
      for (const property of properties) {
        const value = String(objectValue[property]);
        text = HelperText.replaceAll(text, `{${property}}`, value);
      }
    } else if (!doNotTreatAsString(values)) {
      const stringValue = values as string;
      text = HelperText.replaceAll(text, `{0}`, stringValue);
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
  public static replaceAll(value: string, search: string, replacement: string): string {
    return value.replace(new RegExp(HelperText.escapeRegExp(search), 'g'), replacement);
  }
}
