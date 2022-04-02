/**
 * Representação do JSON de um package.json.
 * https://docs.npmjs.com/cli/v7/configuring-npm/package-json
 */
export interface IPackageJson {
  /**
   * Nome do pacote.
   */
  name?: string;

  /**
   * Versão
   */
  version?: string;

  /**
   * Descrição
   */
  description?: string;

  /**
   * Palavras chaves.
   */
  keywords?: string[];

  /**
   * Nome do pacote.
   */
  homepage?: string;

  /**
   * Reportar bugs.
   */
  bugs?: {
    /**
     * Endereço para registrar chamados.
     */
    url?: string;

    /**
     * Email de contatos.
     */
    email?: string;
  };

  /**
   * Licenciamento.
   */
  license?: string;

  /**
   * Autor do pacote.
   */
  author?:
    | string
    | {
        /**
         * Nome do autor.
         */
        name?: string;

        /**
         * Email de contato.
         */
        email?: string;

        /**
         * Homepage do autor.
         */
        url?: string;
      };

  /**
   * Forma de financiamento e apoio ao projeto.
   */
  funding?:
    | string
    | {
        /**
         * Tipo de financiamento.
         */
        type?: string;

        /**
         * Homepage.
         */
        url?: string;
      };

  /**
   * Arquivos incluídos no pacote.
   */
  files?: string | string[];

  /**
   * Módulo principal do pacote.
   */
  main?: string;

  /**
   * O mesmo que main, mas destinado a pacotes usados em navegadores.
   */
  browser?: string;

  /**
   * Arquivo para execução do pacote como aplicativo.
   */
  bin?: string;

  /**
   * Arquivos de documentação.
   */
  man?: string | string[];

  /**
   * Localização de diretórios
   */
  directories?: Record<string, string>;

  /**
   * Repositório do código-fonte
   */
  repository?:
    | string
    | {
        /**
         * Tipo.
         */
        type?: string;

        /**
         * Endereço.
         */
        url?: string;
      };

  /**
   * Scripts NPM
   */
  scripts?: Record<string, string>;

  /**
   * Configurações acessíveis pelos scripts como `npm_package_config_KEY`
   */
  config?: Record<string, string>;

  /**
   * Dependências de pacotes. Nome e versão.
   */
  dependencies?: Record<string, string>;

  /**
   * Pacotes opcionais. Nome e versão.
   */
  optionalDependencies?: Record<string, string>;

  /**
   * Dependências de pacotes durante o desenvolvimento. Nome e versão.
   */
  devDependencies?: Record<string, string>;

  /**
   * Pacotes com os quais este pacote é compatível. Nome e versão.
   */
  peerDependencies?: Record<string, string>;

  /**
   * Avisos referentes a peerDependencies
   */
  peerDependenciesMeta?: Record<string, Record<string, unknown>>;

  /**
   * Pacotes que serão agrupados ao publicar o pacote.
   */
  bundledDependencies?: string[];

  /**
   * Versão do Node a ser usado.
   */
  engines?: Record<string, string>;

  /**
   * Sistemas operacionais compatíveis.
   */
  os?: string[];

  /**
   * CPU compatíveis.
   */
  cpu?: string[];

  /**
   * Evita que op `npm publish` funcione.
   */
  private?: boolean;

  /**
   * Conjunto de valores de configuração que serão usados no momento da publicação.
   */
  publishConfig?: string;

  /**
   * Outras pastas de trabalho semelhantes a `node_modules`.
   */
  workspaces?: string[];
}
