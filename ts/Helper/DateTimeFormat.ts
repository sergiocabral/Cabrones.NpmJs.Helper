/**
 * Configurações de formatação de data.
 */
export class DateTimeFormat {
  /**
   * Define os valores padrão para a formatação.
   * @param format Object com formatação.
   */
  public static defaults(format: DateTimeFormat): void {
    if (format?.mask) DateTimeFormat.mask = format.mask;
    if (format?.day) DateTimeFormat.day = format.day;
    if (format?.days) DateTimeFormat.days = format.days;
    if (format?.useUTC) DateTimeFormat.useUTC = format.useUTC;
  }

  /**
   * Monta o conjunto de formatação.
   * @param format Configurações de formatação.
   * @returns Conjunto de formatação totalmente preenchido.
   */
  public static get(format?: DateTimeFormat): DateTimeFormat {
    return Object.assign({}, new DateTimeFormat(), format);
  }

  /**
   * Máscara de formatação.
   *
   * Use para compor a máscara:
   *   D = dias corridos
   *   d = dia
   *   M = mês
   *   y = ano
   *   h = hora
   *   m = minuto
   *   s = segundo
   *   z = milissegundo
   *
   * Nomes de máscara:
   *   running = D h:m:s
   */
  public mask?: string = DateTimeFormat.mask;

  /**
   * Valor padrão para mask.
   */
  public static mask = 'M/d/y h:m:s';

  /**
   * Texto usado para contabilizar 1 dia (singular).
   */
  public day?: string = DateTimeFormat.day;

  /**
   * Valor padrão para day.
   */
  public static day = 'day';

  /**
   * Texto usado para contabilizar 2 ou mais dias (plural).
   */
  public days?: string = DateTimeFormat.days;

  /**
   * Valor padrão para days.
   */
  public static days = 'days';

  /**
   * Exibe sem timezone.
   */
  public useUTC?: boolean = DateTimeFormat.useUTC;

  /**
   * Valor padrão para utc.
   */
  public static useUTC = false;
}
