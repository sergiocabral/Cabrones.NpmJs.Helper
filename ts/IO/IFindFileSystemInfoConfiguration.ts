/**
 * Configuração durante a busca de arquivos e diretórios.
 */
export interface IFindFileSystemInfoConfiguration {
  /**
   * Aplica um filtro no nome durante a pesquisa.
   */
  nameFilter: RegExp[];

  /**
   * Localiza todos os diretórios pai.
   */
  fillParents: boolean;

  /**
   * Consulta o tamanho do arquivo.
   */
  fillFileSize: boolean;

  /**
   * Consulta o tamanho do diretório.
   */
  fillDirectorySize: boolean;

  /**
   * Verifica existência em disco.
   */
  checkExistence: boolean;
}
