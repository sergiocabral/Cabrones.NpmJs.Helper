import { NotImplementedError } from '../Error/NotImplementedError';
import { HelperObject } from '../Data/HelperObject';
import { PrimitiveValueTypeName } from '../Type/PrimitiveValueTypeName';
import { EmptyError } from '../Error/EmptyError';
import { HelperList } from '../Data/HelperList';

/**
 * Conjunto de informações de configuração.
 */
export abstract class JsonLoader {
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
          (backup[key] instanceof Date || backup[key] instanceof JsonLoader)
        ) {
          const constructor = (backup[key] as JsonLoader).constructor as new (
            argument: unknown
          ) => unknown;
          instance[key] = new constructor(instance[key]);
          if (instance[key] instanceof JsonLoader) {
            (instance[key] as JsonLoader).initialize();
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
      if (instance[key] instanceof JsonLoader) {
        errors.push(...(instance[key] as JsonLoader).errors());
      }
    }
    return errors;
  }

  /**
   * Valida e retorna erro se não atender: deve ser do tipo especificado ou vazio.
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   * @param typeName Tipo esperado do valor presente no campo.
   * @param canBeNotInformed Aceita que o campo não seja informado com null ou undefined.
   */
  public static mustBeOfType<TJson extends JsonLoader>(
    instance: JsonLoader,
    fieldName: keyof TJson,
    typeName: PrimitiveValueTypeName | 'object',
    canBeNotInformed: boolean
  ): string[] {
    const errors = Array<string>();
    const value = HelperObject.getProperty(instance, fieldName);
    const isValid =
      typeof value === typeName ||
      (canBeNotInformed && (value === undefined || value === null));
    if (!isValid) {
      const validTypes: string[] = [typeName];
      if (canBeNotInformed) {
        validTypes.push(String(null), String(undefined));
      }
      errors.push(
        `${instance.constructor.name}.${String(
          fieldName
        )} must be a ${validTypes.join(
          ' or '
        )}, but found: ${typeof value}, ${String(value)}`
      );
    }

    return errors;
  }

  /**
   * Valida e retorna erro se não atender: deve ser uma lista (array) de determinado tipo.
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   * @param typeName Tipos esperados nos valores presentes na lista.
   * @param canBeNotInformed Aceita que o campo não seja informado com null ou undefined.
   */
  public static mustBeList<TJson extends JsonLoader>(
    instance: JsonLoader,
    fieldName: keyof TJson,
    typeName:
      | PrimitiveValueTypeName
      | 'object'
      | 'any'
      | Array<PrimitiveValueTypeName | 'object'>,
    canBeNotInformed: boolean
  ): string[] {
    const errors = Array<string>();
    const value = HelperObject.getProperty(instance, fieldName);

    const acceptAnyType = typeName === 'any';
    const typesNames = acceptAnyType
      ? ['any']
      : Array.isArray(typeName)
      ? (typeName as string[])
      : [typeName];

    const isValid =
      (Array.isArray(value) &&
        (acceptAnyType ||
          value.indexOf((item: unknown) => !typesNames.includes(typeof item)) <
            0)) ||
      (canBeNotInformed && (value === undefined || value === null));

    if (!isValid) {
      let canBeNotInformedDescription = '';
      if (canBeNotInformed) {
        typesNames.push(String(null), String(undefined));
        canBeNotInformedDescription = `, or an unspecified list with ${String(
          null
        )} or ${String(undefined)}`;
      }

      errors.push(
        `${instance.constructor.name}.${String(
          fieldName
        )} must be a array of items of type ${typesNames.join(
          ' or '
        )}${canBeNotInformedDescription}, but found: ${typeof value}, ${String(
          value
        )}`
      );
    }

    return errors;
  }

  /**
   * Valida e retorna erro se não atender: deve ser uma lista (array) de itens presentes em um conjunto.
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   * @param validValues Valores válidos para a lista.
   * @param verification Modo de verificação == ou ===
   * @param canBeNotInformed Aceita que o campo não seja informado com null ou undefined.
   */
  public static mustBeListOfTheSet<TJson extends JsonLoader>(
    instance: JsonLoader,
    fieldName: keyof TJson,
    validValues: unknown[],
    verification: 'only value' | 'value and type',
    canBeNotInformed: boolean
  ): string[] {
    const errors = Array<string>();
    const value = HelperObject.getProperty(instance, fieldName);

    const isValid =
      (Array.isArray(value) &&
        value.filter(
          (item: unknown) =>
            validValues.filter(
              validValue =>
                (verification === 'only value' && validValue == item) ||
                (verification === 'value and type' && validValue === item)
            ).length === validValues.length
        ).length === value.length) ||
      (canBeNotInformed && (value === null || value === undefined));

    if (!isValid) {
      const validTypes = HelperList.unique(
        validValues.map(validValue => `"${String(validValue)}"`)
      );

      let canBeNotInformedDescription = '';
      if (canBeNotInformed) {
        validTypes.push(String(null), String(undefined));
        canBeNotInformedDescription = `, or an unspecified list with ${String(
          null
        )} or ${String(undefined)}`;
      }

      errors.push(
        `${instance.constructor.name}.${String(
          fieldName
        )} must be a array with items being ${validTypes.join(
          ' or '
        )}${canBeNotInformedDescription}, but found: ${typeof value}, ${String(
          value
        )}`
      );
    }

    return errors;
  }

  /**
   * Valida e retorna erro se não atender: deve estar presente na lista.
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   * @param validValues Valores válidos para a lista.
   * @param verification Modo de verificação == ou ===
   * @param canBeNotInformed Aceita que o campo não seja informado com null ou undefined.
   */
  public static mustBeInTheSet(
    instance: JsonLoader,
    fieldName: string,
    validValues: unknown[],
    verification: 'only value' | 'value and type',
    canBeNotInformed: boolean
  ): string[] {
    const errors = Array<string>();
    const value = HelperObject.getProperty(instance, fieldName);

    const isValid =
      canBeNotInformed && (value === null || value === undefined)
        ? true
        : validValues.indexOf(
            (validValue: unknown) =>
              (verification === 'only value' && validValue == value) ||
              (verification === 'value and type' && validValue === value)
          ) >= 0;

    if (!isValid) {
      const validTypes = HelperList.unique(
        validValues.map(validValue => `"${String(validValue)}"`)
      );
      if (canBeNotInformed) {
        if (validValues.indexOf(null) < 0) {
          validTypes.push(String(null));
        }
        if (validValues.indexOf(undefined) < 0) {
          validTypes.push(String(undefined));
        }
      }

      errors.push(
        `${instance.constructor.name}.${fieldName} must be ${validTypes.join(
          ' or '
        )}, but found: ${typeof value}, ${String(value)}`
      );
    }

    return errors;
  }

  /**
   * Valida e retorna erro se não atender: deve ser um número dentro do range.
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   * @param range Valor mínimo e máximo.
   * @param rangeInclusive Sinaliza se o valor na posição do range é inclusivo (ex: maior igual) ou exclusivo (ex: maior) na verificação.
   * @param type Tipo numérico inteiro ou decimal
   * @param canBeNotInformed Aceita que o campo não seja informado com null ou undefined.
   */
  public static mustBeNumberInTheRange(
    instance: JsonLoader,
    fieldName: string,
    range: [number | undefined, number | undefined],
    rangeInclusive: [boolean, boolean],
    type: 'integer' | 'decimal',
    canBeNotInformed: boolean
  ): string[] {
    const errors = Array<string>();
    const value = HelperObject.getProperty(instance, fieldName);
    const minValue = range[0];
    const maxValue = range[1];

    if (minValue === undefined && maxValue === undefined) {
      throw new EmptyError('minValue or maxValue must have a value.');
    }

    const isValidType =
      !canBeNotInformed && (value === null || value === undefined)
        ? false
        : typeof value !== 'number'
        ? false
        : type === 'decimal'
        ? true
        : (minValue === undefined || value === Math.floor(minValue)) &&
          (maxValue === undefined || value === Math.floor(maxValue));

    const validTypes: string[] = [`${type} number`];
    if (canBeNotInformed) {
      validTypes.push(String(null), String(undefined));
    }

    if (!isValidType) {
      errors.push(
        `${instance.constructor.name}.${String(
          fieldName
        )} must be a ${validTypes.join(
          ' or '
        )}, but found: ${typeof value}, ${String(value)}`
      );
    } else if (value !== undefined) {
      const valueAsNumber = value as number;

      const isValidRange1 =
        minValue === undefined ||
        (rangeInclusive[0]
          ? valueAsNumber <= minValue
          : valueAsNumber < minValue);

      const isValidRange2 =
        maxValue === undefined ||
        (rangeInclusive[1]
          ? valueAsNumber >= maxValue
          : valueAsNumber > maxValue);

      if (!isValidRange1 || !isValidRange2) {
        const violation = Array<string>();
        if (!isValidRange1) {
          violation.push(
            `${
              rangeInclusive[0] ? 'greater than or equal' : 'greater than'
            } ${minValue}`
          );
        } else if (!isValidRange2) {
          violation.push(
            `${
              rangeInclusive[1] ? 'less than or equal' : 'less than'
            } ${maxValue}`
          );
        }

        errors.push(
          `${instance.constructor.name}.${fieldName} must be ${violation.join(
            ' and '
          )}, but found: ${typeof value}, ${String(value)}`
        );
      }
    }

    return errors;
  }

  /**
   * Valida e retorna erro se não atender: deve atender uma expressão regular.
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   * @param regex Expressão regular que valida o valor
   * @param canBeNotInformed Aceita que o campo não seja informado com null ou undefined.
   * @param regexDescription Descrição da regex que será embutida na mensagem.
   */
  public static mustMatchRegex(
    instance: JsonLoader,
    fieldName: string,
    regex: RegExp,
    canBeNotInformed: boolean,
    regexDescription?: string
  ): string[] {
    const errors = Array<string>();
    const value = HelperObject.getProperty(instance, fieldName);

    if (regexDescription === undefined) {
      regexDescription = `format for the regex ${regex.toString()}`;
    }

    const isValid =
      (canBeNotInformed && (value === null || value === undefined)) ||
      regex.test(String(value));

    if (!isValid) {
      errors.push(
        `${
          instance.constructor.name
        }.${fieldName} must be a valid ${regexDescription}, but found: ${typeof value}, ${String(
          value
        )}`
      );
    }

    return errors;
  }

  /**
   * Valida e retorna erro se não atender: deve ser boolean
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   */
  public static mustBeBoolean<TJson extends JsonLoader>(
    instance: JsonLoader,
    fieldName: keyof TJson
  ): string[] {
    return JsonLoader.mustBeOfType(instance, fieldName, 'boolean', false);
  }

  /**
   * Valida e retorna erro se não atender: deve ser boolean ou não informado
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   */
  public static mustBeBooleanOrNotInformed<TJson extends JsonLoader>(
    instance: JsonLoader,
    fieldName: keyof TJson
  ): string[] {
    return JsonLoader.mustBeOfType(instance, fieldName, 'boolean', true);
  }

  /**
   * Valida e retorna erro se não atender: deve ser string
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   */
  public static mustBeString<TJson extends JsonLoader>(
    instance: JsonLoader,
    fieldName: keyof TJson
  ): string[] {
    return JsonLoader.mustBeOfType(instance, fieldName, 'string', false);
  }

  /**
   * Valida e retorna erro se não atender: deve ser string ou não informado
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   */
  public static mustBeStringOrNotInformed<TJson extends JsonLoader>(
    instance: JsonLoader,
    fieldName: keyof TJson
  ): string[] {
    return JsonLoader.mustBeOfType(instance, fieldName, 'string', true);
  }

  /**
   * Valida e retorna erro se não atender: deve ser number
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   */
  public static mustBeNumber<TJson extends JsonLoader>(
    instance: JsonLoader,
    fieldName: keyof TJson
  ): string[] {
    return JsonLoader.mustBeOfType(instance, fieldName, 'number', false);
  }

  /**
   * Valida e retorna erro se não atender: deve ser number ou não informado
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   */
  public static mustBeNumberOrNotInformed<TJson extends JsonLoader>(
    instance: JsonLoader,
    fieldName: keyof TJson
  ): string[] {
    return JsonLoader.mustBeOfType(instance, fieldName, 'number', true);
  }

  /**
   * Valida e retorna erro se não atender: deve ser uma lista (array) de any
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   */
  public static mustBeListOfAny<TJson extends JsonLoader>(
    instance: JsonLoader,
    fieldName: keyof TJson
  ): string[] {
    return JsonLoader.mustBeList(instance, fieldName, 'any', false);
  }

  /**
   * Valida e retorna erro se não atender: deve ser uma lista (array) de boolean
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   */
  public static mustBeListOfBoolean<TJson extends JsonLoader>(
    instance: JsonLoader,
    fieldName: keyof TJson
  ): string[] {
    return JsonLoader.mustBeList(instance, fieldName, 'boolean', false);
  }

  /**
   * Valida e retorna erro se não atender: deve ser uma lista (array) de string
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   */
  public static mustBeListOfString<TJson extends JsonLoader>(
    instance: JsonLoader,
    fieldName: keyof TJson
  ): string[] {
    return JsonLoader.mustBeList(instance, fieldName, 'string', false);
  }

  /**
   * Valida e retorna erro se não atender: deve ser uma lista (array) de number
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   */
  public static mustBeListOfNumber<TJson extends JsonLoader>(
    instance: JsonLoader,
    fieldName: keyof TJson
  ): string[] {
    return JsonLoader.mustBeList(instance, fieldName, 'number', false);
  }

  /**
   * Valida e retorna erro se não atender: deve ser uma lista (array) de any ou vazio
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   */
  public static mustBeListOfAnyOrNotInformed<TJson extends JsonLoader>(
    instance: JsonLoader,
    fieldName: keyof TJson
  ): string[] {
    return JsonLoader.mustBeList(instance, fieldName, 'any', true);
  }

  /**
   * Valida e retorna erro se não atender: deve ser uma lista (array) de boolean ou vazio
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   */
  public static mustBeListOfBooleanOrNotInformed<TJson extends JsonLoader>(
    instance: JsonLoader,
    fieldName: keyof TJson
  ): string[] {
    return JsonLoader.mustBeList(instance, fieldName, 'boolean', true);
  }

  /**
   * Valida e retorna erro se não atender: deve ser uma lista (array) de string ou vazio
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   */
  public static mustBeListOfStringOrNotInformed<TJson extends JsonLoader>(
    instance: JsonLoader,
    fieldName: keyof TJson
  ): string[] {
    return JsonLoader.mustBeList(instance, fieldName, 'string', true);
  }

  /**
   * Valida e retorna erro se não atender: deve ser uma lista (array) de number ou vazio
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   */
  public static mustBeListOfNumberOrNotInformed<TJson extends JsonLoader>(
    instance: JsonLoader,
    fieldName: keyof TJson
  ): string[] {
    return JsonLoader.mustBeList(instance, fieldName, 'number', true);
  }

  /**
   * Valida e retorna erro se não atender: deve ser um número entre dois limites
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   * @param minValue Valor mínimo inclusivo.
   * @param maxValue Valor máximo exclusivo.
   */
  public static mustBeNumberBeetwen(
    instance: JsonLoader,
    fieldName: string,
    minValue: number,
    maxValue: number
  ): string[] {
    return JsonLoader.mustBeNumberInTheRange(
      instance,
      fieldName,
      [minValue, maxValue],
      [true, true],
      'decimal',
      false
    );
  }

  /**
   * Valida e retorna erro se não atender: deve ser um número menor que um limit
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   * @param limit Range limit.
   */
  public static mustBeNumberLessThan(
    instance: JsonLoader,
    fieldName: string,
    limit: number
  ): string[] {
    return JsonLoader.mustBeNumberInTheRange(
      instance,
      fieldName,
      [undefined, limit],
      [false, false],
      'decimal',
      false
    );
  }

  /**
   * Valida e retorna erro se não atender: deve ser um número menor ou igual a um limite.
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   * @param limit Range limite.
   */
  public static mustBeNumberLessThanOrEqual(
    instance: JsonLoader,
    fieldName: string,
    limit: number
  ): string[] {
    return JsonLoader.mustBeNumberInTheRange(
      instance,
      fieldName,
      [undefined, limit],
      [true, true],
      'decimal',
      false
    );
  }

  /**
   * Valida e retorna erro se não atender: deve ser um inteiro entre dois limites
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   * @param minValue Valor mínimo inclusivo.
   * @param maxValue Valor máximo exclusivo.
   */
  public static mustBeIntegerBeetwen(
    instance: JsonLoader,
    fieldName: string,
    minValue: number,
    maxValue: number
  ): string[] {
    return JsonLoader.mustBeNumberInTheRange(
      instance,
      fieldName,
      [minValue, maxValue],
      [true, true],
      'integer',
      false
    );
  }

  /**
   * Valida e retorna erro se não atender: deve ser um inteiro menor que um limite.
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   * @param limit Range limite.
   */
  public static mustBeIntegerLessThan(
    instance: JsonLoader,
    fieldName: string,
    limit: number
  ): string[] {
    return JsonLoader.mustBeNumberInTheRange(
      instance,
      fieldName,
      [undefined, limit],
      [false, false],
      'integer',
      false
    );
  }

  /**
   * Valida e retorna erro se não atender: deve ser um inteiro menor ou igual a um limite.
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   * @param limit Range limite.
   */
  public static mustBeIntegerLessThanOrEqual(
    instance: JsonLoader,
    fieldName: string,
    limit: number
  ): string[] {
    return JsonLoader.mustBeNumberInTheRange(
      instance,
      fieldName,
      [undefined, limit],
      [true, true],
      'integer',
      false
    );
  }

  /**
   * Valida e retorna erro se não atender: deve ser um número maior que um limite.
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   * @param limit Range limit.
   */
  public static mustBeNumberGreaterThan(
    instance: JsonLoader,
    fieldName: string,
    limit: number
  ): string[] {
    return JsonLoader.mustBeNumberInTheRange(
      instance,
      fieldName,
      [limit, undefined],
      [false, false],
      'decimal',
      false
    );
  }

  /**
   * Valida e retorna erro se não atender: deve ser um número maior ou igual a um limite.
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   * @param limit Range limite.
   */
  public static mustBeNumberGreaterThanOrEqual(
    instance: JsonLoader,
    fieldName: string,
    limit: number
  ): string[] {
    return JsonLoader.mustBeNumberInTheRange(
      instance,
      fieldName,
      [limit, undefined],
      [true, true],
      'decimal',
      false
    );
  }

  /**
   * Valida e retorna erro se não atender: deve ser um inteiro maior que um limite.
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   * @param limit Range limite.
   */
  public static mustBeIntegerGreaterThan(
    instance: JsonLoader,
    fieldName: string,
    limit: number
  ): string[] {
    return JsonLoader.mustBeNumberInTheRange(
      instance,
      fieldName,
      [limit, undefined],
      [false, false],
      'integer',
      false
    );
  }

  /**
   * Valida e retorna erro se não atender: deve ser um inteiro maior ou igual a um limite.
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   * @param limit Range limite.
   */
  public static mustBeIntegerGreaterThanOrEqual(
    instance: JsonLoader,
    fieldName: string,
    limit: number
  ): string[] {
    return JsonLoader.mustBeNumberInTheRange(
      instance,
      fieldName,
      [limit, undefined],
      [true, true],
      'integer',
      false
    );
  }

  /**
   * Valida e retorna erro se não atender: deve ser um número entre dois limites
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   * @param minValue Valor mínimo inclusivo.
   * @param maxValue Valor máximo exclusivo.
   */
  public static mustBeNumberBeetwenOrNotInformed(
    instance: JsonLoader,
    fieldName: string,
    minValue: number,
    maxValue: number
  ): string[] {
    return JsonLoader.mustBeNumberInTheRange(
      instance,
      fieldName,
      [minValue, maxValue],
      [true, true],
      'decimal',
      true
    );
  }

  /**
   * Valida e retorna erro se não atender: deve ser um número menor que um limit
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   * @param limit Range limit.
   */
  public static mustBeNumberLessThanOrNotInformed(
    instance: JsonLoader,
    fieldName: string,
    limit: number
  ): string[] {
    return JsonLoader.mustBeNumberInTheRange(
      instance,
      fieldName,
      [undefined, limit],
      [false, false],
      'decimal',
      true
    );
  }

  /**
   * Valida e retorna erro se não atender: deve ser um número menor ou igual a um limite.
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   * @param limit Range limite.
   */
  public static mustBeNumberLessThanOrEqualOrNotInformed(
    instance: JsonLoader,
    fieldName: string,
    limit: number
  ): string[] {
    return JsonLoader.mustBeNumberInTheRange(
      instance,
      fieldName,
      [undefined, limit],
      [true, true],
      'decimal',
      true
    );
  }

  /**
   * Valida e retorna erro se não atender: deve ser um inteiro entre dois limites
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   * @param minValue Valor mínimo inclusivo.
   * @param maxValue Valor máximo exclusivo.
   */
  public static mustBeIntegerBeetwenOrNotInformed(
    instance: JsonLoader,
    fieldName: string,
    minValue: number,
    maxValue: number
  ): string[] {
    return JsonLoader.mustBeNumberInTheRange(
      instance,
      fieldName,
      [minValue, maxValue],
      [true, true],
      'integer',
      true
    );
  }

  /**
   * Valida e retorna erro se não atender: deve ser um inteiro menor que um limite.
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   * @param limit Range limite.
   */
  public static mustBeIntegerLessThanOrNotInformed(
    instance: JsonLoader,
    fieldName: string,
    limit: number
  ): string[] {
    return JsonLoader.mustBeNumberInTheRange(
      instance,
      fieldName,
      [undefined, limit],
      [false, false],
      'integer',
      true
    );
  }

  /**
   * Valida e retorna erro se não atender: deve ser um inteiro menor ou igual a um limite.
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   * @param limit Range limite.
   */
  public static mustBeIntegerLessThanOrEqualOrNotInformed(
    instance: JsonLoader,
    fieldName: string,
    limit: number
  ): string[] {
    return JsonLoader.mustBeNumberInTheRange(
      instance,
      fieldName,
      [undefined, limit],
      [true, true],
      'integer',
      true
    );
  }

  /**
   * Valida e retorna erro se não atender: deve ser um número maior que um limite.
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   * @param limit Range limit.
   */
  public static mustBeNumberGreaterThanOrNotInformed(
    instance: JsonLoader,
    fieldName: string,
    limit: number
  ): string[] {
    return JsonLoader.mustBeNumberInTheRange(
      instance,
      fieldName,
      [limit, undefined],
      [false, false],
      'decimal',
      true
    );
  }

  /**
   * Valida e retorna erro se não atender: deve ser um número maior ou igual a um limite.
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   * @param limit Range limite.
   */
  public static mustBeNumberGreaterThanOrEqualOrNotInformed(
    instance: JsonLoader,
    fieldName: string,
    limit: number
  ): string[] {
    return JsonLoader.mustBeNumberInTheRange(
      instance,
      fieldName,
      [limit, undefined],
      [true, true],
      'decimal',
      true
    );
  }

  /**
   * Valida e retorna erro se não atender: deve ser um inteiro maior que um limite.
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   * @param limit Range limite.
   */
  public static mustBeIntegerGreaterThanOrNotInformed(
    instance: JsonLoader,
    fieldName: string,
    limit: number
  ): string[] {
    return JsonLoader.mustBeNumberInTheRange(
      instance,
      fieldName,
      [limit, undefined],
      [false, false],
      'integer',
      true
    );
  }

  /**
   * Valida e retorna erro se não atender: deve ser um inteiro maior ou igual a um limite.
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   * @param limit Range limite.
   */
  public static mustBeIntegerGreaterThanOrEqualOrNotInformed(
    instance: JsonLoader,
    fieldName: string,
    limit: number
  ): string[] {
    return JsonLoader.mustBeNumberInTheRange(
      instance,
      fieldName,
      [limit, undefined],
      [true, true],
      'integer',
      true
    );
  }

  /**
   * Valida e retorna erro se não atender: deve ser um UUID válido.
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   */
  public static mustBeUuid(instance: JsonLoader, fieldName: string): string[] {
    return JsonLoader.mustMatchRegex(
      instance,
      fieldName,
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      false,
      'UUID'
    );
  }

  /**
   * Valida e retorna erro se não atender: deve ser um UUID válido.
   * @param instance Instância do JSON
   * @param fieldName Nome do campo.
   */
  public static mustBeUuidOrNotInformed(
    instance: JsonLoader,
    fieldName: string
  ): string[] {
    return JsonLoader.mustMatchRegex(
      instance,
      fieldName,
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      true,
      'UUID'
    );
  }
}
