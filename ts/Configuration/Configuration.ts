import { NotImplementedError } from '../Error/NotImplementedError';

/**
 * Conjunto de informações de configuração.
 */
export abstract class Configuration {
  /**
   * Carrega as propriedades do JSON.
   */
  public initialize: () => this;

  /**
   * Construtor.
   * @param json Dados de configuração como JSON
   */
  public constructor(json?: unknown) {
    let initialized = json === undefined;

    if (!initialized) {
      setImmediate(() => {
        if (!initialized) {
          throw new NotImplementedError(
            `${this.constructor.name} did not call initialize().`
          );
        }
      });
    }

    this.initialize = () => {
      if (initialized) {
        return this;
      }
      initialized = true;

      const backup = Object.assign({}, this) as Record<string, unknown>;

      Object.assign(
        this,
        typeof json === 'object' && json !== null ? json : {}
      );

      const instance = this as Record<string, unknown>;
      for (const key of Object.keys(backup)) {
        if (
          backup[key] !== instance[key] &&
          (backup[key] instanceof Date || backup[key] instanceof Configuration)
        ) {
          const constructor = (backup[key] as Configuration)
            .constructor as new (argument: unknown) => unknown;
          instance[key] = new constructor(instance[key]);
          if (instance[key] instanceof Configuration) {
            (instance[key] as Configuration).initialize();
          }
        }
      }

      return this;
    };
  }

  /**
   * Lista de erros presentes na configuração atual
   */
  public errors(): string[] {
    const errors = Array<string>();
    const instance = this as Record<string, unknown>;
    for (const key of Object.keys(instance)) {
      if (instance[key] instanceof Configuration) {
        errors.push(...(instance[key] as Configuration).errors());
      }
    }
    return errors;
  }
}
