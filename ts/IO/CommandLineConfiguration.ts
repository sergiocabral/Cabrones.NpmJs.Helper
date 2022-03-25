import { InvalidArgumentError } from '../Error/InvalidArgumentError';
import { ICommandLineConfiguration } from './ICommandLineConfiguration';

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
}
