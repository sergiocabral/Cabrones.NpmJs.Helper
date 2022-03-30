import { CommandLineArgument } from './CommandLineArgument';
import { HelperText } from '../Helper/HelperText';
import { CommandLineConfiguration } from './CommandLineConfiguration';
import { ICommandLineConfiguration } from './ICommandLineConfiguration';

/**
 * Manipulação de texto para linha de comando.
 */
export class CommandLine {
  /**
   * Construtor.
   * @param commandLine Linha de comando.
   * @param configuration Configurações usadas para o parse da linha de comando.
   */
  constructor(
    public readonly commandLine: string,
    configuration?: ICommandLineConfiguration
  ) {
    this.configuration = new CommandLineConfiguration(configuration);
    this.args = this.parseArguments(commandLine);
  }

  /**
   * Argumentos.
   */
  public readonly args: CommandLineArgument[];

  /**
   * Configurações usadas para o parse da linha de comando.
   * @private
   */
  private readonly configuration: CommandLineConfiguration;

  /**
   * Avalia um texto de linha de comando e separa em partes.
   */
  private parseArguments(commandLine: string): CommandLineArgument[] {
    const regexAllSpaces = /\s/g;
    const spaceMark = String.fromCharCode(0);
    const regexSpace = /\s+/;
    const regexAllSpaceMarks = /\0/g;

    for (const quotes of this.configuration.quotes) {
      const regexQuoted = CommandLineConfiguration.regexAllQuotes(quotes);
      const intoQuotes = commandLine.match(regexQuoted);
      if (intoQuotes) {
        intoQuotes.forEach(
          match =>
            (commandLine = commandLine.replace(
              match,
              match.replace(regexAllSpaces, spaceMark)
            ))
        );
      }
    }

    const parts = commandLine
      .split(regexSpace)
      .map(argument => {
        if (argument === '') {
          return argument;
        }

        argument = argument.replace(regexAllSpaceMarks, ' ');

        return argument;
      })
      .filter(v => v);

    return parts.map(arg => new CommandLineArgument(arg, this.configuration));
  }

  /**
   * Normaliza o texto para comparação. Apenas para nome de argumento.
   */
  private normalizeCaseForName(argName: string): string {
    return !this.configuration.caseInsensitiveForName
      ? argName
      : argName.toLowerCase();
  }

  /**
   * Normaliza o texto para comparação. Apenas para valor de argumento.
   */
  private normalizeCaseForValue(
    argValue: string | undefined
  ): string | undefined {
    return !this.configuration.caseInsensitiveForValue || argValue === undefined
      ? argValue
      : argValue.toLowerCase();
  }

  /**
   * Verifica presença de um argumento por nome.
   */
  public hasArgumentName(...argNames: string[]): boolean {
    if (argNames.length === 0) {
      return false;
    }

    argNames = argNames.map(argName => this.normalizeCaseForName(argName));
    return (
      this.args.find(
        arg => argNames.indexOf(this.normalizeCaseForName(arg.name)) >= 0
      ) !== undefined
    );
  }

  /**
   * Verifica presença de um valor de argumento.
   */
  public hasArgumentValue(...argValues: Array<string | undefined>): boolean {
    if (argValues.length === 0) {
      return false;
    }

    argValues = argValues.map(argValue => this.normalizeCaseForValue(argValue));

    return (
      this.args.find(
        arg => argValues.indexOf(this.normalizeCaseForValue(arg.value)) >= 0
      ) !== undefined
    );
  }

  /**
   * Verifica presença de um argumento com determinado valor.
   */
  public hasArgumentNameWithValue(
    argNames: string[],
    argValues: Array<string | undefined>
  ): boolean {
    if (argNames.length === 0 || argValues.length === 0) {
      return false;
    }

    argNames = argNames.map(argName => this.normalizeCaseForName(argName));
    argValues = argValues.map(argValue => this.normalizeCaseForValue(argValue));
    return (
      this.args.find(
        arg =>
          argNames.indexOf(this.normalizeCaseForName(arg.name)) >= 0 &&
          argValues.indexOf(this.normalizeCaseForValue(arg.value)) >= 0
      ) !== undefined
    );
  }

  /**
   * Busca o primeiro valor de um argumento
   */
  public getArgumentValue(...argNames: string[]): string | undefined {
    if (argNames.length === 0) {
      return undefined;
    }

    argNames = argNames.map(argName => this.normalizeCaseForName(argName));
    const arg = this.args.find(
      arg => argNames.indexOf(this.normalizeCaseForName(arg.name)) >= 0
    );
    return arg?.value;
  }

  /**
   * Busca todos os valores de um argumento
   */
  public getArgumentValues(...argNames: string[]): Array<string | undefined> {
    if (argNames.length === 0) {
      return [];
    }

    argNames = argNames.map(argName => this.normalizeCaseForName(argName));
    const args = this.args.filter(
      arg => argNames.indexOf(this.normalizeCaseForName(arg.name)) >= 0
    );
    return args.map(arg => arg.value);
  }

  /**
   * Representação como texto.
   */
  public toString(): string {
    return this.args.map(arg => arg.toString()).join(' ');
  }
}
