import { INumericFormat } from './INumericFormat';

/**
 * Configurações de formatação de número.
 */
export class NumericFormat implements INumericFormat {
  /**
   * Define os valores padrão para a formatação.
   * @param format Object com formatação.
   */
  public static defaults(format: INumericFormat): void {
    if (format?.digits !== undefined) NumericFormat.digits = format.digits;
    if (format?.decimal !== undefined) NumericFormat.decimal = format.decimal;
    if (format?.miles !== undefined) NumericFormat.miles = format.miles;
    if (format?.showPositive !== undefined)
      NumericFormat.showPositive = format.showPositive;
    if (format?.prefix !== undefined) NumericFormat.prefix = format.prefix;
    if (format?.suffix !== undefined) NumericFormat.suffix = format.suffix;
  }

  /**
   * Monta o conjunto de formatação.
   * @param format Configurações de formatação.
   * @returns Conjunto de formatação totalmente preenchido.
   */
  public static get(format?: INumericFormat): NumericFormat {
    return Object.assign({}, new NumericFormat(), format);
  }

  /**
   * Dígitos decimais.
   */
  public digits: number = NumericFormat.digits;

  /**
   * Valor padrão para digits.
   */
  public static digits = 2;

  /**
   * Caracter usado como vírgula.
   */
  public decimal: string = NumericFormat.decimal;

  /**
   * Valor padrão para decimal.
   */
  public static decimal = '.';

  /**
   * Valor padrão para separador de milhares.
   */
  public miles: string = NumericFormat.miles;

  /**
   * Valor padrão para separador de milhares.
   */
  public static miles = ',';

  /**
   * Exibe o sinal de positivo sempre.
   */
  public showPositive: boolean = NumericFormat.showPositive;

  /**
   * Valor padrão para showPositive.
   */
  public static showPositive = false;

  /**
   * Texto anexado no início do resultado.
   */
  public prefix: string = NumericFormat.prefix;

  /**
   * Valor padrão para prefix.
   */
  public static prefix = '';

  /**
   * Texto anexado no final do resultado.
   */
  public suffix: string = NumericFormat.suffix;

  /**
   * Valor padrão para suffix.
   */
  public static suffix = '';
}
