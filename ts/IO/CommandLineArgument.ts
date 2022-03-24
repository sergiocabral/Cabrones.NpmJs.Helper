import { InvalidArgumentError } from '../Error/InvalidArgumentError';
import { HelperList } from '../Helper/HelperList';

/**
 * Representa um argumento nalinha de comando.
 */
export class CommandLineArgument {
  /**
   * Valida os valores dos parâmetros fundamentais para parse de argumento.
   * @param attribution Caracteres que indicam atriuição de valor.
   * @param quotes Sequência de caracteres usados como aspas
   */
  public static validateParameters(
    attribution: string,
    quotes: string[]
  ): void {
    if (!attribution.trim()) {
      throw new InvalidArgumentError('Empty attribuition characters.');
    }
    if (quotes.length === 0) {
      throw new InvalidArgumentError('Empty list of quotes characters.');
    }
    if (quotes.filter(v => v.length !== 1).length > 0) {
      throw new InvalidArgumentError('Quotes with multiple characters.');
    }
  }

  /**
   * Construtor.
   * @param commandLineArgument Um argumento da linha de comando.
   * @param attribution Caracteres que indicam atriuição de valor.
   * @param quotes Sequência de caracteres usados como aspas
   */
  constructor(
    commandLineArgument: string,
    private readonly attribution: string = '=',
    private readonly quotes: string[] = ["'", '"', '`', '´']
  ) {
    CommandLineArgument.validateParameters(attribution, quotes);
    const nameValue = this.parse(commandLineArgument);
    this.name = nameValue[0];
    this.value = nameValue[1];
    this.sequenceOfQuotes = quotes.join('');
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
   * Sequência de aspas válidas.
   */
  private readonly sequenceOfQuotes: string;

  /**
   * Avalia um argumento e separa em nome e valor.
   */
  private parse(commandLineArgument: string): [string, string | undefined] {
    const attributionIndex = commandLineArgument.indexOf(this.attribution);

    let name: string = commandLineArgument;
    let value: string | undefined;

    const hasValue = attributionIndex >= 0;
    if (hasValue) {
      name = commandLineArgument.substring(0, attributionIndex);
      value = commandLineArgument.substring(
        attributionIndex + this.attribution.length
      );

      const regexTextQuoted = new RegExp(`^([${this.sequenceOfQuotes}]).*\\1$`);
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
      return `${this.name}${this.attribution}${this.quotes[0]}${this.value}${this.quotes[0]}`;
    }
    return this.name;
  }
}
