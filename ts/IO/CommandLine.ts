import { CommandLineArgument } from './CommandLineArgument';
import { HelperText } from '../Helper/HelperText';

/**
 * Manipulação de texto para linha de comando.
 */
export class CommandLine {
  /**
   * Construtor.
   * @param commandLine Linha de comando.
   * @param caseInsensitiveForName Ignora minúsculas e maiúsculas para nomes de argumentos.
   * @param caseInsensitiveForValue Ignora minúsculas e maiúsculas para valores de argumentos.
   */
  constructor(
    public readonly commandLine: string,
    public caseInsensitiveForName: boolean = false,
    public caseInsensitiveForValue: boolean = false
  ) {
    this.args = this.parseArguments(commandLine);
  }

  /**
   * Argumentos.
   */
  public readonly args: CommandLineArgument[];

  /**
   * Avalia um texto de linha de comando e separa em partes.
   */
  private parseArguments(commandLine: string): CommandLineArgument[] {
    const quotesEscapedForRegex = HelperText.escapeRegExp(
      CommandLineArgument.quotes.join('')
    );
    const regexAllQuotedText = new RegExp(
      `([${quotesEscapedForRegex}]).*?\\1`,
      'g'
    );
    const regexSpace = /\s+/;
    const regexAllSpaces = /\s/g;
    const regexAllSpaceMarks = /\0/g;
    const regexTextWithQuotedAndMarks = new RegExp(
      `([${quotesEscapedForRegex}]).*\0.*\\1`
    );
    const spaceMark = String.fromCharCode(0);

    const intoQuotes = commandLine.match(regexAllQuotedText);
    if (intoQuotes) {
      intoQuotes.forEach(
        match =>
          (commandLine = commandLine.replace(
            match,
            match.replace(regexAllSpaces, spaceMark)
          ))
      );
    }

    const parts = commandLine
      .split(regexSpace)
      .map(argument => {
        if (argument === '') {
          return argument;
        }

        const hasQuotedAndMarks = regexTextWithQuotedAndMarks.test(argument);
        if (hasQuotedAndMarks) {
          argument = argument.replace(regexAllSpaceMarks, ' ');
        }

        return argument;
      })
      .filter(v => v);

    return parts.map(arg => new CommandLineArgument(arg));
  }

  /**
   * Normaliza o texto para comparação. Apenas para nome de argumento.
   */
  private normalizeCaseForName(argName: string): string {
    return !this.caseInsensitiveForName ? argName : argName.toLowerCase();
  }

  /**
   * Normaliza o texto para comparação. Apenas para valor de argumento.
   */
  private normalizeCaseForValue(
    argValue: string | undefined
  ): string | undefined {
    return !this.caseInsensitiveForValue || argValue === undefined
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
}
