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
   * Sinaliza se existe ou não.
   */
  exists: boolean;

  /**
   * Caminho absoluto.
   */
  absolutePath: string | undefined;

  /**
   * Sinaliza ser arquivo.
   */
  isFile: boolean;

  /**
   * Sinaliza ser diretório.
   */
  isDirectory: boolean;

  /**
   * Diretórios ancestrais.
   */
  parents: string[];

  /**
   * Diretório pai.
   */
  parent?: IFileSystemInfo;

  /**
   * Arquivos e diretórios filhos.
   */
  children: IFileSystemInfo[];

  /**
   * Tamanho em bytes.
   */
  size: number;
}
