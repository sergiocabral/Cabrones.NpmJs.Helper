/**
 * Campos usados no monitoramento de objetos de disco.
 */
export interface IFileSystemFields {
  /**
   * Sinaliza existência.
   */
  exists: boolean;

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
