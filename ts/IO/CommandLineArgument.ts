import {InvalidArgumentError} from "../Error/InvalidArgumentError";
import {HelperList} from "../Helper/HelperList";

/**
 * Representa um argumento nalinha de comando.
 */
export class CommandLineArgument {
  /**
   * Caracter que sinaliza: atribuição de vaor a um argumento.
   */
  private static attributionValue = '=';

  /**
   * Caracter que sinaliza: atribuição de vaor a um argumento.
   */
  public static get attribution(): string {
    return this.attributionValue;
  }

  /**
   * Caracter que sinaliza: atribuição de vaor a um argumento.
   */
  public static set attribution(value: string) {
    if (!value.trim()) {
      throw new InvalidArgumentError('Empty attribuition characters.');
    }
    this.attributionValue = value.trim();
  }

  /**
   * Caracteres que sinalizam: delimitação de texto.
   */
  private static quotesValue = '\'"`´';

  /**
   * Caracteres que sinalizam: delimitação de texto.
   */
  public static get quotes(): string[] {
    return this.quotesValue.split('');
  }

  /**
   * Caracteres que sinalizam: delimitação de texto.
   */
  public static set quotes(value: string[]) {
    const quotes = HelperList.unique(value).filter(v => v.trim());
    if (quotes.length === 0) {
      throw new InvalidArgumentError('Empty list of quotes characters.');
    }
    if (quotes.filter(v => v.length !== 1).length > 0) {
      throw new InvalidArgumentError('Quotes with multiple characters.');
    }
    this.quotesValue = quotes.join('');
  }

  /**
   * Caracter padrão que sinalizar: delimitação de texto.
   */
  public static get quote(): string {
    return this.quotesValue[0];
  }

  /**
   * Construtor.
   */
  constructor(commandLineArgument: string) {
    const nameValue = CommandLineArgument.parse(commandLineArgument);
    this.name = nameValue[0];
    this.value = nameValue[1];
  }

  /**
   * Nome.
   */
  public readonly name: string;

  /**
   * Value.
   */
  public readonly value?: string;

  /**
   * Avalia um argumento e separa em nome e valor.
   */
  private static parse(
    commandLineArgument: string
  ): [string, string | undefined] {
    const attributionIndex = commandLineArgument.indexOf(
      CommandLineArgument.attribution
    );

    let name: string = commandLineArgument;
    let value: string | undefined;

    const hasValue = attributionIndex >= 0;
    if (hasValue) {
      name = commandLineArgument.substring(0, attributionIndex);
      value = commandLineArgument.substring(
        attributionIndex + CommandLineArgument.attribution.length
      );

      const regexTextQuoted = new RegExp(
        `^([${CommandLineArgument.quotesValue}]).*\\1$`
      );
      if (regexTextQuoted.test(value)) {
        value = value.substring(1, value.length - 1);
      }
    }

    return [name, value];
  }

  /**
   * Representação como texto.
   */
  public toString(): string {
    if (this.value !== undefined) {
      return `${this.name}${CommandLineArgument.attribution}${CommandLineArgument.quote}${this.value}${CommandLineArgument.quote}`;
    }
    return this.name;
  }
}
