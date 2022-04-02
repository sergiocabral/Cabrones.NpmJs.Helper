import { InvalidExecutionError } from '../../Error/InvalidExecutionError';
import fs from 'fs';
import { IPackageJson } from './IPackageJson';
import { KeyValue } from '../../Type/KeyValue';
import { HelperFileSystem } from '../HelperFileSystem';
import path from 'path';

/**
 * Utilitário relacionado ao ambiente NodeJS
 */
export class HelperNodeJs {
  /**
   * Construtor proibido.
   */
  public constructor() {
    throw new InvalidExecutionError('This is a static class.');
  }

  /**
   * Nome do arquivo package.json.
   * @private
   */
  private static packageJsonFilename = 'package.json';

  /**
   * Obtem o JSON do arquivo.
   */
  private static getPackageJson(file: string): IPackageJson | undefined {
    try {
      const fileContent = fs.readFileSync(file).toString();
      return JSON.parse(fileContent) as IPackageJson;
    } catch (error) {
      return undefined;
    }
  }
  /**
   * Converte e filtra uma lista de arquivos para JSONs válidos.
   */
  private static filterValidPackageJson(
    files: string[]
  ): KeyValue<IPackageJson>[] {
    return files
      .map<KeyValue<IPackageJson | undefined>>(file => ({
        Key: file,
        Value: HelperNodeJs.getPackageJson(file)
      }))
      .filter(data => data.Value !== undefined) as KeyValue<IPackageJson>[];
  }

  /**
   * Lista de todos os package.json nas pastas anteriores.
   */
  public static getAllPreviousPackagesFiles(directory?: string): string[] {
    directory = directory ?? path.dirname(__filename);
    return HelperFileSystem.findFilesOut(
      directory,
      HelperNodeJs.packageJsonFilename
    );
  }

  /**
   * Lista de todos os package.json nas pastas posteriores.
   */
  public static getAllPackagesFiles(directory: string): string[] {
    return HelperFileSystem.findFilesInto(
      directory,
      HelperNodeJs.packageJsonFilename
    );
  }

  /**
   * Lista de todos os package.json como JSON válido nas pastas anteriores.
   */
  public static getAllPreviousPackagesJson(
    directory?: string
  ): KeyValue<IPackageJson>[] {
    return HelperNodeJs.filterValidPackageJson(
      HelperNodeJs.getAllPreviousPackagesFiles(directory)
    );
  }

  /**
   * Lista de todos os package.json como JSON válido nas pastas posteriores.
   */
  public static getAllPackagesJson(
    directory: string
  ): KeyValue<IPackageJson>[] {
    return HelperNodeJs.filterValidPackageJson(
      HelperNodeJs.getAllPackagesFiles(directory)
    );
  }
}
