import { InvalidArgumentError } from '../Error/InvalidArgumentError';
import { ICommandLineConfiguration } from './ICommandLineConfiguration';
import { HelperText } from '../Helper/HelperText';

/**
 * Configurações usadas para o parse da linha de comando.
 */
export class CommandLineConfiguration implements ICommandLineConfiguration {
  /**
   * Construtor.
   * @param configuration Configurações iniciais.
   */
  public constructor(configuration?: ICommandLineConfiguration) {
    if (configuration?.caseInsensitiveForName !== undefined) {
      this.caseInsensitiveForName = configuration.caseInsensitiveForName;
    }
    if (configuration?.caseInsensitiveForValue !== undefined) {
      this.caseInsensitiveForValue = configuration.caseInsensitiveForValue;
    }
    if (configuration?.attribution !== undefined) {
      this.attribution = configuration.attribution;
    }
    if (configuration?.quotes !== undefined) {
      this.quotes = configuration.quotes;
    }
  }

  /**
   * Ignora minúsculas e maiúsculas para nomes de argumentos.
   */
  public caseInsensitiveForName = false;

  /**
   * Ignora minúsculas e maiúsculas para valores de argumentos.
   */
  public caseInsensitiveForValue = false;

  private attributionValue = '=';

  public get attribution(): string {
    return this.attributionValue;
  }

  public set attribution(value: string) {
    if (!value.trim()) {
      throw new InvalidArgumentError('Empty attribuition characters.');
    }

    this.attributionValue = value;
  }

  private quotesValue: Array<[string, string]> = [
    ['"', '"'],
    ["'", "'"],
    ['`', '`'],
    ['´', '´']
  ];

  public get quotes(): Array<[string, string]> {
    return JSON.parse(JSON.stringify(this.quotesValue)) as Array<
      [string, string]
    >;
  }

  public set quotes(value: Array<[string, string]>) {
    if (value.length === 0) {
      throw new InvalidArgumentError('Empty list of quotes characters.');
    }
    if (value.filter(v => v[0].length === 0 || v[1].length === 0).length > 0) {
      throw new InvalidArgumentError('Empty quotes mark.');
    }

    this.quotesValue = value;
  }

  /**
   * Retorna a lista de Regex para captura de valores entre aspas.
   */
  public regexQuotes(quotes: [string, string], flags?: string): RegExp {
    return new RegExp(
      `${HelperText.escapeRegExp(quotes[0])}.*?${HelperText.escapeRegExp(
        quotes[1]
      )}`,
      flags
    );
  }

  /**
   * Remove aspas (caso exista) de um valor.
   */
  public removeQuotes(value: string): string {
    for (const quotes of this.quotes) {
      const regexQuoted = this.regexQuotes(quotes);
      const match = value.match(regexQuoted);
      if (match && match.index !== undefined) {
        value =
          value.substring(0, match.index) +
          value.substring(
            match.index + quotes[0].length,
            match[0].length - quotes[1].length
          ) +
          value.substring(match[0].length + quotes[1].length);
        break;
      }
    }
    return value;
  }
}
