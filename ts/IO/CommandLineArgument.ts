import { InvalidArgumentError } from '../Error/InvalidArgumentError';
import { HelperList } from '../Helper/HelperList';
import { CommandLineConfiguration } from './CommandLineConfiguration';

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
    commandLineArgument: string,
    private readonly configuration: CommandLineConfiguration
  ) {
    const nameValue = this.parse(commandLineArgument);
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
  private parse(commandLineArgument: string): [string, string | undefined] {
    // TODO: Reescrever parse
    // const attributionIndex = commandLineArgument.indexOf(
    //   this.configuration.attribution
    // );
    //
    // let name: string = commandLineArgument;
    // let value: string | undefined;
    //
    // const hasValue = attributionIndex >= 0;
    // if (hasValue) {
    //   name = commandLineArgument.substring(0, attributionIndex);
    //   value = commandLineArgument.substring(
    //     attributionIndex + this.configuration.attribution.length
    //   );
    //
    //   const regexTextQuoted = new RegExp(`^([${this.sequenceOfQuotes}]).*\\1$`);
    //   if (regexTextQuoted.test(value)) {
    //     value = value.substring(1, value.length - 1);
    //   }
    // }
    //
    // return [name, value];

    return ['', undefined];
  }

  /**
   * Representação como texto.
   */
  public toString(): string {
    // TODO: Reescrever toString
    // if (this.value !== undefined) {
    //   return `${this.name}${this.configuration.attribution}${this.configuration.quotes[0]}${this.value}${this.configuration.quotes[0]}`;
    // }
    // return this.name;

    return '';
  }
}
