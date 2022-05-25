/**
 * Campos usados no monitoramento de objetos de disco.
 */
export interface IFileSystemFields {
  /**
   * Caminho informado.
   */
  path: string;

  /**
   * Sinaliza existência.
   */
  exists: boolean;

  /**
   * Caminho real do arquivo.
   */
  realpath: string;

  /**
   * Tamanho do arquivo.
   */
  size: number;

  /**
   * Data de criação.
   */
  creation: Date;

  /**
   * Data da última modificação.
   */
  modification: Date;

  /**
   * Data do último acesso.
   */
  accessed: Date;
}
