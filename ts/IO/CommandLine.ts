import { CommandLineArgument } from './CommandLineArgument';
import { HelperText } from '../Helper/HelperText';

/**
 * Manipulação de texto para linha de comando.
 */
export class CommandLine {
  /**
   * Construtor.
   * @param commandLine Linha de comando.
   */
  constructor(public readonly commandLine: string) {
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
}
