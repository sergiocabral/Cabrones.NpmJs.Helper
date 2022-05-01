import { CommandLineArgument } from './CommandLineArgument';
import { CommandLineConfiguration } from './CommandLineConfiguration';
import { ICommandLineConfiguration } from './ICommandLineConfiguration';
import { FilterType } from '../../Type/FilterType';
import { HelperText } from '../../Data/HelperText';
import { HelperList } from '../../Data/HelperList';

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
    configuration?: Partial<ICommandLineConfiguration>
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
  public readonly configuration: CommandLineConfiguration;

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
   * Normaliza o filtro para comparação.
   */
  private normalizeArgumentFilter(
    propertyName: 'name' | 'value',
    argFilter: FilterType | undefined
  ): RegExp {
    if (typeof argFilter === 'string') {
      return new RegExp(
        `^${HelperText.escapeRegExp(argFilter)}$`,
        (propertyName === 'name' &&
          this.configuration.caseInsensitiveForName) ||
        (propertyName === 'value' && this.configuration.caseInsensitiveForValue)
          ? 'i'
          : ''
      );
    } else if (argFilter instanceof RegExp) {
      return (propertyName === 'name' &&
        this.configuration.caseInsensitiveForName) ||
        (propertyName === 'value' && this.configuration.caseInsensitiveForValue)
        ? new RegExp(argFilter, 'i')
        : argFilter;
    } else {
      return new RegExp('^\0$');
    }
  }

  /**
   * Normaliza o texto do nome ou valor do argumento para comparação.
   */
  private normalizeArgumentNameOrValue(
    propertyName: 'name' | 'value',
    argNameOrValue: string | undefined
  ): string {
    if (argNameOrValue === undefined) {
      return '\0';
    } else if (
      (propertyName === 'name' && this.configuration.caseInsensitiveForName) ||
      (propertyName === 'value' && this.configuration.caseInsensitiveForValue)
    ) {
      return argNameOrValue.toLowerCase();
    } else {
      return argNameOrValue;
    }
  }

  /**
   * Verifica presença de um argumento por nome.
   * @param propertyName Nome da pripriedade.
   * @param argFilter Filtro.
   */
  private hasArgumentNameOrValue(
    propertyName: 'name' | 'value',
    argFilter: Array<FilterType | undefined>
  ): boolean {
    if (argFilter.length === 0) {
      return false;
    }

    const filters = argFilter.map(argName =>
      this.normalizeArgumentFilter(propertyName, argName)
    );

    return (
      this.args.find(
        arg =>
          filters.find(filter =>
            filter.test(
              this.normalizeArgumentNameOrValue(propertyName, arg[propertyName])
            )
          ) !== undefined
      ) !== undefined
    );
  }

  /**
   * Busca todos os argumentos por nome
   */
  private getArguments(
    argNames: FilterType[],
    stopAtFirst = false
  ): CommandLineArgument[] {
    if (argNames.length === 0) {
      return [];
    }

    const filters = argNames.map(argName =>
      this.normalizeArgumentFilter('name', argName)
    );

    const result: CommandLineArgument[] = [];
    for (const arg of this.args) {
      const match =
        filters.find(filter =>
          filter.test(this.normalizeArgumentNameOrValue('name', arg.name))
        ) !== undefined;
      if (match) {
        result.push(arg);
        if (stopAtFirst) {
          break;
        }
      }
    }
    return result;
  }

  /**
   * Verifica presença de um argumento por nome.
   */
  public hasArgumentName(...argNames: FilterType[]): boolean {
    return this.hasArgumentNameOrValue('name', argNames);
  }

  /**
   * Verifica presença de um valor de argumento.
   */
  public hasArgumentValue(
    ...argValues: Array<FilterType | undefined>
  ): boolean {
    return this.hasArgumentNameOrValue('value', argValues);
  }

  /**
   * Verifica presença de um argumento com determinado valor.
   */
  public hasArgumentNameWithValue(
    argNames: FilterType[],
    argValues: Array<FilterType | undefined>
  ): boolean {
    if (argNames.length === 0 || argValues.length === 0) {
      return false;
    }

    const filtersNames = argNames.map(argName =>
      this.normalizeArgumentFilter('name', argName)
    );
    const filtersValues = argValues.map(argValue =>
      this.normalizeArgumentFilter('value', argValue)
    );

    return (
      this.args.find(
        arg =>
          filtersNames.find(filter =>
            filter.test(this.normalizeArgumentNameOrValue('name', arg.name))
          ) !== undefined &&
          filtersValues.find(filter =>
            filter.test(this.normalizeArgumentNameOrValue('value', arg.value))
          ) !== undefined
      ) !== undefined
    );
  }

  /**
   * Busca o primeiro valor de um argumento
   */
  public getArgumentName(...argNames: FilterType[]): string | undefined {
    const stopAtFirst = true;
    const args = this.getArguments(argNames, stopAtFirst);
    return args.length > 0 ? args[0]?.name : undefined;
  }

  /**
   * Busca todos os valores de um argumento
   */
  public getArgumentNames(
    ...argNames: FilterType[]
  ): Array<string | undefined> {
    const args = this.getArguments(argNames);
    return HelperList.unique(args.map(arg => arg.name));
  }

  /**
   * Busca o primeiro valor de um argumento
   */
  public getArgumentValue(...argNames: FilterType[]): string | undefined {
    const stopAtFirst = true;
    const args = this.getArguments(argNames, stopAtFirst);
    return args.length > 0 ? args[0]?.value : undefined;
  }

  /**
   * Busca todos os valores de um argumento
   */
  public getArgumentValues(
    ...argNames: FilterType[]
  ): Array<string | undefined> {
    const args = this.getArguments(argNames);
    return args.map(arg => arg.value);
  }

  /**
   * Representação como texto.
   */
  public toString(): string {
    return this.args.map(arg => arg.toString()).join(' ');
  }
}
