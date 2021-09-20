import { Configuration, NotImplementedError } from '../../ts';

const propertyDefaultValueNumber = Math.random();
const propertyDefaultValueDate = new Date();
const propertyDefaultValueString = Math.random().toString();
const errorConfigurationTestB = [Math.random().toString()];

class ConfigurationTestC extends Configuration {}

class ConfigurationTestB extends Configuration {
  propertyString = propertyDefaultValueString;
  errors(): string[] {
    return errorConfigurationTestB;
  }
}

class ConfigurationTestA extends Configuration {
  propertyNumber = propertyDefaultValueNumber;
  propertyDate = propertyDefaultValueDate;
  propertyConfiguration = new ConfigurationTestB();
}

describe('Class Configuration', () => {
  afterEach(() => jest.useRealTimers());

  test('Se criar se informar JSON não precisa chamar initialize()', async () => {
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
});
