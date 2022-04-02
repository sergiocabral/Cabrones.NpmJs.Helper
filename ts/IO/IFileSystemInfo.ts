/**
 * Informações sobre objetos de disco: arquivos e diretórios
 */
export interface IFileSystemInfo {
  /**
   * Caminho completo.
   */
  path: string;

  /**
   * Nome.
   */
  name: string;

  /**
   * Extensão do arquivo.
   */
  extension: string;

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
