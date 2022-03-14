import { CommandLineArgument } from './CommandLineArgument';
import { HelperText } from '../Helper/HelperText';

/**
 * Manipulação de texto para linha de comando.
 */
export class CommandLine {
  /**
   * Construtor.
   * @param commandLine Linha de comando.
   * @param caseInsensitive Gnora minúsculas e maiúsculas.
   */
  constructor(
    public readonly commandLine: string,
    // TODO: Separar caseInsensitive para nome e valor.
    public caseInsensitive: boolean = false
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
   * Normaliza o texto para comparação com base no caseInsensitive
   */
  private normalizeCase(input: string): string {
    return this.caseInsensitive ? input.toLowerCase() : input;
  }

  // TODO: Transformar argumentos em spread array

  /**
   * Verifica presença de um argumento por nome.
   */
  public hasArgumentName(argName: string): boolean {
    argName = this.normalizeCase(argName);
    return (
      this.args.find(arg => this.normalizeCase(arg.name) == argName) !==
      undefined
    );
  }

  /**
   * Verifica presença de um valor de argumento.
   */
  public hasArgumentValue(argValue: string | undefined): boolean {
    argValue = argValue === undefined ? argValue : this.normalizeCase(argValue);
    return (
      this.args.find(
        arg =>
          (arg.value === undefined
            ? arg.value
            : this.normalizeCase(arg.value)) == argValue
      ) !== undefined
    );
  }

  /**
   * Verifica presença de um argumento com determinado valor.
   */
  public hasArgumentNameWithValue(
    argName: string,
    argValue: string | undefined
  ): boolean {
    argName = this.normalizeCase(argName);
    argValue = argValue === undefined ? argValue : this.normalizeCase(argValue);
    return (
      this.args.find(
        arg =>
          this.normalizeCase(arg.name) === argName &&
          (arg.value === argValue ||
            this.normalizeCase(String(arg.value)) ===
              this.normalizeCase(String(argValue)))
      ) !== undefined
    );
  }

  /**
   * Busca o primeiro valor de um argumento
   */
  public getArgumentValue(argName: string): string | undefined {
    argName = this.normalizeCase(argName);
    const arg = this.args.find(arg => this.normalizeCase(arg.name) == argName);
    return arg?.value;
  }

  /**
   * Busca todos os valores de um argumento
   */
  public getArgumentValues(argName: string): Array<string | undefined> {
    argName = this.normalizeCase(argName);
    const args = this.args.filter(
      arg => this.normalizeCase(arg.name) == argName
    );
    return args.map(arg => arg.value);
  }
}
