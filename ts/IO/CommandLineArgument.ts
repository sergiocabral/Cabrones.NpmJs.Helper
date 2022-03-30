import { InvalidArgumentError } from '../Error/InvalidArgumentError';
import { HelperList } from '../Helper/HelperList';
import { CommandLineConfiguration } from './CommandLineConfiguration';
import { ICommandLineConfiguration } from './ICommandLineConfiguration';

/**
 * Representa um argumento nalinha de comando.
 */
export class CommandLineArgument {
  /**
   * Construtor.
   * @param commandLineArgument Um argumento da linha de comando.
   * @param configuration Configurações usadas para o parse da linha de comando.
   */
  constructor(
    commandLineArgument?: string,
    configuration?: ICommandLineConfiguration
  ) {
    this.configuration = new CommandLineConfiguration(configuration);

    if (commandLineArgument !== undefined) {
      const nameValue = this.parse(commandLineArgument);
      this.name = nameValue[0];
      this.value = nameValue[1];
    }
  }

  /**
   * Configurações usadas para o parse da linha de comando.
   * @private
   */
  public readonly configuration: CommandLineConfiguration;

  /**
   * Nome.
   */
  public name = '';

  /**
   * Value.
   */
  public value?: string;

  /**
   * Avalia um argumento e separa em nome e valor.
   */
  private parse(commandLineArgument: string): [string, string | undefined] {
    const attributionIndex = commandLineArgument.indexOf(
      this.configuration.attribution
    );

    let name: string = commandLineArgument;
    let value: string | undefined;

    const hasValue = attributionIndex >= 0;
    if (hasValue) {
      name = commandLineArgument.substring(0, attributionIndex);
      value = commandLineArgument.substring(
        attributionIndex + this.configuration.attribution.length
      );

      value = this.configuration.removeQuotes(value);
    }

    return [name, value];
  }

  /**
   * Representação como texto.
   */
  public toString(): string {
    if (this.value !== undefined) {
      return `${this.name}${this.configuration.attribution}${this.configuration.quotes[0][0]}${this.value}${this.configuration.quotes[0][1]}`;
    }
    return this.name;
  }
}
