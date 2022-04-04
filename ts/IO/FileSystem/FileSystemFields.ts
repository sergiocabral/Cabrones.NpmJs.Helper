import { IFileSystemFields } from './IFileSystemFields';
import fs from 'fs';

/**
 * Campos usados no monitoramento de objetos de disco.
 */
export class FileSystemFields implements Partial<IFileSystemFields> {
  /**
   * Construtor.
   * @param path Caminho.
   */
  public constructor(public readonly path?: string) {
    if (path !== undefined) {
      this.exists = fs.existsSync(path);
    }
  }

  /**
   * Sinaliza existência.
   */
  public readonly exists: boolean | undefined = undefined;

  /**
   * Retorna a lista de campos que estão diferentes.
   */
  public diff(other: Partial<IFileSystemFields> | undefined): string[] {
    return FileSystemFields.diff(this, other);
  }

  /**
   * Retorna a lista de campos que estão diferentes.
   */
  public static diff(
    fields1: Partial<IFileSystemFields> | undefined,
    fields2: Partial<IFileSystemFields> | undefined
  ): string[] {
    if (fields1 === fields2) {
      return [];
    } else if (fields1 === undefined || fields2 === undefined) {
      return Object.keys(new FileSystemFields());
    }

    const defaultInstance = new FileSystemFields();
    const left: Record<string, unknown> = fields1 as Record<
      keyof FileSystemFields,
      unknown
    >;
    const right: Record<string, unknown> = fields2 as Record<
      keyof FileSystemFields,
      unknown
    >;

    const fields = Array<string>();
    for (const fieldName of Object.keys(defaultInstance)) {
      if (left[fieldName] !== right[fieldName]) {
        fields.push(fieldName);
      }
    }
    return fields;
  }

  /**
   * Verifica se dois conjuntos de campos de monitoramento são iguais.
   */
  public isEquals(other: Partial<IFileSystemFields> | undefined): boolean {
    return FileSystemFields.isEquals(this, other);
  }

  /**
   * Verifica se dois conjuntos de campos de monitoramento são iguais.
   */
  public static isEquals(
    fields1: Partial<IFileSystemFields> | undefined,
    fields2: Partial<IFileSystemFields> | undefined
  ): boolean {
    return FileSystemFields.diff(fields1, fields2).length === 0;
  }
}
