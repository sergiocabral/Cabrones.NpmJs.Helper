import { Stats } from 'fs';

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
   * Dados do item.
   */
  stats: Stats | undefined;

  /**
   * Sinaliza ser arquivo.
   */
  isFile: boolean;

  /**
   * Sinaliza ser diretório.
   */
  isDirectory: boolean;

  /**
   * Tamanho em bytes.
   */
  size: number;

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
}
