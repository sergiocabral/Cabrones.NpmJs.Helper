// noinspection JSUnusedLocalSymbols

import {
  JsonLoader,
  NotImplementedError,
  PrimitiveValueTypeName
} from '../../ts';

const propertyDefaultValueNumber = Math.random();
const propertyDefaultValueDate = new Date();
const propertyDefaultValueString = Math.random().toString();
const errorConfigurationTestB = [Math.random().toString()];

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
  property: unknown = null;
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
    });
    describe('Validadores bypass que chamam os validadorede fato', () => {
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
            ].join(' or ')}, but found: ${typeof instance[propertyName]}, ${
              instance[propertyName]
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
      });
      // TODO: Escrever teste para todos os validadores mustBe...
      test('', () => {
        // Arrange, Given
        // Act, When
        // Assert, Then
      });
    });
  });
});
