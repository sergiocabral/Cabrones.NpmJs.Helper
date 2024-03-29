// noinspection JSUnusedLocalSymbols

import {
  EmptyError,
  HelperDate,
  HelperList,
  InvalidArgumentError,
  JsonLoader,
  NotImplementedError,
  PrimitiveValueTypeName
} from '../../ts';

const propertyDefaultValueNumber = Math.random();
const propertyDefaultValueDate = new Date();
const propertyDefaultValueString = Math.random().toString();
const errorConfigurationTestB = [Math.random().toString()];
const nameForConfigurationForNameB = Math.random().toString();
const nameForConfigurationForNameB2 = Math.random().toString();

class ConfigurationTestC extends JsonLoader {}

class ConfigurationTestB extends JsonLoader {
  propertyString = propertyDefaultValueString;
  errors(): string[] {
    return errorConfigurationTestB;
  }
}

class ConfigurationTestA extends JsonLoader {
  propertyNumber = propertyDefaultValueNumber;
  propertyDate = propertyDefaultValueDate;
  propertyConfiguration = new ConfigurationTestB();
}

class ConfigurationForValidationTest extends JsonLoader {
  property: unknown = new Date();
}

class ConfigurationForNameA extends JsonLoader {
  property1: unknown = new Date();
  property2 = new ConfigurationForNameB().setName(
    nameForConfigurationForNameB,
    this
  );
  public override errors(): string[] {
    const errors = super.errors();
    errors.push(
      ...JsonLoader.mustBeBoolean<ConfigurationForNameA>(this, 'property1')
    );
    return errors;
  }
}
class ConfigurationForNameB extends JsonLoader {
  property3: unknown = null;
  public override errors(): string[] {
    const errors = super.errors();
    errors.push(
      ...JsonLoader.mustBeBoolean<ConfigurationForNameB>(this, 'property3')
    );
    return errors;
  }
}
class ConfigurationForNameD extends JsonLoader {
  property1: unknown = new Date();
  property2 = new ConfigurationForNameB().setName(
    nameForConfigurationForNameB2
  );
  public override errors(): string[] {
    const errors = super.errors();
    errors.push(
      ...JsonLoader.mustBeBoolean<ConfigurationForNameD>(this, 'property1')
    );
    return errors;
  }
}
class TestConfiguration<T> extends JsonLoader {
  property?: T;
}

describe('Class JsonLoader', () => {
  afterEach(() => jest.useRealTimers());

  test('Se criar sem informar JSON não precisa chamar initialize()', async () => {
    // Arrange, Given

    jest.useFakeTimers();

    // Act, When

    new ConfigurationTestA();

    // Assert, Then

    let error: Error | undefined;
    try {
      jest.advanceTimersByTime(1);
      error = undefined;
    } catch (e) {
      error = e as Error;
    }

    expect(error).not.toBeDefined();
  });

  test('Se não chamar initialize() após criar baseado em JSON deve falhar', async () => {
    // Arrange, Given

    jest.useFakeTimers();

    // Act, When

    new ConfigurationTestA({});

    // Assert, Then

    let error: Error | undefined;
    try {
      jest.advanceTimersByTime(1);
      error = undefined;
    } catch (e) {
      error = e as Error;
    }

    expect(error).toBeDefined();
    expect(error instanceof NotImplementedError).toBe(true);
  });

  test('Se chamar initialize() após criar baseado em JSON não deve falhar', async () => {
    // Arrange, Given

    jest.useFakeTimers();

    // Act, When

    new ConfigurationTestA({}).initialize();

    // Assert, Then

    let error: Error | undefined;
    try {
      jest.advanceTimersByTime(1);
      error = undefined;
    } catch (e) {
      error = e as Error;
    }

    expect(error).not.toBeDefined();
  });
  test('Deve usar propriedades com valores padrão se não informar json', () => {
    // Arrange, Given
    // Act, When

    const instance = new ConfigurationTestA().initialize();

    // Assert, Then

    expect(instance.propertyNumber).toBe(propertyDefaultValueNumber);
  });
  test('Deve poder inicializar valores das propriedades', () => {
    // Arrange, Given

    const propertyNewValue = Math.random();
    const json = {
      propertyNumber: propertyNewValue
    };

    // Act, When

    const instance = new ConfigurationTestA(json).initialize();

    // Assert, Then

    expect(instance.propertyNumber).not.toBe(propertyDefaultValueNumber);
    expect(instance.propertyNumber).toBe(propertyNewValue);
  });
  test('Chamar initialize() depois da primeira vez não deve surtir efeito', () => {
    // Arrange, Given

    const propertyNewValue1 = Math.random();
    const propertyNewValue2 = Math.random();

    const json = {
      propertyNumber: propertyNewValue1
    };

    // Act, When

    const instance = new ConfigurationTestA(json);
    const read1 = instance.propertyNumber;
    instance.initialize();
    const read2 = instance.propertyNumber;
    instance.propertyNumber = propertyNewValue2;
    instance.initialize();
    const read3 = instance.propertyNumber;

    // Assert, Then

    expect(read1).toBe(propertyDefaultValueNumber);
    expect(read2).toBe(propertyNewValue1);
    expect(read3).not.toBe(propertyNewValue1);
    expect(read3).toBe(propertyNewValue2);
  });
  test('Um JSON deve definir todas suas propriedades na instância', () => {
    // Arrange, Given

    const json = {
      valueNumber: Math.random(),
      valueString: Math.random().toString(),
      valueDate: new Date(),
      valueBoolean: Math.random() * 10 > 5
    };

    // Act, When

    const instance = new ConfigurationTestA(json).initialize() as any;

    // Assert, Then

    expect(instance.valueNumber).toBe(json.valueNumber);
    expect(instance.valueString).toBe(json.valueString);
    expect(instance.valueDate).toBe(json.valueDate);
    expect(instance.valueBoolean).toBe(json.valueBoolean);
  });
  test('Um JSON só sobrescreve propriedades que possui', () => {
    // Arrange, Given

    const json = {
      propertyNumber: Math.random()
    };

    // Act, When

    const instance = new ConfigurationTestA(json).initialize();

    // Assert, Then

    expect(instance.propertyNumber).toBe(json.propertyNumber);
    expect(instance.propertyDate).toBe(propertyDefaultValueDate);
  });
  test('Um tipo Date no JSON deve ser instanciado como tal', () => {
    // Arrange, Given

    const json = JSON.parse(
      JSON.stringify({
        propertyDate: new Date()
      })
    );

    // Act, When

    const instance = new ConfigurationTestA(json).initialize();

    // Assert, Then

    expect(instance.propertyDate instanceof Date).toBe(true);
    expect(instance.propertyDate.toISOString()).toBe(json.propertyDate);
  });
  test('Um tipo Configuration no JSON deve ser instanciado como tal', () => {
    // Arrange, Given

    const defaultValueString = Math.random().toString();
    const json = JSON.parse(
      JSON.stringify({
        propertyConfiguration: {
          propertyString: defaultValueString
        }
      })
    );

    // Act, When

    const instance = new ConfigurationTestA(json).initialize();

    // Assert, Then

    expect(instance.propertyConfiguration instanceof ConfigurationTestB).toBe(
      true
    );
    expect(instance.propertyConfiguration.propertyString).toBe(
      defaultValueString
    );
    expect(instance.propertyConfiguration.propertyString).not.toBe(
      propertyDefaultValueString
    );
    expect(instance.propertyConfiguration.errors()).toBe(
      errorConfigurationTestB
    );
  });
  test('Se for informado um tipo primitivo ao invés de JSON não deve surtir efeito', () => {
    // Arrange, Given

    const primitiveType = Math.random().toString();

    // Act, When

    const instance = new ConfigurationTestA(primitiveType);
    const snapshot1 = JSON.stringify(instance);
    instance.initialize();
    const snapshot2 = JSON.stringify(instance);

    // Assert, Then

    expect(snapshot1).toBe(snapshot2);
    expect(snapshot1).not.toContain(primitiveType);
    expect(snapshot2).not.toContain(primitiveType);
  });
  test('Se for informado null ao invés de JSON não deve surtir efeito', () => {
    // Arrange, Given
    // Act, When

    const instance = new ConfigurationTestA(null);
    const snapshot1 = JSON.stringify(instance);
    instance.initialize();
    const snapshot2 = JSON.stringify(instance);

    // Assert, Then

    expect(snapshot1).toBe(snapshot2);
    expect(snapshot1).not.toContain('null');
  });
  test('A lista de erros por padrão é vazia', () => {
    // Arrange, Given

    const instance = new ConfigurationTestC();

    // Act, When

    const errors = instance.errors();

    // Assert, Then

    expect(errors.length).toBe(0);
  });
  test('A lista de erros acumula erros de propriedades tipo Configuration', () => {
    // Arrange, Given

    const instance = new ConfigurationTestA();

    // Act, When

    const errors = instance.errors();

    // Assert, Then

    expect(errors).toEqual(errorConfigurationTestB);
    expect(errors).not.toBe(errorConfigurationTestB);
  });

  describe('Validadores mustBe...', () => {
    const originals: Record<string, any> = {};

    beforeEach(() => {
      originals['JsonLoader.mustBeOfType'] = JsonLoader.mustBeOfType;
      originals['JsonLoader.mustBeList'] = JsonLoader.mustBeList;
      originals['JsonLoader.mustBeListOfTheSet'] =
        JsonLoader.mustBeListOfTheSet;
      originals['JsonLoader.mustBeInTheSet'] = JsonLoader.mustBeInTheSet;
      originals['JsonLoader.mustBeNumberInTheRange'] =
        JsonLoader.mustBeNumberInTheRange;
      originals['JsonLoader.mustMatchRegex'] = JsonLoader.mustMatchRegex;
      originals['JsonLoader.mustBeValidFormat'] = JsonLoader.mustBeValidFormat;
    });

    afterEach(() => {
      JsonLoader.mustBeOfType = originals['JsonLoader.mustBeOfType'];
      JsonLoader.mustBeList = originals['JsonLoader.mustBeList'];
      JsonLoader.mustBeListOfTheSet =
        originals['JsonLoader.mustBeListOfTheSet'];
      JsonLoader.mustBeInTheSet = originals['JsonLoader.mustBeInTheSet'];
      JsonLoader.mustBeNumberInTheRange =
        originals['JsonLoader.mustBeNumberInTheRange'];
      JsonLoader.mustMatchRegex = originals['JsonLoader.mustMatchRegex'];
      JsonLoader.mustBeValidFormat = originals['JsonLoader.mustBeValidFormat'];
    });
    describe('Validadores bypass que chamam os validadore de fato', () => {
      test('mustBeBoolean chama mustBeOfType', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();

        const mockMustBe = jest.fn((arg1, arg2, arg3, arg4) => expectedResult);
        JsonLoader.mustBeOfType = mockMustBe;

        // Act, When

        const receivedResult = JsonLoader.mustBeBoolean<ConfigurationTestA>(
          instance,
          fieldName
        );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toBe('boolean');
        expect(mockMustBe.mock.calls[0][3]).toBe(false);
      });
      test('mustBeBooleanOrNotInformed chama mustBeOfType', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();

        const mockMustBe = jest.fn((arg1, arg2, arg3, arg4) => expectedResult);
        JsonLoader.mustBeOfType = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeBooleanOrNotInformed<ConfigurationTestA>(
            instance,
            fieldName
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toBe('boolean');
        expect(mockMustBe.mock.calls[0][3]).toBe(true);
      });
      test('mustBeString chama mustBeOfType', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();

        const mockMustBe = jest.fn((arg1, arg2, arg3, arg4) => expectedResult);
        JsonLoader.mustBeOfType = mockMustBe;

        // Act, When

        const receivedResult = JsonLoader.mustBeString<ConfigurationTestA>(
          instance,
          fieldName
        );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toBe('string');
        expect(mockMustBe.mock.calls[0][3]).toBe(false);
      });
      test('mustBeStringOrNotInformed chama mustBeOfType', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();

        const mockMustBe = jest.fn((arg1, arg2, arg3, arg4) => expectedResult);
        JsonLoader.mustBeOfType = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeStringOrNotInformed<ConfigurationTestA>(
            instance,
            fieldName
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toBe('string');
        expect(mockMustBe.mock.calls[0][3]).toBe(true);
      });
      test('mustBeStringWithContent chama mustBeOfType', () => {
        // Arrange, Given

        const instance = new ConfigurationTestB();
        instance.propertyString = '   ';
        const fieldName = 'propertyString';
        const expectedResult = Array<string>();

        const mockMustBe = jest.fn((arg1, arg2, arg3, arg4) => expectedResult);
        JsonLoader.mustBeOfType = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeStringWithContent<ConfigurationTestB>(
            instance,
            fieldName
          );

        // Assert, Then

        expect(receivedResult).toStrictEqual(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toBe('string');
        expect(mockMustBe.mock.calls[0][3]).toBe(false);
      });
      test('mustBeStringWithContentOrNotInformed chama mustBeOfType', () => {
        // Arrange, Given

        const instance = new ConfigurationTestB();
        instance.propertyString = '   ';
        const fieldName = 'propertyString';
        const expectedResult = Array<string>();

        const mockMustBe = jest.fn((arg1, arg2, arg3, arg4) => expectedResult);
        JsonLoader.mustBeOfType = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeStringWithContentOrNotInformed<ConfigurationTestB>(
            instance,
            fieldName
          );

        // Assert, Then

        expect(receivedResult).toStrictEqual(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toBe('string');
        expect(mockMustBe.mock.calls[0][3]).toBe(true);
      });
      test('mustBeStringWithContent deve incluir "with content" na mensagem', () => {
        // Arrange, Given

        const instance = new ConfigurationTestB();
        instance.propertyString = '   ';

        const fieldName = 'propertyString';
        const typeString = typeof '';
        const expected = `${ConfigurationTestB.name}.${String(
          fieldName
        )} must be a ${[typeString + ' with content'].join(
          ' or '
        )}, but found: (${typeString}) "${instance.propertyString}"`;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeStringWithContent<ConfigurationTestB>(
            instance,
            fieldName
          );

        // Assert, Then

        expect(receivedResult[0]).toBe(expected);
      });
      test('mustBeStringWithContentOrNotInformed deve incluir "with content" na mensagem', () => {
        // Arrange, Given

        const instance = new ConfigurationTestB();
        instance.propertyString = '   ';

        const fieldName = 'propertyString';
        const typeString = typeof '';
        const expected = `${ConfigurationTestB.name}.${String(
          fieldName
        )} must be a ${[
          typeString + ' with content',
          String(null),
          String(undefined)
        ].join(' or ')}, but found: (${typeString}) "${
          instance.propertyString
        }"`;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeStringWithContentOrNotInformed<ConfigurationTestB>(
            instance,
            fieldName
          );

        // Assert, Then

        expect(receivedResult[0]).toBe(expected);
      });
      test('mustBeNumber chama mustBeOfType', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();

        const mockMustBe = jest.fn((arg1, arg2, arg3, arg4) => expectedResult);
        JsonLoader.mustBeOfType = mockMustBe;

        // Act, When

        const receivedResult = JsonLoader.mustBeNumber<ConfigurationTestA>(
          instance,
          fieldName
        );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toBe('number');
        expect(mockMustBe.mock.calls[0][3]).toBe(false);
      });
      test('mustBeNumberOrNotInformed chama mustBeOfType', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();

        const mockMustBe = jest.fn((arg1, arg2, arg3, arg4) => expectedResult);
        JsonLoader.mustBeOfType = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeNumberOrNotInformed<ConfigurationTestA>(
            instance,
            fieldName
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toBe('number');
        expect(mockMustBe.mock.calls[0][3]).toBe(true);
      });
      test('mustBeInteger chama mustBeOfType', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();

        const mockMustBe = jest.fn((arg1, arg2, arg3, arg4) => expectedResult);
        JsonLoader.mustBeOfType = mockMustBe;

        // Act, When

        const receivedResult = JsonLoader.mustBeInteger<ConfigurationTestA>(
          instance,
          fieldName
        );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toBe('integer');
        expect(mockMustBe.mock.calls[0][3]).toBe(false);
      });
      test('mustBeIntegerOrNotInformed chama mustBeOfType', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();

        const mockMustBe = jest.fn((arg1, arg2, arg3, arg4) => expectedResult);
        JsonLoader.mustBeOfType = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeIntegerOrNotInformed<ConfigurationTestA>(
            instance,
            fieldName
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toBe('integer');
        expect(mockMustBe.mock.calls[0][3]).toBe(true);
      });
      test('mustBeListOfAny chama mustBeList', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();

        const mockMustBe = jest.fn((arg1, arg2, arg3, arg4) => expectedResult);
        JsonLoader.mustBeList = mockMustBe;

        // Act, When

        const receivedResult = JsonLoader.mustBeListOfAny<ConfigurationTestA>(
          instance,
          fieldName
        );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toBe('any');
        expect(mockMustBe.mock.calls[0][3]).toBe(false);
      });
      test('mustBeListOfAnyOrNotInformed chama mustBeList', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();

        const mockMustBe = jest.fn((arg1, arg2, arg3, arg4) => expectedResult);
        JsonLoader.mustBeList = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeListOfAnyOrNotInformed<ConfigurationTestA>(
            instance,
            fieldName
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toBe('any');
        expect(mockMustBe.mock.calls[0][3]).toBe(true);
      });
      test('mustBeListOfBoolean chama mustBeList', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();

        const mockMustBe = jest.fn((arg1, arg2, arg3, arg4) => expectedResult);
        JsonLoader.mustBeList = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeListOfBoolean<ConfigurationTestA>(
            instance,
            fieldName
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toBe('boolean');
        expect(mockMustBe.mock.calls[0][3]).toBe(false);
      });
      test('mustBeListOfBooleanOrNotInformed chama mustBeList', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();

        const mockMustBe = jest.fn((arg1, arg2, arg3, arg4) => expectedResult);
        JsonLoader.mustBeList = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeListOfBooleanOrNotInformed<ConfigurationTestA>(
            instance,
            fieldName
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toBe('boolean');
        expect(mockMustBe.mock.calls[0][3]).toBe(true);
      });
      test('mustBeListOfString chama mustBeList', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();

        const mockMustBe = jest.fn((arg1, arg2, arg3, arg4) => expectedResult);
        JsonLoader.mustBeList = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeListOfString<ConfigurationTestA>(
            instance,
            fieldName
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toBe('string');
        expect(mockMustBe.mock.calls[0][3]).toBe(false);
      });
      test('mustBeListOfStringOrNotInformed chama mustBeList', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();

        const mockMustBe = jest.fn((arg1, arg2, arg3, arg4) => expectedResult);
        JsonLoader.mustBeList = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeListOfStringOrNotInformed<ConfigurationTestA>(
            instance,
            fieldName
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toBe('string');
        expect(mockMustBe.mock.calls[0][3]).toBe(true);
      });
      test('mustBeListOfNumber chama mustBeList', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();

        const mockMustBe = jest.fn((arg1, arg2, arg3, arg4) => expectedResult);
        JsonLoader.mustBeList = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeListOfNumber<ConfigurationTestA>(
            instance,
            fieldName
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toBe('number');
        expect(mockMustBe.mock.calls[0][3]).toBe(false);
      });
      test('mustBeListOfNumberOrNotInformed chama mustBeList', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();

        const mockMustBe = jest.fn((arg1, arg2, arg3, arg4) => expectedResult);
        JsonLoader.mustBeList = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeListOfNumberOrNotInformed<ConfigurationTestA>(
            instance,
            fieldName
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toBe('number');
        expect(mockMustBe.mock.calls[0][3]).toBe(true);
      });
      test('mustBeNumberBeetwen chama mustBeNumberInTheRange', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();
        const minValue = Math.random();
        const maxValue = Math.random();

        const mockMustBe = jest.fn(
          (arg1, arg2, arg3, arg4, arg5, arg6) => expectedResult
        );
        JsonLoader.mustBeNumberInTheRange = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeNumberBeetwen<ConfigurationTestA>(
            instance,
            fieldName,
            minValue,
            maxValue
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toStrictEqual([minValue, maxValue]);
        expect(mockMustBe.mock.calls[0][3]).toStrictEqual([true, true]);
        expect(mockMustBe.mock.calls[0][4]).toBe('decimal');
        expect(mockMustBe.mock.calls[0][5]).toBe(false);
      });
      test('mustBeNumberBeetwenOrNotInformed chama mustBeNumberInTheRange', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();
        const minValue = Math.random();
        const maxValue = Math.random();

        const mockMustBe = jest.fn(
          (arg1, arg2, arg3, arg4, arg5, arg6) => expectedResult
        );
        JsonLoader.mustBeNumberInTheRange = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeNumberBeetwenOrNotInformed<ConfigurationTestA>(
            instance,
            fieldName,
            minValue,
            maxValue
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toStrictEqual([minValue, maxValue]);
        expect(mockMustBe.mock.calls[0][3]).toStrictEqual([true, true]);
        expect(mockMustBe.mock.calls[0][4]).toBe('decimal');
        expect(mockMustBe.mock.calls[0][5]).toBe(true);
      });
      test('mustBeNumberLessThan chama mustBeNumberInTheRange', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();
        const limit = Math.random();

        const mockMustBe = jest.fn(
          (arg1, arg2, arg3, arg4, arg5, arg6) => expectedResult
        );
        JsonLoader.mustBeNumberInTheRange = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeNumberLessThan<ConfigurationTestA>(
            instance,
            fieldName,
            limit
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toStrictEqual([undefined, limit]);
        expect(mockMustBe.mock.calls[0][3]).toStrictEqual([false, false]);
        expect(mockMustBe.mock.calls[0][4]).toBe('decimal');
        expect(mockMustBe.mock.calls[0][5]).toBe(false);
      });
      test('mustBeNumberLessThanOrNotInformed chama mustBeNumberInTheRange', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();
        const limit = Math.random();

        const mockMustBe = jest.fn(
          (arg1, arg2, arg3, arg4, arg5, arg6) => expectedResult
        );
        JsonLoader.mustBeNumberInTheRange = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeNumberLessThanOrNotInformed<ConfigurationTestA>(
            instance,
            fieldName,
            limit
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toStrictEqual([undefined, limit]);
        expect(mockMustBe.mock.calls[0][3]).toStrictEqual([false, false]);
        expect(mockMustBe.mock.calls[0][4]).toBe('decimal');
        expect(mockMustBe.mock.calls[0][5]).toBe(true);
      });
      test('mustBeNumberLessThanOrEqual chama mustBeNumberInTheRange', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();
        const limit = Math.random();

        const mockMustBe = jest.fn(
          (arg1, arg2, arg3, arg4, arg5, arg6) => expectedResult
        );
        JsonLoader.mustBeNumberInTheRange = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeNumberLessThanOrEqual<ConfigurationTestA>(
            instance,
            fieldName,
            limit
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toStrictEqual([undefined, limit]);
        expect(mockMustBe.mock.calls[0][3]).toStrictEqual([true, true]);
        expect(mockMustBe.mock.calls[0][4]).toBe('decimal');
        expect(mockMustBe.mock.calls[0][5]).toBe(false);
      });
      test('mustBeNumberLessThanOrEqualOrNotInformed chama mustBeNumberInTheRange', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();
        const limit = Math.random();

        const mockMustBe = jest.fn(
          (arg1, arg2, arg3, arg4, arg5, arg6) => expectedResult
        );
        JsonLoader.mustBeNumberInTheRange = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeNumberLessThanOrEqualOrNotInformed<ConfigurationTestA>(
            instance,
            fieldName,
            limit
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toStrictEqual([undefined, limit]);
        expect(mockMustBe.mock.calls[0][3]).toStrictEqual([true, true]);
        expect(mockMustBe.mock.calls[0][4]).toBe('decimal');
        expect(mockMustBe.mock.calls[0][5]).toBe(true);
      });
      test('mustBeNumberEqualTo chama mustBeNumberInTheRange', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();
        const target = Math.random();

        const mockMustBe = jest.fn(
          (arg1, arg2, arg3, arg4, arg5, arg6) => expectedResult
        );
        JsonLoader.mustBeNumberInTheRange = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeNumberEqualTo<ConfigurationTestA>(
            instance,
            fieldName,
            target
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toStrictEqual([target, target]);
        expect(mockMustBe.mock.calls[0][3]).toStrictEqual([true, true]);
        expect(mockMustBe.mock.calls[0][4]).toBe('decimal');
        expect(mockMustBe.mock.calls[0][5]).toBe(false);
      });
      test('mustBeNumberGreaterThan chama mustBeNumberInTheRange', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();
        const limit = Math.random();

        const mockMustBe = jest.fn(
          (arg1, arg2, arg3, arg4, arg5, arg6) => expectedResult
        );
        JsonLoader.mustBeNumberInTheRange = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeNumberGreaterThan<ConfigurationTestA>(
            instance,
            fieldName,
            limit
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toStrictEqual([limit, undefined]);
        expect(mockMustBe.mock.calls[0][3]).toStrictEqual([false, false]);
        expect(mockMustBe.mock.calls[0][4]).toBe('decimal');
        expect(mockMustBe.mock.calls[0][5]).toBe(false);
      });
      test('mustBeNumberGreaterThanOrNotInformed chama mustBeNumberInTheRange', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();
        const limit = Math.random();

        const mockMustBe = jest.fn(
          (arg1, arg2, arg3, arg4, arg5, arg6) => expectedResult
        );
        JsonLoader.mustBeNumberInTheRange = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeNumberGreaterThanOrNotInformed<ConfigurationTestA>(
            instance,
            fieldName,
            limit
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toStrictEqual([limit, undefined]);
        expect(mockMustBe.mock.calls[0][3]).toStrictEqual([false, false]);
        expect(mockMustBe.mock.calls[0][4]).toBe('decimal');
        expect(mockMustBe.mock.calls[0][5]).toBe(true);
      });
      test('mustBeNumberGreaterThanOrEqual chama mustBeNumberInTheRange', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();
        const limit = Math.random();

        const mockMustBe = jest.fn(
          (arg1, arg2, arg3, arg4, arg5, arg6) => expectedResult
        );
        JsonLoader.mustBeNumberInTheRange = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeNumberGreaterThanOrEqual<ConfigurationTestA>(
            instance,
            fieldName,
            limit
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toStrictEqual([limit, undefined]);
        expect(mockMustBe.mock.calls[0][3]).toStrictEqual([true, true]);
        expect(mockMustBe.mock.calls[0][4]).toBe('decimal');
        expect(mockMustBe.mock.calls[0][5]).toBe(false);
      });
      test('mustBeNumberGreaterThanOrEqualOrNotInformed chama mustBeNumberInTheRange', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();
        const limit = Math.random();

        const mockMustBe = jest.fn(
          (arg1, arg2, arg3, arg4, arg5, arg6) => expectedResult
        );
        JsonLoader.mustBeNumberInTheRange = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeNumberGreaterThanOrEqualOrNotInformed<ConfigurationTestA>(
            instance,
            fieldName,
            limit
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toStrictEqual([limit, undefined]);
        expect(mockMustBe.mock.calls[0][3]).toStrictEqual([true, true]);
        expect(mockMustBe.mock.calls[0][4]).toBe('decimal');
        expect(mockMustBe.mock.calls[0][5]).toBe(true);
      });
      test('mustBeIntegerBeetwen chama mustBeNumberInTheRange', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();
        const minValue = Math.random();
        const maxValue = Math.random();

        const mockMustBe = jest.fn(
          (arg1, arg2, arg3, arg4, arg5, arg6) => expectedResult
        );
        JsonLoader.mustBeNumberInTheRange = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeIntegerBeetwen<ConfigurationTestA>(
            instance,
            fieldName,
            minValue,
            maxValue
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toStrictEqual([minValue, maxValue]);
        expect(mockMustBe.mock.calls[0][3]).toStrictEqual([true, true]);
        expect(mockMustBe.mock.calls[0][4]).toBe('integer');
        expect(mockMustBe.mock.calls[0][5]).toBe(false);
      });
      test('mustBeIntegerBeetwenOrNotInformed chama mustBeNumberInTheRange', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();
        const minValue = Math.random();
        const maxValue = Math.random();

        const mockMustBe = jest.fn(
          (arg1, arg2, arg3, arg4, arg5, arg6) => expectedResult
        );
        JsonLoader.mustBeNumberInTheRange = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeIntegerBeetwenOrNotInformed<ConfigurationTestA>(
            instance,
            fieldName,
            minValue,
            maxValue
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toStrictEqual([minValue, maxValue]);
        expect(mockMustBe.mock.calls[0][3]).toStrictEqual([true, true]);
        expect(mockMustBe.mock.calls[0][4]).toBe('integer');
        expect(mockMustBe.mock.calls[0][5]).toBe(true);
      });
      test('mustBeIntegerLessThan chama mustBeNumberInTheRange', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();
        const limit = Math.random();

        const mockMustBe = jest.fn(
          (arg1, arg2, arg3, arg4, arg5, arg6) => expectedResult
        );
        JsonLoader.mustBeNumberInTheRange = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeIntegerLessThan<ConfigurationTestA>(
            instance,
            fieldName,
            limit
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toStrictEqual([undefined, limit]);
        expect(mockMustBe.mock.calls[0][3]).toStrictEqual([false, false]);
        expect(mockMustBe.mock.calls[0][4]).toBe('integer');
        expect(mockMustBe.mock.calls[0][5]).toBe(false);
      });
      test('mustBeIntegerLessThanOrNotInformed chama mustBeNumberInTheRange', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();
        const limit = Math.random();

        const mockMustBe = jest.fn(
          (arg1, arg2, arg3, arg4, arg5, arg6) => expectedResult
        );
        JsonLoader.mustBeNumberInTheRange = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeIntegerLessThanOrNotInformed<ConfigurationTestA>(
            instance,
            fieldName,
            limit
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toStrictEqual([undefined, limit]);
        expect(mockMustBe.mock.calls[0][3]).toStrictEqual([false, false]);
        expect(mockMustBe.mock.calls[0][4]).toBe('integer');
        expect(mockMustBe.mock.calls[0][5]).toBe(true);
      });
      test('mustBeIntegerLessThanOrEqual chama mustBeNumberInTheRange', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();
        const limit = Math.random();

        const mockMustBe = jest.fn(
          (arg1, arg2, arg3, arg4, arg5, arg6) => expectedResult
        );
        JsonLoader.mustBeNumberInTheRange = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeIntegerLessThanOrEqual<ConfigurationTestA>(
            instance,
            fieldName,
            limit
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toStrictEqual([undefined, limit]);
        expect(mockMustBe.mock.calls[0][3]).toStrictEqual([true, true]);
        expect(mockMustBe.mock.calls[0][4]).toBe('integer');
        expect(mockMustBe.mock.calls[0][5]).toBe(false);
      });
      test('mustBeIntegerLessThanOrEqualOrNotInformed chama mustBeNumberInTheRange', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();
        const limit = Math.random();

        const mockMustBe = jest.fn(
          (arg1, arg2, arg3, arg4, arg5, arg6) => expectedResult
        );
        JsonLoader.mustBeNumberInTheRange = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeIntegerLessThanOrEqualOrNotInformed<ConfigurationTestA>(
            instance,
            fieldName,
            limit
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toStrictEqual([undefined, limit]);
        expect(mockMustBe.mock.calls[0][3]).toStrictEqual([true, true]);
        expect(mockMustBe.mock.calls[0][4]).toBe('integer');
        expect(mockMustBe.mock.calls[0][5]).toBe(true);
      });
      test('mustBeIntegerEqualTo chama mustBeNumberInTheRange', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();
        const target = Math.random();

        const mockMustBe = jest.fn(
          (arg1, arg2, arg3, arg4, arg5, arg6) => expectedResult
        );
        JsonLoader.mustBeNumberInTheRange = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeIntegerEqualTo<ConfigurationTestA>(
            instance,
            fieldName,
            target
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toStrictEqual([target, target]);
        expect(mockMustBe.mock.calls[0][3]).toStrictEqual([true, true]);
        expect(mockMustBe.mock.calls[0][4]).toBe('integer');
        expect(mockMustBe.mock.calls[0][5]).toBe(false);
      });
      test('mustBeIntegerGreaterThan chama mustBeNumberInTheRange', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();
        const limit = Math.random();

        const mockMustBe = jest.fn(
          (arg1, arg2, arg3, arg4, arg5, arg6) => expectedResult
        );
        JsonLoader.mustBeNumberInTheRange = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeIntegerGreaterThan<ConfigurationTestA>(
            instance,
            fieldName,
            limit
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toStrictEqual([limit, undefined]);
        expect(mockMustBe.mock.calls[0][3]).toStrictEqual([false, false]);
        expect(mockMustBe.mock.calls[0][4]).toBe('integer');
        expect(mockMustBe.mock.calls[0][5]).toBe(false);
      });
      test('mustBeIntegerGreaterThanOrNotInformed chama mustBeNumberInTheRange', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();
        const limit = Math.random();

        const mockMustBe = jest.fn(
          (arg1, arg2, arg3, arg4, arg5, arg6) => expectedResult
        );
        JsonLoader.mustBeNumberInTheRange = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeIntegerGreaterThanOrNotInformed<ConfigurationTestA>(
            instance,
            fieldName,
            limit
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toStrictEqual([limit, undefined]);
        expect(mockMustBe.mock.calls[0][3]).toStrictEqual([false, false]);
        expect(mockMustBe.mock.calls[0][4]).toBe('integer');
        expect(mockMustBe.mock.calls[0][5]).toBe(true);
      });
      test('mustBeIntegerGreaterThanOrEqual chama mustBeNumberInTheRange', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();
        const limit = Math.random();

        const mockMustBe = jest.fn(
          (arg1, arg2, arg3, arg4, arg5, arg6) => expectedResult
        );
        JsonLoader.mustBeNumberInTheRange = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeIntegerGreaterThanOrEqual<ConfigurationTestA>(
            instance,
            fieldName,
            limit
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toStrictEqual([limit, undefined]);
        expect(mockMustBe.mock.calls[0][3]).toStrictEqual([true, true]);
        expect(mockMustBe.mock.calls[0][4]).toBe('integer');
        expect(mockMustBe.mock.calls[0][5]).toBe(false);
      });
      test('mustBeIntegerGreaterThanOrEqualOrNotInformed chama mustBeNumberInTheRange', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();
        const limit = Math.random();

        const mockMustBe = jest.fn(
          (arg1, arg2, arg3, arg4, arg5, arg6) => expectedResult
        );
        JsonLoader.mustBeNumberInTheRange = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeIntegerGreaterThanOrEqualOrNotInformed<ConfigurationTestA>(
            instance,
            fieldName,
            limit
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2]).toStrictEqual([limit, undefined]);
        expect(mockMustBe.mock.calls[0][3]).toStrictEqual([true, true]);
        expect(mockMustBe.mock.calls[0][4]).toBe('integer');
        expect(mockMustBe.mock.calls[0][5]).toBe(true);
      });
      test('mustBeUuid chama mustMatchRegex', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();
        const expectedRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        const mockMustBe = jest.fn(
          (arg1, arg2, arg3, arg4, arg5) => expectedResult
        );
        JsonLoader.mustMatchRegex = mockMustBe;

        // Act, When

        const receivedResult = JsonLoader.mustBeUuid<ConfigurationTestA>(
          instance,
          fieldName
        );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2].toString()).toBe(
          expectedRegex.toString()
        );
        expect(mockMustBe.mock.calls[0][3]).toBe(false);
        expect(mockMustBe.mock.calls[0][4]).toBe('UUID');
      });
      test('mustBeUuidOrNotInformed chama mustMatchRegex', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();
        const expectedRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        const mockMustBe = jest.fn(
          (arg1, arg2, arg3, arg4, arg5) => expectedResult
        );
        JsonLoader.mustMatchRegex = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeUuidOrNotInformed<ConfigurationTestA>(
            instance,
            fieldName
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2].toString()).toBe(
          expectedRegex.toString()
        );
        expect(mockMustBe.mock.calls[0][3]).toBe(true);
        expect(mockMustBe.mock.calls[0][4]).toBe('UUID');
      });
      test('mustBeDate chama mustBeValidFormat', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();
        const evaluate = HelperDate.isDateYYYMMDD.bind(HelperDate);

        const mockMustBe = jest.fn(
          (arg1, arg2, arg3, arg4, arg5) => expectedResult
        );
        JsonLoader.mustBeValidFormat = mockMustBe;

        // Act, When

        const receivedResult = JsonLoader.mustBeDate<ConfigurationTestA>(
          instance,
          fieldName
        );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2].toString()).toBe(
          evaluate.toString()
        );
        expect(mockMustBe.mock.calls[0][3]).toBe(false);
        expect(mockMustBe.mock.calls[0][4]).toBe('date YYYY-MM-DD');
      });
      test('mustBeDate chama mustBeValidFormat', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();
        const evaluate = HelperDate.isDateYYYMMDD.bind(HelperDate);
        const canBeNotInformed = false;

        const mockMustBe = jest.fn(
          (arg1, arg2, arg3, arg4, arg5) => expectedResult
        );
        JsonLoader.mustBeValidFormat = mockMustBe;

        // Act, When

        const receivedResult = JsonLoader.mustBeDate<ConfigurationTestA>(
          instance,
          fieldName
        );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2].toString()).toBe(
          evaluate.toString()
        );
        expect(mockMustBe.mock.calls[0][3]).toBe(canBeNotInformed);
        expect(mockMustBe.mock.calls[0][4]).toBe('date YYYY-MM-DD');
      });
      test('mustBeDateOrNotInformed chama mustBeValidFormat', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();
        const evaluate = HelperDate.isDateYYYMMDD.bind(HelperDate);
        const canBeNotInformed = true;

        const mockMustBe = jest.fn(
          (arg1, arg2, arg3, arg4, arg5) => expectedResult
        );
        JsonLoader.mustBeValidFormat = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeDateOrNotInformed<ConfigurationTestA>(
            instance,
            fieldName
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2].toString()).toBe(
          evaluate.toString()
        );
        expect(mockMustBe.mock.calls[0][3]).toBe(canBeNotInformed);
        expect(mockMustBe.mock.calls[0][4]).toBe('date YYYY-MM-DD');
      });
      test('mustBeDateTimeISO chama mustBeValidFormat', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();
        const evaluate = HelperDate.isDateISO.bind(HelperDate);
        const canBeNotInformed = false;

        const mockMustBe = jest.fn(
          (arg1, arg2, arg3, arg4, arg5) => expectedResult
        );
        JsonLoader.mustBeValidFormat = mockMustBe;

        // Act, When

        const receivedResult = JsonLoader.mustBeDateTimeISO<ConfigurationTestA>(
          instance,
          fieldName
        );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2].toString()).toBe(
          evaluate.toString()
        );
        expect(mockMustBe.mock.calls[0][3]).toBe(canBeNotInformed);
        expect(mockMustBe.mock.calls[0][4]).toBe('datetime ISO 8601');
      });
      test('mustBeDateTimeISOOrNotInformed chama mustBeValidFormat', () => {
        // Arrange, Given

        const instance = new ConfigurationTestA();
        const fieldName = 'propertyNumber';
        const expectedResult = Array<string>();
        const evaluate = HelperDate.isDateISO.bind(HelperDate);
        const canBeNotInformed = true;

        const mockMustBe = jest.fn(
          (arg1, arg2, arg3, arg4, arg5) => expectedResult
        );
        JsonLoader.mustBeValidFormat = mockMustBe;

        // Act, When

        const receivedResult =
          JsonLoader.mustBeDateTimeISOOrNotInformed<ConfigurationTestA>(
            instance,
            fieldName
          );

        // Assert, Then

        expect(receivedResult).toBe(expectedResult);
        expect(mockMustBe).toBeCalledTimes(1);
        expect(mockMustBe.mock.calls[0][0]).toBe(instance);
        expect(mockMustBe.mock.calls[0][1]).toBe(fieldName);
        expect(mockMustBe.mock.calls[0][2].toString()).toBe(
          evaluate.toString()
        );
        expect(mockMustBe.mock.calls[0][3]).toBe(canBeNotInformed);
        expect(mockMustBe.mock.calls[0][4]).toBe('datetime ISO 8601');
      });
    });
    describe('Validadores de fato', () => {
      describe('mustBeOfType', () => {
        test('Esperado sucesso: Permitido valor vazio: SIM ou NÃO. Valor informado corresponde ao tipo esperado: SIM. Tipos esperados: number, string, boolean, object', () => {
          // Arrange, Given

          const propertyName: keyof ConfigurationForValidationTest = 'property';
          const values: Record<PrimitiveValueTypeName | 'object', unknown> = {
            number: Math.random() * 1000,
            string: Math.random().toString(),
            boolean: Math.floor(Math.random() * 1000) % 2 === 0,
            object: {}
          };
          const canBeNotInformedValues = [false, true];

          const instance = new ConfigurationForValidationTest();
          for (const canBeNotInformed of canBeNotInformedValues)
            for (const property of Object.entries(values)) {
              const propertyType = property[0];
              instance[propertyName] = property[1];

              // Act, When

              const receivedResult =
                JsonLoader.mustBeOfType<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  propertyType as PrimitiveValueTypeName | 'object',
                  canBeNotInformed
                );

              // Assert, Then

              expect(receivedResult.length).toBe(0);
            }
        });
        test('Esperado falha: Permitido valor vazio: NÃO. Valor informado corresponde ao tipo ao tipo esperado: SIM (object). Tipo esperado: object. Mas null é considerado valor vazio', () => {
          // Arrange, Given

          const canBeNotInformed = false;
          const propertyName: keyof ConfigurationForValidationTest = 'property';
          const propertyType = 'object';
          const propertyValue = null;

          const instance = new ConfigurationForValidationTest();
          instance[propertyName] = propertyValue;

          const expectedErrorMessage = `${ConfigurationForValidationTest.name}.${propertyName} must be a ${propertyType}, but found: ${propertyValue}`;

          // Act, When

          const receivedResult =
            JsonLoader.mustBeOfType<ConfigurationForValidationTest>(
              instance,
              propertyName,
              propertyType,
              canBeNotInformed
            );

          // Assert, Then

          expect(receivedResult.length).toBe(1);
          expect(receivedResult[0]).toBe(expectedErrorMessage);
        });
        test('Esperado falha: Permitido valor vazio: NÃO. Valor informado é vazio: SIM (null, undefined): Tipos esperados: number, string, boolean, object', () => {
          // Arrange, Given

          const canBeNotInformed = false;
          const propertyName: keyof ConfigurationForValidationTest = 'property';
          const propertyTypes: Array<PrimitiveValueTypeName | 'object'> = [
            'number',
            'string',
            'boolean',
            'object'
          ];
          const emptyValues = [null, undefined];

          const instance = new ConfigurationForValidationTest();

          for (const propertyType of propertyTypes)
            for (const emptyValue of emptyValues) {
              instance[propertyName] = emptyValue;

              const expectedErrorMessage = `${ConfigurationForValidationTest.name}.${propertyName} must be a ${propertyType}, but found: ${emptyValue}`;

              // Act, When

              const receivedResult =
                JsonLoader.mustBeOfType<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  propertyType,
                  canBeNotInformed
                );

              // Assert, Then

              expect(receivedResult.length).toBe(1);
              expect(receivedResult[0]).toBe(expectedErrorMessage);
            }
        });
        test('Esperado sucesso: Permitido valor vazio: SIM. Valor informado é vazio: null, undefined. Tipos esperados: number, string, boolean, object', () => {
          // Arrange, Given

          const emptyValues = [undefined, null];
          const propertyName: keyof ConfigurationForValidationTest = 'property';
          const propertyTypes: Array<PrimitiveValueTypeName | 'object'> = [
            'number',
            'string',
            'boolean',
            'object'
          ];
          const canBeNotInformed = true;

          const instance = new ConfigurationForValidationTest();
          for (const propertyType of propertyTypes)
            for (const emptyValue of emptyValues) {
              instance[propertyName] = emptyValue;

              // Act, When

              const receivedResult =
                JsonLoader.mustBeOfType<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  propertyType,
                  canBeNotInformed
                );

              // Assert, Then

              expect(receivedResult.length).toBe(0);
            }
        });
        test('Esperado falha: Permitido valor vazio: SIM. Valor informado corresponde ao tipo esperado: NÃO. Tipos esperados: number, string, boolean, object', () => {
          // Arrange, Given

          const propertyName: keyof ConfigurationForValidationTest = 'property';
          const propertyTypes: Array<PrimitiveValueTypeName | 'object'> = [
            'number',
            'string',
            'boolean',
            'object'
          ];
          const canBeNotInformed = true;

          const instance = new ConfigurationForValidationTest();
          for (const propertyType of propertyTypes) {
            instance[propertyName] =
              propertyType !== 'string'
                ? Math.random().toString()
                : Math.random();

            const expectedErrorMessage = `${
              ConfigurationForValidationTest.name
            }.${propertyName} must be a ${[
              propertyType,
              String(null),
              String(undefined)
            ].join(' or ')}, but found: (${typeof instance[propertyName]}) ${
              typeof instance[propertyName] === 'string'
                ? `"${instance[propertyName]}"`
                : instance[propertyName]
            }`;

            // Act, When

            const receivedResult =
              JsonLoader.mustBeOfType<ConfigurationForValidationTest>(
                instance,
                propertyName,
                propertyType,
                canBeNotInformed
              );

            // Assert, Then

            expect(receivedResult.length).toBe(1);
            expect(receivedResult[0]).toBe(expectedErrorMessage);
          }
        });
        test('Verificação de tipo integer', () => {
          // Arrange, Given

          const propertyName: keyof ConfigurationForValidationTest = 'property';
          const propertyType = 'integer';
          const canBeNotInformed = false;
          const values: [boolean, number][] = [
            [false, Math.random()],
            [true, Math.floor(Math.random())]
          ];

          const instance = new ConfigurationForValidationTest();
          for (const value of values) {
            const isValid = value[0];
            instance[propertyName] = value[1];

            const expectedErrorMessage = `${
              ConfigurationForValidationTest.name
            }.${propertyName} must be a ${propertyType}, but found: (${typeof value[1]}) ${
              value[1]
            }`;

            // Act, When

            const receivedResult =
              JsonLoader.mustBeOfType<ConfigurationForValidationTest>(
                instance,
                propertyName,
                propertyType,
                canBeNotInformed
              );

            // Assert, Then

            if (isValid) {
              expect(receivedResult.length).toBe(0);
            } else {
              expect(receivedResult.length).toBe(1);
              expect(receivedResult[0]).toBe(expectedErrorMessage);
            }
          }
        });
      });
      describe('mustBeList', () => {
        test('Esperado sucesso: Permitido valor vazio: SIM ou NÃO. Itens na lista correspondem ao tipo esperado: SIM. Tipos esperados nos itens: number, string, boolean, object, null, undefined, any', () => {
          // Arrange, Given

          const canBeNotInformedValues = [true, false];
          const values: Record<
            PrimitiveValueTypeName | 'object' | 'undefined' | 'null' | 'any',
            unknown
          > = {
            number: Math.random() * 1000,
            string: Math.random().toString(),
            boolean: Math.floor(Math.random() * 1000) % 2 === 0,
            object: {},
            undefined: undefined,
            null: null,
            any: 'any'
          };

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';
          for (const canBeNotInformed of canBeNotInformedValues)
            for (const entry of Object.entries(values)) {
              const propertyType = [entry[0]] as Array<
                PrimitiveValueTypeName | 'object' | 'undefined' | 'null' | 'any'
              >;
              const itemValue = entry[1];
              instance[propertyName] = [itemValue, itemValue, itemValue];

              // Act, When

              const returnedErrorsForType =
                JsonLoader.mustBeList<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  propertyType[0],
                  canBeNotInformed
                );
              const returnedErrorsForTypes =
                JsonLoader.mustBeList<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  propertyType[0],
                  canBeNotInformed
                );

              // Assert, Then

              expect(returnedErrorsForType.length).toBe(0);
              expect(returnedErrorsForTypes.length).toBe(0);
            }
        });
        test('Esperado falha: Permitido valor vazio: NÃO. Valor é vazio: SIM (null, undefined). Tipos esperados nos itens: number, string, boolean, object, null, undefined, any', () => {
          // Arrange, Given

          const emptyValues = [null, undefined];
          const canBeNotInformed = false;
          const propertyTypes: Array<
            | PrimitiveValueTypeName
            | 'object'
            | 'undefined'
            | 'null'
            | 'any'
            | Array<
                PrimitiveValueTypeName | 'object' | 'undefined' | 'null' | 'any'
              >
          > = [
            'number',
            'string',
            'boolean',
            'object',
            'undefined',
            'null',
            'any'
          ];
          propertyTypes.push(
            propertyTypes as Array<
              PrimitiveValueTypeName | 'object' | 'undefined' | 'null' | 'any'
            >
          );
          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const propertyType of propertyTypes)
            for (const emptyValue of emptyValues) {
              instance[propertyName] = emptyValue;

              const expectedError = `${
                ConfigurationForValidationTest.name
              }.${propertyName} must be a array of items of type ${
                Array.isArray(propertyType)
                  ? propertyType.join(' or ')
                  : propertyType
              }, but found: ${
                emptyValue === null || emptyValue === undefined
                  ? String(emptyValue)
                  : `${typeof emptyValue}: ${emptyValue}`
              }`;

              // Act, When

              const returnedErrors =
                JsonLoader.mustBeList<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  propertyType,
                  canBeNotInformed
                );

              // Assert, Then

              expect(returnedErrors.length).toBe(1);
              expect(returnedErrors[0]).toBe(expectedError);
            }
        });
        test('Esperado sucesso: Permitido valor vazio: SIM. Valor é vazio: SIM (null, undefined). Tipos esperados nos itens: number, string, boolean, object, null, undefined, any', () => {
          // Arrange, Given

          const emptyValues = [null, undefined];
          const canBeNotInformed = true;
          const propertyTypes: Array<
            | PrimitiveValueTypeName
            | 'object'
            | 'undefined'
            | 'null'
            | 'any'
            | Array<
                PrimitiveValueTypeName | 'object' | 'undefined' | 'null' | 'any'
              >
          > = [
            'number',
            'string',
            'boolean',
            'object',
            'undefined',
            'null',
            'any'
          ];
          propertyTypes.push(
            propertyTypes as Array<
              PrimitiveValueTypeName | 'object' | 'undefined' | 'null' | 'any'
            >
          );
          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const propertyType of propertyTypes)
            for (const emptyValue of emptyValues) {
              instance[propertyName] = emptyValue;

              // Act, When

              const returnedErrors =
                JsonLoader.mustBeList<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  propertyType,
                  canBeNotInformed
                );

              // Assert, Then

              expect(returnedErrors.length).toBe(0);
            }
        });
        test('Esperado falha: Permitido valor vazio: SIM ou NÃO. Itens na lista correspondem ao tipo esperado: NÃO. Tipos esperados nos itens: number, string, boolean, object, null, undefined, any', () => {
          // Arrange, Given

          const canBeNotInformedValues = [true, false];
          const types: Array<
            PrimitiveValueTypeName | 'object' | 'undefined' | 'null'
          > = ['number', 'string', 'boolean', 'object', 'undefined', 'null'];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';
          for (const canBeNotInformed of canBeNotInformedValues)
            for (const type of types) {
              const propertyType = [type] as Array<
                PrimitiveValueTypeName | 'object' | 'undefined' | 'null'
              >;
              instance[propertyName] = [
                type !== 'string' ? String(Math.random()) : Math.random()
              ];

              const expectedError = `${
                ConfigurationForValidationTest.name
              }.${propertyName} must be a array of items of type ${
                propertyType[0]
              }${
                canBeNotInformed
                  ? ', or an unspecified list with null or undefined'
                  : ''
              }, but found: [ (${typeof (
                instance[propertyName] as unknown[]
              )[0]}) ${
                typeof (instance[propertyName] as unknown[])[0] === 'string'
                  ? `"${instance[propertyName]}"`
                  : instance[propertyName]
              } ]`;

              // Act, When

              const returnedErrorsForType =
                JsonLoader.mustBeList<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  propertyType[0],
                  canBeNotInformed
                );
              const returnedErrorsForTypes =
                JsonLoader.mustBeList<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  propertyType[0],
                  canBeNotInformed
                );

              // Assert, Then

              expect(returnedErrorsForType.length).toBe(1);
              expect(returnedErrorsForType[0]).toBe(expectedError);
              expect(returnedErrorsForTypes.length).toBe(1);
              expect(returnedErrorsForTypes[0]).toBe(expectedError);
            }
        });
        test('Esperado falha: Permitido valor vazio: NÃO. Itens na lista correspondem ao tipo esperado: NÃO. Tipos esperados nos itens: object. Embora null seja object deve ser expecificado à parte', () => {
          // Arrange, Given

          const canBeNotInformed = false;

          const instance = new ConfigurationForValidationTest();
          const propertyType = 'object';
          const propertyName: keyof ConfigurationForValidationTest = 'property';
          instance[propertyName] = [null];

          const expectedError = `${ConfigurationForValidationTest.name}.${propertyName} must be a array of items of type ${propertyType}, but found: [ null ]`;

          // Act, When

          const returnedErrors =
            JsonLoader.mustBeList<ConfigurationForValidationTest>(
              instance,
              propertyName,
              propertyType,
              canBeNotInformed
            );

          // Assert, Then

          expect(returnedErrors.length).toBe(1);
          expect(returnedErrors[0]).toBe(expectedError);
        });
        test('Esperado sucesso: Permitido valor vazio: NÃO. Tipo any aceita qualquer coisa', () => {
          // Arrange, Given

          const propertyTypeWithAny: Array<PrimitiveValueTypeName | 'any'> = [
            'string',
            'number',
            'any'
          ];
          const canBeNotInformed = false;
          const values: Record<
            PrimitiveValueTypeName | 'object' | 'undefined' | 'null',
            unknown
          > = {
            number: Math.random() * 1000,
            string: Math.random().toString(),
            boolean: Math.floor(Math.random() * 1000) % 2 === 0,
            object: {},
            undefined: undefined,
            null: null
          };

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';
          for (const entry of Object.entries(values)) {
            const propertyType = entry[0];
            instance[propertyName] = [entry[1]];

            // Act, When

            const returnedErrors =
              JsonLoader.mustBeList<ConfigurationForValidationTest>(
                instance,
                propertyName,
                propertyTypeWithAny,
                canBeNotInformed
              );

            // Assert, Then

            expect(returnedErrors.length).toBe(0);
          }
        });
        test('Exibir lista de valores inválidos com seus respectivos tipos', () => {
          // Arrange, Given

          const canBeNotInformed = false;

          const instance = new ConfigurationForValidationTest();
          const propertyType: Array<
            PrimitiveValueTypeName | 'object' | 'undefined' | 'null'
          > = ['string', 'object', 'undefined', 'null'];
          const propertyName: keyof ConfigurationForValidationTest = 'property';
          instance[propertyName] = ['a', 1, true, undefined, null];

          const expectedError = `${
            ConfigurationForValidationTest.name
          }.${propertyName} must be a array of items of type ${propertyType.join(
            ' or '
          )}, but found: [ ${[
            '(string) "a"',
            '(number) 1',
            '(boolean) true',
            'undefined',
            'null'
          ].join(', ')} ]`;

          // Act, When

          const returnedErrors =
            JsonLoader.mustBeList<ConfigurationForValidationTest>(
              instance,
              propertyName,
              propertyType,
              canBeNotInformed
            );

          // Assert, Then

          expect(returnedErrors.length).toBe(1);
          expect(returnedErrors[0]).toBe(expectedError);
        });
        test('Verificar tipo integer', () => {
          // Arrange, Given

          const canBeNotInformed = false;

          const instance = new ConfigurationForValidationTest();
          const propertyType = 'integer';
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          const values: [boolean, number][] = [
            [false, Math.random() * 1000],
            [true, Math.floor(Math.random() * 1000)]
          ];

          for (const value of values) {
            const isValid = value[0];
            instance[propertyName] = [value[1]];

            const expectedError = `${
              ConfigurationForValidationTest.name
            }.${propertyName} must be a array of items of type ${propertyType}, but found: [ (${typeof value[1]}) ${
              value[1]
            } ]`;

            // Act, When

            const returnedErrors =
              JsonLoader.mustBeList<ConfigurationForValidationTest>(
                instance,
                propertyName,
                propertyType,
                canBeNotInformed
              );

            // Assert, Then

            if (isValid) {
              expect(returnedErrors.length).toBe(0);
            } else {
              expect(returnedErrors.length).toBe(1);
              expect(returnedErrors[0]).toBe(expectedError);
            }
          }
        });
      });
      describe('mustBeListOfTheSet', () => {
        test('Esperado sucesso: Permitido valor vazio: SIM ou NÃO. Correspondência de valor: SIM, Correspondência de tipo: SIM. Modo de verificação: VALOR + TIPO', () => {
          // Arrange, Given

          const canBeNotInformedValues = [true, false];
          const validValues = [1, '1', true];
          const verificationMode = 'value and type';

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues) {
            instance[propertyName] = [true, 1, '1'];

            // Act, When

            const receivedErrors =
              JsonLoader.mustBeListOfTheSet<ConfigurationForValidationTest>(
                instance,
                propertyName,
                validValues,
                verificationMode,
                canBeNotInformed
              );

            // Assert, Then

            expect(receivedErrors.length).toBe(0);
          }
        });
        test('Esperado sucesso: Permitido valor vazio: SIM ou NÃO. Correspondência de valor: SIM, Correspondência de tipo: SIM. Modo de verificação: VALOR + TIPO. Não precisa usar todos os valores da lista', () => {
          // Arrange, Given

          const canBeNotInformedValues = [true, false];
          const validValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          const verificationMode = 'value and type';

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues) {
            instance[propertyName] = [4, 5, 6];

            // Act, When

            const receivedErrors =
              JsonLoader.mustBeListOfTheSet<ConfigurationForValidationTest>(
                instance,
                propertyName,
                validValues,
                verificationMode,
                canBeNotInformed
              );

            // Assert, Then

            expect(receivedErrors.length).toBe(0);
          }
        });
        test('Esperado sucesso: Permitido valor vazio: SIM ou NÃO. Correspondência de valor: SIM, Correspondência de tipo: NÃO. Modo de verificação: VALOR', () => {
          // Arrange, Given

          const canBeNotInformedValues = [true, false];
          const validValues = ['1', '2', '3'];
          const verificationMode = 'only value';

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues) {
            instance[propertyName] = [1, 3];

            // Act, When

            const receivedErrors =
              JsonLoader.mustBeListOfTheSet<ConfigurationForValidationTest>(
                instance,
                propertyName,
                validValues,
                verificationMode,
                canBeNotInformed
              );

            // Assert, Then

            expect(receivedErrors.length).toBe(0);
          }
        });
        test('Esperado falha: Permitido valor vazio: SIM ou NÃO. Correspondência de valor: SIM, Correspondência de tipo: NÃO. Modo de verificação: VALOR + TIPO', () => {
          // Arrange, Given

          const canBeNotInformedValues = [true, false];
          const validValues = [1, 2, 3];
          const verificationMode = 'value and type';

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues) {
            instance[propertyName] = ['1'];

            const expectedError = `${
              ConfigurationForValidationTest.name
            }.${propertyName} must be a array with items being ${validValues
              .map(item => `"${String(item)}"`)
              .join(' or ')}${
              canBeNotInformed
                ? ', or an unspecified list with null or undefined'
                : ''
            }, but found: [ ${(instance[propertyName] as unknown[])
              .map(
                item =>
                  `(${typeof item}) ${
                    typeof item === 'string' ? `"${item}"` : String(item)
                  }`
              )
              .join(', ')} ]`;

            // Act, When

            const receivedErrors =
              JsonLoader.mustBeListOfTheSet<ConfigurationForValidationTest>(
                instance,
                propertyName,
                validValues,
                verificationMode,
                canBeNotInformed
              );

            // Assert, Then

            expect(receivedErrors.length).toBe(1);
            expect(receivedErrors[0]).toBe(expectedError);
          }
        });
        test('Esperado falha: Permitido valor vazio: SIM ou NÃO. Correspondência de valor: NÃO, Correspondência de tipo: SIM. Modo de verificação: VALOR', () => {
          // Arrange, Given

          const canBeNotInformedValues = [true, false];
          const validValues = [1, 2, 3];
          const verificationMode = 'value and type';

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues) {
            instance[propertyName] = [4, 5, 6];

            const expectedError = `${
              ConfigurationForValidationTest.name
            }.${propertyName} must be a array with items being ${validValues
              .map(item => `"${String(item)}"`)
              .join(' or ')}${
              canBeNotInformed
                ? ', or an unspecified list with null or undefined'
                : ''
            }, but found: [ ${(instance[propertyName] as unknown[])
              .map(
                item =>
                  `(${typeof item}) ${
                    typeof item === 'string' ? `"${item}"` : String(item)
                  }`
              )
              .join(', ')} ]`;

            // Act, When

            const receivedErrors =
              JsonLoader.mustBeListOfTheSet<ConfigurationForValidationTest>(
                instance,
                propertyName,
                validValues,
                verificationMode,
                canBeNotInformed
              );

            // Assert, Then

            expect(receivedErrors.length).toBe(1);
            expect(receivedErrors[0]).toBe(expectedError);
          }
        });
        test('Esperado sucesso: Permitido valor vazio: SIM. Informar vazio: null, undefined', () => {
          // Arrange, Given

          const canBeNotInformed = true;
          const verificationModes: Array<'only value' | 'value and type'> = [
            'only value',
            'value and type'
          ];
          const validValues = [1, 2, 3];
          const values = [undefined, null];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const verificationMode of verificationModes)
            for (const value of values) {
              instance[propertyName] = value;

              // Act, When

              const receivedErrors =
                JsonLoader.mustBeListOfTheSet<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  validValues,
                  verificationMode,
                  canBeNotInformed
                );

              // Assert, Then

              expect(receivedErrors.length).toBe(0);
            }
        });
        test('Esperado falha: Permitido valor vazio: NÃO. Informar vazio: null, undefined', () => {
          // Arrange, Given

          const canBeNotInformed = false;
          const verificationModes: Array<'only value' | 'value and type'> = [
            'only value',
            'value and type'
          ];
          const validValues = [1, 2, 3];
          const values = [undefined, null];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const verificationMode of verificationModes)
            for (const value of values) {
              instance[propertyName] = value;

              const expectedError = `${
                ConfigurationForValidationTest.name
              }.${propertyName} must be a array with items being ${validValues
                .map(item => `"${String(item)}"`)
                .join(' or ')}, but found: ${String(instance[propertyName])}`;

              // Act, When

              const receivedErrors =
                JsonLoader.mustBeListOfTheSet<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  validValues,
                  verificationMode,
                  canBeNotInformed
                );

              // Assert, Then

              expect(receivedErrors.length).toBe(1);
              expect(receivedErrors[0]).toBe(expectedError);
            }
        });
        test('Esperado falha: Permitido valor vazio: NÃO. Informar vazio: null, undefined2', () => {
          // Arrange, Given

          const canBeNotInformed = false;
          const verificationModes: Array<'only value' | 'value and type'> = [
            'only value',
            'value and type'
          ];
          const validValues = [undefined, 1, 2, 3];
          const values = [undefined, null];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const verificationMode of verificationModes)
            for (const value of values) {
              instance[propertyName] = value;

              const expectedError = `${
                ConfigurationForValidationTest.name
              }.${propertyName} must be a array with items being ${validValues
                .map(item => `"${String(item)}"`)
                .join(' or ')}, but found: ${String(instance[propertyName])}`;

              // Act, When

              const receivedErrors =
                JsonLoader.mustBeListOfTheSet<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  validValues,
                  verificationMode,
                  canBeNotInformed
                );

              // Assert, Then

              expect(receivedErrors.length).toBe(1);
              expect(receivedErrors[0]).toBe(expectedError);
            }
        });
        test('Mensagem de erro não deve exibir conjunto de valores com duplicação', () => {
          // Arrange, Given

          const canBeNotInformedValues = [false, true];
          const verificationModes: Array<'only value' | 'value and type'> = [
            'only value',
            'value and type'
          ];
          const validValues = [3, 3, 2, 2, 1, 1, 2, 2, 3, 3];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues)
            for (const verificationMode of verificationModes) {
              instance[propertyName] = [9, 8, 7];

              const expectedError = `${
                ConfigurationForValidationTest.name
              }.${propertyName} must be a array with items being ${HelperList.unique(
                validValues
              )
                .map(item => `"${String(item)}"`)
                .join(' or ')}${
                canBeNotInformed
                  ? ', or an unspecified list with null or undefined'
                  : ''
              }, but found: [ ${(instance[propertyName] as unknown[])
                .map(
                  item =>
                    `(${typeof item}) ${
                      typeof item === 'string' ? `"${item}"` : String(item)
                    }`
                )
                .join(', ')} ]`;

              // Act, When

              const receivedErrors =
                JsonLoader.mustBeListOfTheSet<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  validValues,
                  verificationMode,
                  canBeNotInformed
                );

              // Assert, Then

              expect(receivedErrors.length).toBe(1);
              expect(receivedErrors[0]).toBe(expectedError);
            }
        });
      });
      describe('mustBeInTheSet', () => {
        test('Esperado sucesso: Permitido valor vazio: SIM ou NÃO. Correspondência de valor: SIM, Correspondência de tipo: SIM. Modo de verificação: VALOR + TIPO', () => {
          // Arrange, Given

          const canBeNotInformedValues = [true, false];
          const validValues = [1, '1', true];
          const verificationMode = 'value and type';
          const values = ['1', 1, true];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues)
            for (const value of values) {
              instance[propertyName] = value;

              // Act, When

              const receivedErrors =
                JsonLoader.mustBeInTheSet<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  validValues,
                  verificationMode,
                  canBeNotInformed
                );

              // Assert, Then

              expect(receivedErrors.length).toBe(0);
            }
        });
        test('Esperado sucesso: Permitido valor vazio: SIM ou NÃO. Correspondência de valor: SIM, Correspondência de tipo: NÃO. Modo de verificação: VALOR', () => {
          // Arrange, Given

          const canBeNotInformedValues = [true, false];
          const validValues = ['1', '2', '3'];
          const verificationMode = 'only value';
          const values = [1, 3];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues)
            for (const value of values) {
              instance[propertyName] = value;

              // Act, When

              const receivedErrors =
                JsonLoader.mustBeInTheSet<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  validValues,
                  verificationMode,
                  canBeNotInformed
                );

              // Assert, Then

              expect(receivedErrors.length).toBe(0);
            }
        });
        test('Esperado falha: Permitido valor vazio: SIM ou NÃO. Correspondência de valor: SIM, Correspondência de tipo: NÃO. Modo de verificação: VALOR + TIPO', () => {
          // Arrange, Given

          const canBeNotInformedValues = [true, false];
          const validValues = [1, 2, 3];
          const verificationMode = 'value and type';

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues) {
            instance[propertyName] = '1';

            const validValuesForError = Array<unknown>().concat(
              validValues.map(item => `"${item}"`),
              canBeNotInformed ? [String(null), String(undefined)] : []
            );
            const expectedError = `${
              ConfigurationForValidationTest.name
            }.${propertyName} must be ${validValuesForError.join(
              ' or '
            )}, but found: (${typeof instance[propertyName]}) ${
              typeof instance[propertyName] === 'string'
                ? `"${instance[propertyName]}"`
                : String(instance[propertyName])
            }`;

            // Act, When

            const receivedErrors =
              JsonLoader.mustBeInTheSet<ConfigurationForValidationTest>(
                instance,
                propertyName,
                validValues,
                verificationMode,
                canBeNotInformed
              );

            // Assert, Then

            expect(receivedErrors.length).toBe(1);
            expect(receivedErrors[0]).toBe(expectedError);
          }
        });
        test('Esperado falha: Permitido valor vazio: SIM ou NÃO. Correspondência de valor: NÃO, Correspondência de tipo: SIM. Modo de verificação: VALOR', () => {
          // Arrange, Given

          const canBeNotInformedValues = [true, false];
          const validValues = [1, 2, 3];
          const verificationMode = 'value and type';

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues) {
            instance[propertyName] = 4;

            const validValuesForError = Array<unknown>().concat(
              validValues.map(item => `"${item}"`),
              canBeNotInformed ? [String(null), String(undefined)] : []
            );
            const expectedError = `${
              ConfigurationForValidationTest.name
            }.${propertyName} must be ${validValuesForError.join(
              ' or '
            )}, but found: (${typeof instance[propertyName]}) ${
              typeof instance[propertyName] === 'string'
                ? `"${instance[propertyName]}"`
                : String(instance[propertyName])
            }`;

            // Act, When

            const receivedErrors =
              JsonLoader.mustBeInTheSet<ConfigurationForValidationTest>(
                instance,
                propertyName,
                validValues,
                verificationMode,
                canBeNotInformed
              );

            // Assert, Then

            expect(receivedErrors.length).toBe(1);
            expect(receivedErrors[0]).toBe(expectedError);
          }
        });
        test('Esperado falha: Permitido valor vazio: NÃO. Correspondência de valor: NÃO. Não duplicar null na mensagem de erro.', () => {
          // Arrange, Given

          const canBeNotInformedValues = [true, false];
          const validValues = [null, 1, 2, 3];
          const verificationMode = 'value and type';

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues) {
            instance[propertyName] = 4;

            const validValuesForError = Array<unknown>().concat(
              validValues.map(item => `"${item}"`),
              canBeNotInformed ? [String(undefined)] : []
            );
            const expectedError = `${
              ConfigurationForValidationTest.name
            }.${propertyName} must be ${validValuesForError.join(
              ' or '
            )}, but found: (${typeof instance[propertyName]}) ${
              typeof instance[propertyName] === 'string'
                ? `"${instance[propertyName]}"`
                : String(instance[propertyName])
            }`;

            // Act, When

            const receivedErrors =
              JsonLoader.mustBeInTheSet<ConfigurationForValidationTest>(
                instance,
                propertyName,
                validValues,
                verificationMode,
                canBeNotInformed
              );

            // Assert, Then

            expect(receivedErrors.length).toBe(1);
            expect(receivedErrors[0]).toBe(expectedError);
          }
        });
        test('Esperado falha: Permitido valor vazio: NÃO. Correspondência de valor: NÃO. Não duplicar undefined na mensagem de erro.', () => {
          // Arrange, Given

          const canBeNotInformedValues = [true, false];
          const validValues = [undefined, 1, 2, 3];
          const verificationMode = 'value and type';

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues) {
            instance[propertyName] = 4;

            const validValuesForError = Array<unknown>().concat(
              validValues.map(item => `"${item}"`),
              canBeNotInformed ? [String(null)] : []
            );
            const expectedError = `${
              ConfigurationForValidationTest.name
            }.${propertyName} must be ${validValuesForError.join(
              ' or '
            )}, but found: (${typeof instance[propertyName]}) ${
              typeof instance[propertyName] === 'string'
                ? `"${instance[propertyName]}"`
                : String(instance[propertyName])
            }`;

            // Act, When

            const receivedErrors =
              JsonLoader.mustBeInTheSet<ConfigurationForValidationTest>(
                instance,
                propertyName,
                validValues,
                verificationMode,
                canBeNotInformed
              );

            // Assert, Then

            expect(receivedErrors.length).toBe(1);
            expect(receivedErrors[0]).toBe(expectedError);
          }
        });
        test('Esperado sucesso: Permitido valor vazio: SIM. Informar vazio: null, undefined', () => {
          // Arrange, Given

          const canBeNotInformed = true;
          const verificationModes: Array<'only value' | 'value and type'> = [
            'only value',
            'value and type'
          ];
          const validValues = [1, 2, 3];
          const values = [undefined, null];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const verificationMode of verificationModes)
            for (const value of values) {
              instance[propertyName] = value;

              // Act, When

              const receivedErrors =
                JsonLoader.mustBeInTheSet<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  validValues,
                  verificationMode,
                  canBeNotInformed
                );

              // Assert, Then

              expect(receivedErrors.length).toBe(0);
            }
        });
        test('Esperado falha: Permitido valor vazio: NÃO. Informar vazio: null, undefined', () => {
          // Arrange, Given

          const canBeNotInformed = false;
          const verificationModes: Array<'only value' | 'value and type'> = [
            'only value',
            'value and type'
          ];
          const validValues = [1, 2, 3];
          const values = [undefined, null];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const verificationMode of verificationModes)
            for (const value of values) {
              instance[propertyName] = value;

              const expectedError = `${
                ConfigurationForValidationTest.name
              }.${propertyName} must be ${validValues
                .map(item => `"${item}"`)
                .join(' or ')}, but found: ${String(instance[propertyName])}`;

              // Act, When

              const receivedErrors =
                JsonLoader.mustBeInTheSet<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  validValues,
                  verificationMode,
                  canBeNotInformed
                );

              // Assert, Then

              expect(receivedErrors.length).toBe(1);
              expect(receivedErrors[0]).toBe(expectedError);
            }
        });
        test('Mensagem de erro não deve exibir conjunto de valores com duplicação', () => {
          // Arrange, Given

          const canBeNotInformedValues = [false, true];
          const verificationModes: Array<'only value' | 'value and type'> = [
            'only value',
            'value and type'
          ];
          const validValues = [3, 3, 2, 2, 1, 1, 2, 2, 3, 3];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues)
            for (const verificationMode of verificationModes) {
              instance[propertyName] = 9;

              const validValuesForError = Array<unknown>().concat(
                HelperList.unique(validValues).map(item => `"${item}"`),
                canBeNotInformed ? [String(null), String(undefined)] : []
              );
              const expectedError = `${
                ConfigurationForValidationTest.name
              }.${propertyName} must be ${validValuesForError.join(
                ' or '
              )}, but found: (${typeof instance[propertyName]}) ${
                typeof instance[propertyName] === 'string'
                  ? `"${instance[propertyName]}"`
                  : String(instance[propertyName])
              }`;

              // Act, When

              const receivedErrors =
                JsonLoader.mustBeInTheSet<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  validValues,
                  verificationMode,
                  canBeNotInformed
                );

              // Assert, Then

              expect(receivedErrors.length).toBe(1);
              expect(receivedErrors[0]).toBe(expectedError);
            }
        });
      });
      describe('mustBeNumberInTheRange', () => {
        test('Pelo menos um dos valores de minValue e maxValue devem ser informados.', () => {
          // Arrange, Given

          const canBeNotInformed = true;

          const minValue = undefined;
          const maxValue = undefined;

          const rangeInclusiveValues: [boolean, boolean][] = [
            [false, false],
            [true, false],
            [false, true],
            [true, true]
          ];
          const typesValues: Array<'integer' | 'decimal'> = [
            'integer',
            'decimal'
          ];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const rangeInclusive of rangeInclusiveValues)
            for (const type of typesValues) {
              // Act, When

              const validate = () =>
                JsonLoader.mustBeNumberInTheRange<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  [minValue, maxValue],
                  rangeInclusive,
                  type,
                  canBeNotInformed
                );

              // Assert, Then

              expect(validate).toThrow(EmptyError);
            }
        });
        test('modo decimal: minValue nunca deve ser maior que maxValue', () => {
          // Arrange, Given

          const canBeNotInformed = true;

          const minValue = Math.random();
          const maxValue = minValue - 0.1;

          const rangeInclusiveValues: [boolean, boolean][] = [
            [false, false],
            [true, false],
            [false, true],
            [true, true]
          ];
          const type = 'decimal';

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const rangeInclusive of rangeInclusiveValues) {
            // Act, When

            const validate = () =>
              JsonLoader.mustBeNumberInTheRange<ConfigurationForValidationTest>(
                instance,
                propertyName,
                [minValue, maxValue],
                rangeInclusive,
                type,
                canBeNotInformed
              );

            // Assert, Then

            expect(validate).toThrow(InvalidArgumentError);
          }
        });
        test('modo integer: minValue nunca deve ser maior que maxValue', () => {
          // Arrange, Given

          const canBeNotInformed = true;

          const minValue = Math.floor(Math.random());
          const maxValue = minValue - 1;

          const rangeInclusiveValues: [boolean, boolean][] = [
            [false, false],
            [true, false],
            [false, true],
            [true, true]
          ];
          const type = 'integer';

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const rangeInclusive of rangeInclusiveValues) {
            // Act, When

            const validate = () =>
              JsonLoader.mustBeNumberInTheRange<ConfigurationForValidationTest>(
                instance,
                propertyName,
                [minValue, maxValue],
                rangeInclusive,
                type,
                canBeNotInformed
              );

            // Assert, Then

            expect(validate).toThrow(InvalidArgumentError);
          }
        });
        test('modo integer: minValue é considerado igual a maxValue se forem decimais com mesmo inteiro', () => {
          // Arrange, Given

          const canBeNotInformed = true;

          const minValue = Math.random() - 0.002;
          const maxValue = minValue + 0.001;

          const rangeInclusive: [boolean, boolean] = [true, true];
          const type = 'integer';

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          // Act, When

          const validate = () =>
            JsonLoader.mustBeNumberInTheRange<ConfigurationForValidationTest>(
              instance,
              propertyName,
              [minValue, maxValue],
              rangeInclusive,
              type,
              canBeNotInformed
            );

          // Assert, Then

          expect(validate).not.toThrow(InvalidArgumentError);
        });
        test('modo integer: Mesmo que minValue e maxValue sejam diferentes, se como inteiro são iguais range deve se inclusivo', () => {
          // Arrange, Given

          const minValue = Math.random() - 0.002;
          const maxValue = minValue + 0.001;

          const canBeNotInformedValues = [false, true];
          const rangeInclusiveValues: [boolean, boolean][] = [
            [false, false],
            [true, false],
            [false, true]
          ];
          const type = 'integer';

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues)
            for (const rangeInclusive of rangeInclusiveValues) {
              // Act, When

              const validate = () =>
                JsonLoader.mustBeNumberInTheRange<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  [minValue, maxValue],
                  rangeInclusive,
                  type,
                  canBeNotInformed
                );

              // Assert, Then

              expect(validate).toThrow(InvalidArgumentError);
            }
        });
        test('Range impossível deve resultar em falha.', () => {
          // Arrange, Given

          const canBeNotInformed = true;

          const minValue = Math.random();
          const maxValue = minValue;

          const invalidRangeInclusiveValues: [boolean, boolean][] = [
            [false, false],
            [true, false],
            [false, true]
          ];
          const types: Array<'decimal' | 'integer'> = ['decimal', 'integer'];
          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const type of types)
            for (const invalidRangeInclusive of invalidRangeInclusiveValues) {
              // Act, When

              const validate = () =>
                JsonLoader.mustBeNumberInTheRange<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  [minValue, maxValue],
                  invalidRangeInclusive,
                  type,
                  canBeNotInformed
                );

              // Assert, Then

              expect(validate).toThrow(InvalidArgumentError);
            }
        });
        test('Esperado sucesso: Aceita vazio: SIM. Valor vazio: SIM.', () => {
          // Arrange, Given

          const canBeNotInformed = true;
          const emptyValues = [null, undefined];

          const rangeValues: [number | undefined, number | undefined][] = [
            [-100, undefined],
            [undefined, +100],
            [-100, +100]
          ];
          const rangeInclusiveValues: [boolean, boolean][] = [
            [false, false],
            [true, false],
            [false, true],
            [true, true]
          ];
          const typesValues: Array<'integer' | 'decimal'> = [
            'integer',
            'decimal'
          ];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const range of rangeValues)
            for (const rangeInclusive of rangeInclusiveValues)
              for (const type of typesValues)
                for (const emptyValue of emptyValues) {
                  instance[propertyName] = emptyValue;

                  // Act, When

                  const receivedErrors =
                    JsonLoader.mustBeNumberInTheRange<ConfigurationForValidationTest>(
                      instance,
                      propertyName,
                      range,
                      rangeInclusive,
                      type,
                      canBeNotInformed
                    );

                  // Assert, Then

                  expect(receivedErrors.length).toBe(0);
                }
        });
        test('Esperado erro: Aceita vazio: NÃO. Valor vazio: SIM.', () => {
          // Arrange, Given

          const canBeNotInformed = false;
          const emptyValues = [null, undefined];

          const rangeValues: [number | undefined, number | undefined][] = [
            [-100, undefined],
            [undefined, +100],
            [-100, +100]
          ];
          const rangeInclusiveValues: [boolean, boolean][] = [
            [false, false],
            [true, false],
            [false, true],
            [true, true]
          ];
          const typesValues: Array<'integer' | 'decimal'> = [
            'integer',
            'decimal'
          ];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const range of rangeValues)
            for (const rangeInclusive of rangeInclusiveValues)
              for (const type of typesValues)
                for (const emptyValue of emptyValues) {
                  instance[propertyName] = emptyValue;

                  const expectedError = `${
                    ConfigurationForValidationTest.name
                  }.${propertyName} must be a ${type} number, but found: ${String(
                    emptyValue
                  )}`;

                  // Act, When

                  const receivedErrors =
                    JsonLoader.mustBeNumberInTheRange<ConfigurationForValidationTest>(
                      instance,
                      propertyName,
                      range,
                      rangeInclusive,
                      type,
                      canBeNotInformed
                    );

                  // Assert, Then

                  expect(receivedErrors.length).toBe(1);
                  expect(receivedErrors[0]).toBe(expectedError);
                }
        });
        test('Esperado erro: Aceita vazio: SIM e NÃO. Valor vazio: NÃO. Valor de tipo inválido: SIM, string', () => {
          // Arrange, Given

          const wrongTypeValue = Math.random().toString();

          const canBeNotInformedValues = [true, false];
          const rangeValues: [number | undefined, number | undefined][] = [
            [-100, undefined],
            [undefined, +100],
            [-100, +100]
          ];
          const rangeInclusiveValues: [boolean, boolean][] = [
            [false, false],
            [true, false],
            [false, true],
            [true, true]
          ];
          const typesValues: Array<'integer' | 'decimal'> = [
            'integer',
            'decimal'
          ];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues)
            for (const range of rangeValues)
              for (const rangeInclusive of rangeInclusiveValues)
                for (const type of typesValues) {
                  instance[propertyName] = wrongTypeValue;

                  const validTypes = [`${type} number`];
                  if (canBeNotInformed) {
                    validTypes.push(String(null), String(undefined));
                  }
                  const expectedError = `${
                    ConfigurationForValidationTest.name
                  }.${propertyName} must be a ${validTypes.join(
                    ' or '
                  )}, but found: (${typeof wrongTypeValue}) ${
                    typeof wrongTypeValue === 'string'
                      ? `"${wrongTypeValue}"`
                      : String(wrongTypeValue)
                  }`;

                  // Act, When

                  const receivedErrors =
                    JsonLoader.mustBeNumberInTheRange<ConfigurationForValidationTest>(
                      instance,
                      propertyName,
                      range,
                      rangeInclusive,
                      type,
                      canBeNotInformed
                    );

                  // Assert, Then

                  expect(receivedErrors.length).toBe(1);
                  expect(receivedErrors[0]).toBe(expectedError);
                }
        });
        test('Esperado erro: Aceita vazio: SIM e NÃO. Valor vazio: NÃO. Valor de tipo inválido: SIM, decimal', () => {
          // Arrange, Given

          const wrongTypeValue = Math.random().toString();

          const canBeNotInformedValues = [true, false];
          const rangeValues: [number | undefined, number | undefined][] = [
            [-100, undefined],
            [undefined, +100],
            [-100, +100]
          ];
          const rangeInclusiveValues: [boolean, boolean][] = [
            [false, false],
            [true, false],
            [false, true],
            [true, true]
          ];
          const type = 'integer';

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues)
            for (const range of rangeValues)
              for (const rangeInclusive of rangeInclusiveValues) {
                instance[propertyName] = wrongTypeValue;

                const validTypes = [`${type} number`];
                if (canBeNotInformed) {
                  validTypes.push(String(null), String(undefined));
                }
                const expectedError = `${
                  ConfigurationForValidationTest.name
                }.${propertyName} must be a ${validTypes.join(
                  ' or '
                )}, but found: (${typeof wrongTypeValue}) ${
                  typeof wrongTypeValue === 'string'
                    ? `"${wrongTypeValue}"`
                    : String(wrongTypeValue)
                }`;

                // Act, When

                const receivedErrors =
                  JsonLoader.mustBeNumberInTheRange<ConfigurationForValidationTest>(
                    instance,
                    propertyName,
                    range,
                    rangeInclusive,
                    type,
                    canBeNotInformed
                  );

                // Assert, Then

                expect(receivedErrors.length).toBe(1);
                expect(receivedErrors[0]).toBe(expectedError);
              }
        });
        test('decimal, menor que', () => {
          // Arrange, Given

          const minValue = undefined;
          const maxValue = Math.random() * 1000 + 1;
          const tests: [boolean, number][] = [
            [true, maxValue - 0.1],
            [true, maxValue - 1],
            [false, maxValue],
            [false, maxValue + 0.1],
            [false, maxValue + 1]
          ];

          const type = 'decimal';
          const rangeInclusive: [boolean, boolean] = [false, false];
          const canBeNotInformedValues = [true, false];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues)
            for (const test of tests) {
              const isRight = test[0];
              instance[propertyName] = test[1];

              const violation = 'less than';
              const expectedError = `${ConfigurationForValidationTest.name}.${propertyName} must be ${violation} ${maxValue}, but found: (number) ${instance[propertyName]}`;

              // Act, When

              const receivedErrors =
                JsonLoader.mustBeNumberInTheRange<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  [minValue, maxValue],
                  rangeInclusive,
                  type,
                  canBeNotInformed
                );

              // Assert, Then

              if (isRight) {
                expect(receivedErrors.length).toBe(0);
              } else {
                expect(receivedErrors.length).toBe(1);
                expect(receivedErrors[0]).toBe(expectedError);
              }
            }
        });
        test('decimal, menor igual que', () => {
          // Arrange, Given

          const minValue = undefined;
          const maxValue = Math.random() * 1000 + 1;
          const tests: [boolean, number][] = [
            [true, maxValue - 0.1],
            [true, maxValue - 1],
            [true, maxValue],
            [false, maxValue + 0.1],
            [false, maxValue + 1]
          ];

          const type = 'decimal';
          const rangeInclusive: [boolean, boolean] = [false, true];
          const canBeNotInformedValues = [true, false];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues)
            for (const test of tests) {
              const isRight = test[0];
              instance[propertyName] = test[1];

              const violation = 'less than or equal';
              const expectedError = `${ConfigurationForValidationTest.name}.${propertyName} must be ${violation} ${maxValue}, but found: (number) ${instance[propertyName]}`;

              // Act, When

              const receivedErrors =
                JsonLoader.mustBeNumberInTheRange<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  [minValue, maxValue],
                  rangeInclusive,
                  type,
                  canBeNotInformed
                );

              // Assert, Then

              if (isRight) {
                expect(receivedErrors.length).toBe(0);
              } else {
                expect(receivedErrors.length).toBe(1);
                expect(receivedErrors[0]).toBe(expectedError);
              }
            }
        });
        test('decimal, maior que', () => {
          // Arrange, Given

          const minValue = Math.random() * 1000 + 1;
          const maxValue = undefined;
          const tests: [boolean, number][] = [
            [false, minValue - 0.1],
            [false, minValue - 1],
            [false, minValue],
            [true, minValue + 0.1],
            [true, minValue + 1]
          ];

          const type = 'decimal';
          const rangeInclusive: [boolean, boolean] = [false, false];
          const canBeNotInformedValues = [true, false];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues)
            for (const test of tests) {
              const isRight = test[0];
              instance[propertyName] = test[1];

              const violation = 'greater than';
              const expectedError = `${ConfigurationForValidationTest.name}.${propertyName} must be ${violation} ${minValue}, but found: (number) ${instance[propertyName]}`;

              // Act, When

              const receivedErrors =
                JsonLoader.mustBeNumberInTheRange<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  [minValue, maxValue],
                  rangeInclusive,
                  type,
                  canBeNotInformed
                );

              // Assert, Then

              if (isRight) {
                expect(receivedErrors.length).toBe(0);
              } else {
                expect(receivedErrors.length).toBe(1);
                expect(receivedErrors[0]).toBe(expectedError);
              }
            }
        });
        test('decimal, maior igual que', () => {
          // Arrange, Given

          const minValue = Math.random() * 1000 + 1;
          const maxValue = undefined;
          const tests: [boolean, number][] = [
            [false, minValue - 0.1],
            [false, minValue - 1],
            [true, minValue],
            [true, minValue + 0.1],
            [true, minValue + 1]
          ];

          const type = 'decimal';
          const rangeInclusive: [boolean, boolean] = [true, false];
          const canBeNotInformedValues = [true, false];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues)
            for (const test of tests) {
              const isRight = test[0];
              instance[propertyName] = test[1];

              const violation = 'greater than or equal';
              const expectedError = `${ConfigurationForValidationTest.name}.${propertyName} must be ${violation} ${minValue}, but found: (number) ${instance[propertyName]}`;

              // Act, When

              const receivedErrors =
                JsonLoader.mustBeNumberInTheRange<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  [minValue, maxValue],
                  rangeInclusive,
                  type,
                  canBeNotInformed
                );

              // Assert, Then

              if (isRight) {
                expect(receivedErrors.length).toBe(0);
              } else {
                expect(receivedErrors.length).toBe(1);
                expect(receivedErrors[0]).toBe(expectedError);
              }
            }
        });
        test('integer, menor que', () => {
          // Arrange, Given

          const minValue = undefined;
          const maxValue = Math.random() * 1000 + 0.1;
          const tests: [boolean, number][] = [
            [true, Math.floor(maxValue) - 1],
            [true, Math.floor(maxValue)],
            [false, Math.floor(maxValue) + 1],
            [false, Math.floor(maxValue) + 2]
          ];

          const type = 'integer';
          const rangeInclusive: [boolean, boolean] = [false, false];
          const canBeNotInformedValues = [true, false];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues)
            for (const test of tests) {
              const isRight = test[0];
              instance[propertyName] = test[1];

              const violation = 'less than';
              const expectedError = `${ConfigurationForValidationTest.name}.${propertyName} must be ${violation} ${maxValue}, but found: (number) ${instance[propertyName]}`;

              // Act, When

              const receivedErrors =
                JsonLoader.mustBeNumberInTheRange<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  [minValue, maxValue],
                  rangeInclusive,
                  type,
                  canBeNotInformed
                );

              // Assert, Then

              if (isRight) {
                expect(receivedErrors.length).toBe(0);
              } else {
                expect(receivedErrors.length).toBe(1);
                expect(receivedErrors[0]).toBe(expectedError);
              }
            }
        });
        test('integer, menor igual que', () => {
          // Arrange, Given

          const minValue = undefined;
          const maxValue = Math.floor(Math.random() * 1000);
          const tests: [boolean, number][] = [
            [true, maxValue - 1],
            [true, maxValue],
            [false, maxValue + 1],
            [false, maxValue + 2]
          ];

          const type = 'integer';
          const rangeInclusive: [boolean, boolean] = [false, true];
          const canBeNotInformedValues = [true, false];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues)
            for (const test of tests) {
              const isRight = test[0];
              instance[propertyName] = test[1];

              const violation = 'less than or equal';
              const expectedError = `${ConfigurationForValidationTest.name}.${propertyName} must be ${violation} ${maxValue}, but found: (number) ${instance[propertyName]}`;

              // Act, When

              const receivedErrors =
                JsonLoader.mustBeNumberInTheRange<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  [minValue, maxValue],
                  rangeInclusive,
                  type,
                  canBeNotInformed
                );

              // Assert, Then

              if (isRight) {
                expect(receivedErrors.length).toBe(0);
              } else {
                expect(receivedErrors.length).toBe(1);
                expect(receivedErrors[0]).toBe(expectedError);
              }
            }
        });
        test('integer, maior que', () => {
          // Arrange, Given

          const minValue = Math.random() * 1000 - 0.1;
          const maxValue = undefined;
          const tests: [boolean, number][] = [
            [false, Math.floor(minValue) - 1],
            [false, Math.floor(minValue)],
            [true, Math.floor(minValue) + 1],
            [true, Math.floor(minValue) + 2]
          ];

          const type = 'integer';
          const rangeInclusive: [boolean, boolean] = [false, false];
          const canBeNotInformedValues = [true, false];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues)
            for (const test of tests) {
              const isRight = test[0];
              instance[propertyName] = test[1];

              const violation = 'greater than';
              const expectedError = `${ConfigurationForValidationTest.name}.${propertyName} must be ${violation} ${minValue}, but found: (number) ${instance[propertyName]}`;

              // Act, When

              const receivedErrors =
                JsonLoader.mustBeNumberInTheRange<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  [minValue, maxValue],
                  rangeInclusive,
                  type,
                  canBeNotInformed
                );

              // Assert, Then

              if (isRight) {
                expect(receivedErrors.length).toBe(0);
              } else {
                expect(receivedErrors.length).toBe(1);
                expect(receivedErrors[0]).toBe(expectedError);
              }
            }
        });
        test('integer, maior igual que', () => {
          // Arrange, Given

          const minValue = Math.floor(Math.random() * 1000);
          const maxValue = undefined;
          const tests: [boolean, number][] = [
            [false, minValue - 1],
            [true, minValue],
            [true, minValue + 1],
            [true, minValue + 2]
          ];

          const type = 'integer';
          const rangeInclusive: [boolean, boolean] = [true, false];
          const canBeNotInformedValues = [true, false];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues)
            for (const test of tests) {
              const isRight = test[0];
              instance[propertyName] = test[1];

              const violation = 'greater than or equal';
              const expectedError = `${ConfigurationForValidationTest.name}.${propertyName} must be ${violation} ${minValue}, but found: (number) ${instance[propertyName]}`;

              // Act, When

              const receivedErrors =
                JsonLoader.mustBeNumberInTheRange<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  [minValue, maxValue],
                  rangeInclusive,
                  type,
                  canBeNotInformed
                );

              // Assert, Then

              if (isRight) {
                expect(receivedErrors.length).toBe(0);
              } else {
                expect(receivedErrors.length).toBe(1);
                expect(receivedErrors[0]).toBe(expectedError);
              }
            }
        });
        test('decimal, maior que e menor que', () => {
          // Arrange, Given

          const minValue = Math.random() * 1000 + 1;
          const maxValue = minValue + Math.random() * 1000 + 1;
          const tests: [boolean, number][] = [
            [false, minValue - 0.1],
            [false, minValue],
            [true, minValue + 0.1],
            [true, maxValue - 0.1],
            [false, maxValue],
            [false, maxValue + 0.1]
          ];

          const type = 'decimal';
          const rangeInclusive: [boolean, boolean] = [false, false];
          const canBeNotInformedValues = [true, false];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues)
            for (const test of tests) {
              const isRight = test[0];
              instance[propertyName] = test[1];

              const violationMin = 'greater than';
              const violationMax = 'less than';
              const expectedError = `${ConfigurationForValidationTest.name}.${propertyName} must be ${violationMin} ${minValue} and ${violationMax} ${maxValue}, but found: (number) ${instance[propertyName]}`;
              // Act, When

              const receivedErrors =
                JsonLoader.mustBeNumberInTheRange<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  [minValue, maxValue],
                  rangeInclusive,
                  type,
                  canBeNotInformed
                );

              // Assert, Then

              if (isRight) {
                expect(receivedErrors.length).toBe(0);
              } else {
                expect(receivedErrors.length).toBe(1);
                expect(receivedErrors[0]).toBe(expectedError);
              }
            }
        });
        test('decimal, maior igual que e menor que', () => {
          // Arrange, Given

          const minValue = Math.random() * 1000 + 1;
          const maxValue = minValue + Math.random() * 1000 + 1;
          const tests: [boolean, number][] = [
            [false, minValue - 0.1],
            [true, minValue],
            [true, minValue + 0.1],
            [true, maxValue - 0.1],
            [false, maxValue],
            [false, maxValue + 0.1]
          ];

          const type = 'decimal';
          const rangeInclusive: [boolean, boolean] = [true, false];
          const canBeNotInformedValues = [true, false];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues)
            for (const test of tests) {
              const isRight = test[0];
              instance[propertyName] = test[1];

              const violationMin = 'greater than or equal';
              const violationMax = 'less than';
              const expectedError = `${ConfigurationForValidationTest.name}.${propertyName} must be ${violationMin} ${minValue} and ${violationMax} ${maxValue}, but found: (number) ${instance[propertyName]}`;
              // Act, When

              const receivedErrors =
                JsonLoader.mustBeNumberInTheRange<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  [minValue, maxValue],
                  rangeInclusive,
                  type,
                  canBeNotInformed
                );

              // Assert, Then

              if (isRight) {
                expect(receivedErrors.length).toBe(0);
              } else {
                expect(receivedErrors.length).toBe(1);
                expect(receivedErrors[0]).toBe(expectedError);
              }
            }
        });
        test('decimal, maior que e menor igual que', () => {
          // Arrange, Given

          const minValue = Math.random() * 1000 + 1;
          const maxValue = minValue + Math.random() * 1000 + 1;
          const tests: [boolean, number][] = [
            [false, minValue - 0.1],
            [false, minValue],
            [true, minValue + 0.1],
            [true, maxValue - 0.1],
            [true, maxValue],
            [false, maxValue + 0.1]
          ];

          const type = 'decimal';
          const rangeInclusive: [boolean, boolean] = [false, true];
          const canBeNotInformedValues = [true, false];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues)
            for (const test of tests) {
              const isRight = test[0];
              instance[propertyName] = test[1];

              const violationMin = 'greater than';
              const violationMax = 'less than or equal';
              const expectedError = `${ConfigurationForValidationTest.name}.${propertyName} must be ${violationMin} ${minValue} and ${violationMax} ${maxValue}, but found: (number) ${instance[propertyName]}`;
              // Act, When

              const receivedErrors =
                JsonLoader.mustBeNumberInTheRange<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  [minValue, maxValue],
                  rangeInclusive,
                  type,
                  canBeNotInformed
                );

              // Assert, Then

              if (isRight) {
                expect(receivedErrors.length).toBe(0);
              } else {
                expect(receivedErrors.length).toBe(1);
                expect(receivedErrors[0]).toBe(expectedError);
              }
            }
        });
        test('decimal, maior igual que e menor igual que', () => {
          // Arrange, Given

          const minValue = Math.random() * 1000 + 1;
          const maxValue = minValue + Math.random() * 1000 + 1;
          const tests: [boolean, number][] = [
            [false, minValue - 0.1],
            [true, minValue],
            [true, minValue + 0.1],
            [true, maxValue - 0.1],
            [true, maxValue],
            [false, maxValue + 0.1]
          ];

          const type = 'decimal';
          const rangeInclusive: [boolean, boolean] = [true, true];
          const canBeNotInformedValues = [true, false];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues)
            for (const test of tests) {
              const isRight = test[0];
              instance[propertyName] = test[1];

              const violationMin = 'greater than or equal';
              const violationMax = 'less than or equal';
              const expectedError = `${ConfigurationForValidationTest.name}.${propertyName} must be ${violationMin} ${minValue} and ${violationMax} ${maxValue}, but found: (number) ${instance[propertyName]}`;
              // Act, When

              const receivedErrors =
                JsonLoader.mustBeNumberInTheRange<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  [minValue, maxValue],
                  rangeInclusive,
                  type,
                  canBeNotInformed
                );

              // Assert, Then

              if (isRight) {
                expect(receivedErrors.length).toBe(0);
              } else {
                expect(receivedErrors.length).toBe(1);
                expect(receivedErrors[0]).toBe(expectedError);
              }
            }
        });
        test('integer, maior que e menor que', () => {
          // Arrange, Given

          const minValue = Math.floor(Math.random() * 1000);
          const maxValue = Math.floor(minValue + Math.random() * 1000);
          const tests: [boolean, number][] = [
            [false, minValue - 1],
            [false, minValue],
            [true, minValue + 1],
            [true, maxValue - 1],
            [false, maxValue],
            [false, maxValue + 1]
          ];

          const type = 'integer';
          const rangeInclusive: [boolean, boolean] = [false, false];
          const canBeNotInformedValues = [true, false];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues)
            for (const test of tests) {
              const isRight = test[0];
              instance[propertyName] = test[1];

              const violationMin = 'greater than';
              const violationMax = 'less than';
              const expectedError = `${ConfigurationForValidationTest.name}.${propertyName} must be ${violationMin} ${minValue} and ${violationMax} ${maxValue}, but found: (number) ${instance[propertyName]}`;
              // Act, When

              const receivedErrors =
                JsonLoader.mustBeNumberInTheRange<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  [minValue, maxValue],
                  rangeInclusive,
                  type,
                  canBeNotInformed
                );

              // Assert, Then

              if (isRight) {
                expect(receivedErrors.length).toBe(0);
              } else {
                expect(receivedErrors.length).toBe(1);
                expect(receivedErrors[0]).toBe(expectedError);
              }
            }
        });
        test('integer, maior igual que e menor que', () => {
          // Arrange, Given

          const minValue = Math.random() * 1000 + 1;
          const maxValue = minValue + Math.random() * 1000 + 1;
          const tests: [boolean, number][] = [
            [false, minValue - 0.1],
            [true, minValue],
            [true, minValue + 0.1],
            [true, minValue + 0.1],
            [true, maxValue - 0.1],
            [false, maxValue],
            [false, maxValue + 0.1]
          ];

          const type = 'decimal';
          const rangeInclusive: [boolean, boolean] = [true, false];
          const canBeNotInformedValues = [true, false];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues)
            for (const test of tests) {
              const isRight = test[0];
              instance[propertyName] = test[1];

              const violationMin = 'greater than or equal';
              const violationMax = 'less than';
              const expectedError = `${ConfigurationForValidationTest.name}.${propertyName} must be ${violationMin} ${minValue} and ${violationMax} ${maxValue}, but found: (number) ${instance[propertyName]}`;
              // Act, When

              const receivedErrors =
                JsonLoader.mustBeNumberInTheRange<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  [minValue, maxValue],
                  rangeInclusive,
                  type,
                  canBeNotInformed
                );

              // Assert, Then

              if (isRight) {
                expect(receivedErrors.length).toBe(0);
              } else {
                expect(receivedErrors.length).toBe(1);
                expect(receivedErrors[0]).toBe(expectedError);
              }
            }
        });
        test('integer, maior que e menor igual que', () => {
          // Arrange, Given

          const minValue = Math.random() * 1000 + 1;
          const maxValue = minValue + Math.random() * 1000 + 1;
          const tests: [boolean, number][] = [
            [false, minValue - 0.1],
            [false, minValue],
            [true, minValue + 0.1],
            [true, minValue + 0.1],
            [true, maxValue - 0.1],
            [true, maxValue],
            [false, maxValue + 0.1]
          ];

          const type = 'decimal';
          const rangeInclusive: [boolean, boolean] = [false, true];
          const canBeNotInformedValues = [true, false];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues)
            for (const test of tests) {
              const isRight = test[0];
              instance[propertyName] = test[1];

              const violationMin = 'greater than';
              const violationMax = 'less than or equal';
              const expectedError = `${ConfigurationForValidationTest.name}.${propertyName} must be ${violationMin} ${minValue} and ${violationMax} ${maxValue}, but found: (number) ${instance[propertyName]}`;
              // Act, When

              const receivedErrors =
                JsonLoader.mustBeNumberInTheRange<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  [minValue, maxValue],
                  rangeInclusive,
                  type,
                  canBeNotInformed
                );

              // Assert, Then

              if (isRight) {
                expect(receivedErrors.length).toBe(0);
              } else {
                expect(receivedErrors.length).toBe(1);
                expect(receivedErrors[0]).toBe(expectedError);
              }
            }
        });
        test('integer, maior igual que e menor igual que', () => {
          // Arrange, Given

          const minValue = Math.random() * 1000 + 1;
          const maxValue = minValue + Math.random() * 1000 + 1;
          const tests: [boolean, number][] = [
            [false, minValue - 0.1],
            [true, minValue],
            [true, minValue + 0.1],
            [true, minValue + 0.1],
            [true, maxValue - 0.1],
            [true, maxValue],
            [false, maxValue + 0.1]
          ];

          const type = 'decimal';
          const rangeInclusive: [boolean, boolean] = [true, true];
          const canBeNotInformedValues = [true, false];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues)
            for (const test of tests) {
              const isRight = test[0];
              instance[propertyName] = test[1];

              const violationMin = 'greater than or equal';
              const violationMax = 'less than or equal';
              const expectedError = `${ConfigurationForValidationTest.name}.${propertyName} must be ${violationMin} ${minValue} and ${violationMax} ${maxValue}, but found: (number) ${instance[propertyName]}`;
              // Act, When

              const receivedErrors =
                JsonLoader.mustBeNumberInTheRange<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  [minValue, maxValue],
                  rangeInclusive,
                  type,
                  canBeNotInformed
                );

              // Assert, Then

              if (isRight) {
                expect(receivedErrors.length).toBe(0);
              } else {
                expect(receivedErrors.length).toBe(1);
                expect(receivedErrors[0]).toBe(expectedError);
              }
            }
        });
        test('decimal, igual', () => {
          // Arrange, Given

          const minValue = Math.random() * 1000 + 1;
          const maxValue = minValue;
          const tests: [boolean, number][] = [
            [false, minValue - 0.1],
            [true, minValue],
            [false, minValue + 0.1],
            [false, maxValue - 0.1],
            [true, maxValue],
            [false, maxValue + 0.1]
          ];

          const type = 'decimal';
          const rangeInclusive: [boolean, boolean] = [true, true];
          const canBeNotInformedValues = [true, false];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues)
            for (const test of tests) {
              const isRight = test[0];
              instance[propertyName] = test[1];

              const violation = 'equal to';
              const expectedError = `${ConfigurationForValidationTest.name}.${propertyName} must be ${violation} ${minValue}, but found: (number) ${instance[propertyName]}`;
              // Act, When

              const receivedErrors =
                JsonLoader.mustBeNumberInTheRange<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  [minValue, maxValue],
                  rangeInclusive,
                  type,
                  canBeNotInformed
                );

              // Assert, Then

              if (isRight) {
                expect(receivedErrors.length).toBe(0);
              } else {
                expect(receivedErrors.length).toBe(1);
                expect(receivedErrors[0]).toBe(expectedError);
              }
            }
        });
        test('integer, igual', () => {
          // Arrange, Given

          const minValue = Math.floor(Math.random() * 1000);
          const maxValue = minValue;
          const tests: [boolean, number][] = [
            [false, minValue - 1],
            [true, minValue],
            [false, minValue + 1],
            [false, maxValue - 1],
            [true, maxValue],
            [false, maxValue + 1]
          ];

          const type = 'integer';
          const rangeInclusive: [boolean, boolean] = [true, true];
          const canBeNotInformedValues = [true, false];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues)
            for (const test of tests) {
              const isRight = test[0];
              instance[propertyName] = test[1];

              const violation = 'equal to';
              const expectedError = `${ConfigurationForValidationTest.name}.${propertyName} must be ${violation} ${minValue}, but found: (number) ${instance[propertyName]}`;
              // Act, When

              const receivedErrors =
                JsonLoader.mustBeNumberInTheRange<ConfigurationForValidationTest>(
                  instance,
                  propertyName,
                  [minValue, maxValue],
                  rangeInclusive,
                  type,
                  canBeNotInformed
                );

              // Assert, Then

              if (isRight) {
                expect(receivedErrors.length).toBe(0);
              } else {
                expect(receivedErrors.length).toBe(1);
                expect(receivedErrors[0]).toBe(expectedError);
              }
            }
        });
      });
      describe('mustMatchRegex', () => {
        test('Esperado sucesso: Permitido valor vazio: SIM e NÃO. Valor válido: SIM', () => {
          const regexCatchAll = /.*/;
          const value = Math.random();
          const canBeNotInformedValues = [true, false];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues) {
            instance[propertyName] = value;

            // Act, When

            const receivedErros =
              JsonLoader.mustMatchRegex<ConfigurationForValidationTest>(
                instance,
                propertyName,
                regexCatchAll,
                canBeNotInformed
              );

            // Assert, Then

            expect(receivedErros.length).toBe(0);
          }
        });
        test('Esperado sucesso: Permitido valor vazio: SIM. Valor vazio: null, undefined', () => {
          const regexCatchAll = /.*/;
          const values = [null, undefined];
          const canBeNotInformed = true;

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const value of values) {
            instance[propertyName] = value;

            // Act, When

            const receivedErros =
              JsonLoader.mustMatchRegex<ConfigurationForValidationTest>(
                instance,
                propertyName,
                regexCatchAll,
                canBeNotInformed
              );

            // Assert, Then

            expect(receivedErros.length).toBe(0);
          }
        });
        test('Esperado falha: Permitido valor vazio: NÃO. Valor vazio: null, undefined', () => {
          const regex = /.*/;
          const values = [null, undefined];
          const canBeNotInformed = false;

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const value of values) {
            instance[propertyName] = value;

            const description = `format for the regex ${regex.toString()}`;
            const expectedError = `${
              ConfigurationForValidationTest.name
            }.${propertyName} must be a valid ${description}, but found: ${String(
              value
            )}`;

            // Act, When

            const receivedErros =
              JsonLoader.mustMatchRegex<ConfigurationForValidationTest>(
                instance,
                propertyName,
                regex,
                canBeNotInformed
              );

            // Assert, Then

            expect(receivedErros.length).toBe(1);
            expect(receivedErros[0]).toBe(expectedError);
          }
        });
        test('Esperado falha: Permitido valor vazio: SIM e NÃO. Valor válido: NÃO. Exibir descrição da Regex', () => {
          // Arrange, Given

          const regex = /^$/;
          const description = Math.random().toString();
          const value = Math.random();
          const canBeNotInformedValues = [false, true];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues) {
            instance[propertyName] = value;

            const expectedError = `${
              ConfigurationForValidationTest.name
            }.${propertyName} must be a valid ${
              !canBeNotInformed
                ? description
                : [description, String(null), String(undefined)].join(' or ')
            }, but found: (${typeof value}) ${String(value)}`;

            // Act, When

            const receivedErros =
              JsonLoader.mustMatchRegex<ConfigurationForValidationTest>(
                instance,
                propertyName,
                regex,
                canBeNotInformed,
                description
              );

            // Assert, Then

            expect(receivedErros.length).toBe(1);
            expect(receivedErros[0]).toBe(expectedError);
          }
        });
      });
      describe('mustBeValidFormat', () => {
        test('Esperado sucesso: Permitido valor vazio: SIM e NÃO. Valor válido: SIM', () => {
          const evaluateEverTrue = () => true;
          const value = Math.random();
          const canBeNotInformedValues = [true, false];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues) {
            instance[propertyName] = value;

            // Act, When

            const receivedErros =
              JsonLoader.mustBeValidFormat<ConfigurationForValidationTest>(
                instance,
                propertyName,
                evaluateEverTrue,
                canBeNotInformed
              );

            // Assert, Then

            expect(receivedErros.length).toBe(0);
          }
        });
        test('Esperado sucesso: Permitido valor vazio: SIM. Valor vazio: null, undefined', () => {
          const evaluateEverTrue = () => true;
          const values = [null, undefined];
          const canBeNotInformed = true;

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const value of values) {
            instance[propertyName] = value;

            // Act, When

            const receivedErros =
              JsonLoader.mustBeValidFormat<ConfigurationForValidationTest>(
                instance,
                propertyName,
                evaluateEverTrue,
                canBeNotInformed
              );

            // Assert, Then

            expect(receivedErros.length).toBe(0);
          }
        });
        test('Esperado falha: Permitido valor vazio: NÃO. Valor vazio: null, undefined', () => {
          const evaluateEverTrue = () => true;
          const values = [null, undefined];
          const canBeNotInformed = false;

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const value of values) {
            instance[propertyName] = value;

            const description = `format`;
            const expectedError = `${
              ConfigurationForValidationTest.name
            }.${propertyName} must be a valid ${description}, but found: ${String(
              value
            )}`;

            // Act, When

            const receivedErros =
              JsonLoader.mustBeValidFormat<ConfigurationForValidationTest>(
                instance,
                propertyName,
                evaluateEverTrue,
                canBeNotInformed
              );

            // Assert, Then

            expect(receivedErros.length).toBe(1);
            expect(receivedErros[0]).toBe(expectedError);
          }
        });
        test('Esperado falha: Permitido valor vazio: SIM e NÃO. Valor válido: NÃO. Exibir descrição do formato', () => {
          // Arrange, Given

          const evaluateEverFalse = () => false;
          const description = Math.random().toString();
          const value = Math.random();
          const canBeNotInformedValues = [false, true];

          const instance = new ConfigurationForValidationTest();
          const propertyName: keyof ConfigurationForValidationTest = 'property';

          for (const canBeNotInformed of canBeNotInformedValues) {
            instance[propertyName] = value;

            const expectedError = `${
              ConfigurationForValidationTest.name
            }.${propertyName} must be a valid ${
              !canBeNotInformed
                ? description
                : [description, String(null), String(undefined)].join(' or ')
            }, but found: (${typeof value}) ${String(value)}`;

            // Act, When

            const receivedErros =
              JsonLoader.mustBeValidFormat<ConfigurationForValidationTest>(
                instance,
                propertyName,
                evaluateEverFalse,
                canBeNotInformed,
                description
              );

            // Assert, Then

            expect(receivedErros.length).toBe(1);
            expect(receivedErros[0]).toBe(expectedError);
          }
        });
      });
    });
  });
  describe('Nome da configuração', function () {
    test('Por padrão usa o nome da classe da instância.', () => {
      // Arrange, Given

      const sut = new ConfigurationForValidationTest();
      const defaultName = ConfigurationForValidationTest.name;

      // Act, When

      const receivedName = sut.getName();

      // Assert, Then

      expect(receivedName).toBe(defaultName);
    });
    test('Deve poder trocar o nome', () => {
      // Arrange, Given

      const sut = new ConfigurationForValidationTest();
      const defaultName = ConfigurationForValidationTest.name;
      const newName = Math.random().toString();

      // Act, When

      sut.setName(newName);
      const receivedName = sut.getName();

      // Assert, Then

      expect(receivedName).not.toBe(defaultName);
      expect(receivedName).toBe(newName);
    });
    test('Deve indicar o nome de todos ancestrais', () => {
      // Arrange, Given

      const sut = new ConfigurationForNameA();
      const expectedName = `${ConfigurationForNameA.name}.${nameForConfigurationForNameB}`;

      // Act, When

      const receivedName = sut.property2.getFullName();

      // Assert, Then

      expect(receivedName).toBe(expectedName);
    });
    test('O nome deve ser usado na mensagem de erro.', () => {
      // Arrange, Given

      const newName = Math.random().toString();

      const instance = new ConfigurationForValidationTest();
      const propertyName = 'property';

      // Act, When

      instance.setName(newName);
      const receivedErrors =
        JsonLoader.mustBeBoolean<ConfigurationForValidationTest>(
          instance,
          propertyName
        ).toString();

      // Assert, Then

      expect(receivedErrors).toContain(newName);
    });
    test('O nome deve ser mantido sem carregar JSON', () => {
      // Arrange, Given

      const nameForConfigurationForNameA = Math.random().toString();
      const instance = new ConfigurationForNameA().setName(
        nameForConfigurationForNameA
      );

      // Act, When

      const receivedErrors = instance.errors().toString();

      // Assert, Then

      expect(receivedErrors).toContain(nameForConfigurationForNameA);
      expect(receivedErrors).toContain(nameForConfigurationForNameB);
    });
    test('O nome deve ser mantido após carregar JSON', () => {
      // Arrange, Given

      const nameForConfigurationForNameA = Math.random().toString();
      const json = {
        property1: null,
        property2: {
          property3: null
        }
      };
      const instance = new ConfigurationForNameA(json)
        .setName(nameForConfigurationForNameA)
        .initialize();

      // Act, When

      const receivedErrors = instance.errors().toString();

      // Assert, Then

      expect(receivedErrors).toContain(nameForConfigurationForNameA);
      expect(receivedErrors).toContain(nameForConfigurationForNameB);
      expect(receivedErrors).not.toContain(ConfigurationForNameA.name);
      expect(receivedErrors).not.toContain(ConfigurationForNameB.name);
    });
    test('Os nomes das configurações devem ser concatenadas se parent for informado', () => {
      // Arrange, Given

      const nameForConfigurationForNameA = Math.random().toString();
      const json = {
        property1: null,
        property2: {
          property3: null
        }
      };
      const instance = new ConfigurationForNameA(json)
        .setName(nameForConfigurationForNameA)
        .initialize();

      // Act, When

      const receivedErrors = instance.errors().toString();

      // Assert, Then

      expect(receivedErrors).toContain(
        `${nameForConfigurationForNameA}.${nameForConfigurationForNameB}`
      );
      expect(receivedErrors).not.toContain(ConfigurationForNameA.name);
      expect(receivedErrors).not.toContain(ConfigurationForNameB.name);
    });
    test('Os nomes das configurações não devem ser concatenadas se parent não é informado', () => {
      // Arrange, Given

      const nameForConfigurationForNameD = Math.random().toString();
      const json = {
        property1: null,
        property2: {
          property3: null
        }
      };
      const instance = new ConfigurationForNameD(json)
        .setName(nameForConfigurationForNameD)
        .initialize();

      // Act, When

      const receivedErrors = instance.errors().toString();

      // Assert, Then

      expect(receivedErrors).toContain(nameForConfigurationForNameD);
      expect(receivedErrors).toContain(nameForConfigurationForNameB2);
      expect(receivedErrors).not.toContain(
        `${nameForConfigurationForNameD}.${nameForConfigurationForNameB2}`
      );
      expect(receivedErrors).not.toContain(ConfigurationForNameA.name);
      expect(receivedErrors).not.toContain(ConfigurationForNameB.name);
    });
  });
  describe('testes com valores reais', () => {
    test('mustBeUuidOrNotInformed', () => {
      // Arrange, Given

      const values: [boolean, string | undefined | null][] = [
        [true, null],
        [true, undefined],
        [true, '1ddbf92b-854c-41d2-952f-23d97f185874'],
        [true, '00000000-0000-0000-0000-000000000000'],
        [true, 'f0000000-0000-0000-0000-000000000000'],
        [true, 'F0000000-0000-0000-0000-000000000000'],
        [false, 'g0000000-0000-0000-0000-000000000000']
      ];

      for (const test of values) {
        const isValid = test[0];
        const value = test[1];

        const json = new TestConfiguration<string | undefined | null>();
        json.property = value;

        // Act, When

        const errors = JsonLoader.mustBeUuidOrNotInformed<
          TestConfiguration<string | undefined | null>
        >(json, 'property');

        // Assert, Then
        expect(errors.length === 0).toBe(isValid);
      }
    });
    test('mustBeDateOrNotInformed', () => {
      // Arrange, Given

      const values: [boolean, string | undefined | null][] = [
        [true, null],
        [true, undefined],
        [true, '2020-01-01'],
        [true, '2020-1-1'],
        [false, '0000-00-00'],
        [false, 'ops'],
        [false, new Date().toString()]
      ];

      for (const test of values) {
        const isValid = test[0];
        const value = test[1];

        const json = new TestConfiguration<string | undefined | null>();
        json.property = value;

        // Act, When

        const errors = JsonLoader.mustBeDateOrNotInformed<
          TestConfiguration<string | undefined | null>
        >(json, 'property');

        // Assert, Then
        expect(errors.length === 0).toBe(isValid);
      }
    });
    test('mustBeDateTimeISOOrNotInformed', () => {
      // Arrange, Given

      const values: [boolean, string | undefined | null][] = [
        [true, null],
        [true, undefined],
        [true, '2022-06-05T16:27:40.792Z'],
        [true, '2022-06-05T16:27:40.792+03:00'],
        [true, '2022-06-05T16:27:40.792-03:00'],
        [false, '0000-00-00T16:27:40.792Z']
      ];

      for (const test of values) {
        const isValid = test[0];
        const value = test[1];

        const json = new TestConfiguration<string | undefined | null>();
        json.property = value;

        // Act, When

        const errors = JsonLoader.mustBeDateTimeISOOrNotInformed<
          TestConfiguration<string | undefined | null>
        >(json, 'property');

        // Assert, Then
        expect(errors.length === 0).toBe(isValid);
      }
    });
  });
});
