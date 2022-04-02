/**
 * Informações sobre objetos de disco: arquivos e diretórios
 */
export interface IFileSystemInfo {
  /**
   * Nome.
   */
  name: string;

  /**
   * Caminho completo.
   */
  path: string;

  /**
   * Sinaliza ser diretório.
   */
  isDirectory: boolean;

  /**
   * Tamanho em bytes.
   */
  size: number;

  /**
   * Diretório pai.
   */
  parent?: IFileSystemInfo;

  /**
   * Arquivos e diretórios filhos.
   */
  children: IFileSystemInfo[];

  /**
   * Sinaliza se existe ou não.
   */
  exists: boolean;
}
