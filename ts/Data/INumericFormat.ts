/**
 * Configurações de formatação de número.
 */
export interface INumericFormat {
  /**
   * Dígitos decimais.
   */
  digits?: number;

  /**
   * Caracter usado como vírgula.
   */
  decimal?: string;

  /**
   * Valor padrão para separador de milhares.
   */
  miles?: string;

  /**
   * Exibe o sinal de positivo sempre.
   */
  showPositive?: boolean;

  /**
   * Texto anexado no início do resultado.
   */
  prefix?: string;

  /**
   * Texto anexado no final do resultado.
   */
  suffix?: string;
}
