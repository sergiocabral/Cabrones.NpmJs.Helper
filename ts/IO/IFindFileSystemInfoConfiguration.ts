/**
 * Configuração durante a busca de arquivos e diretórios.
 */
import { FilterType } from '../Data/FilterType';

export interface IFindFileSystemInfoConfiguration {
  /**
   * Verifica existência em disco.
   */
  checkExistence: boolean;

  /**
   * Verifica o caminho real e absoluto.
   */
  fillAbsolutePath: boolean;

  /**
   * Carrega dados gerais do item: tamanho de arquivo, se é arquivo ou diretório.
   */
  loadStats: boolean;

  /**
   * Consulta o tamanho do diretório.
   */
  fillDirectorySize: boolean;

  /**
   * Aplica um filtro no nome do arquivo durante a pesquisa.
   */
  fileFilter: FilterType;

  /**
   * Aplica um filtro no nome do diretório durante a pesquisa.
   */
  directoryFilter: FilterType;

  /**
   * Carrega os nomes de todos os diretórios pai.
   */
  fillParents: boolean;

  /**
   * Carrega os dados o diretório pai.
   */
  fillParent: boolean;

  /**
   * Carrega os itens filhos.
   */
  fillChildren: boolean;
}
