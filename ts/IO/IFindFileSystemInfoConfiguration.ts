/**
 * Configuração durante a busca de arquivos e diretórios.
 */
export interface IFindFileSystemInfoConfiguration {
  /**
   * Verifica existência em disco.
   */
  checkExistence: boolean;

  /**
   * Verifica se é arquivo ou diretório
   */
  checkIfFileOrDirectory: boolean;

  /**
   * Aplica um filtro no nome durante a pesquisa.
   */
  nameFilter: RegExp[];

  /**
   * Carrega os nomes de todos os diretórios pai.
   */
  fillParents: boolean;

  /**
   * Carrega os dados o diretório pai.
   */
  fillParent: boolean;

  /**
   * Consulta o tamanho do arquivo.
   */
  fillFileSize: boolean;

  /**
   * Consulta o tamanho do diretório.
   */
  fillDirectorySize: boolean;
}
