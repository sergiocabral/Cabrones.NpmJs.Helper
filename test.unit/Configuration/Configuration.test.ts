import { Configuration, NotImplementedError } from '../../ts';

const propertyDefaultValue = Math.random();

class ConfigurationTest extends Configuration {
  property = propertyDefaultValue;
  errors(): string[] {
    return [];
  }
}

describe('Class Configuration', () => {
  afterEach(() => jest.useRealTimers());

  test('Se não chamar initialize() após criar deve falhar', async () => {
    // Arrange, Given

    jest.useFakeTimers();

    // Act, When

    new ConfigurationTest();

    // Assert, Then

    let error: Error | undefined;
    try {
      jest.advanceTimersByTime(1);
      error = undefined;
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error instanceof NotImplementedError).toBe(true);
  });

  test('Se chamar initialize() após criar não deve falhar', async () => {
    // Arrange, Given

    jest.useFakeTimers();

    // Act, When

    new ConfigurationTest().initialize();

    // Assert, Then

    let error: Error | undefined;
    try {
      jest.advanceTimersByTime(1);
      error = undefined;
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeDefined();
  });
  test('Deve usar propriedades com valores padrão se não informar json', () => {
    // Arrange, Given
    // Act, When

    const instance = new ConfigurationTest().initialize();

    // Assert, Then

    expect(instance.property).toBe(propertyDefaultValue);
  });
  test('Deve poder inicializar valores das propriedades', () => {
    // Arrange, Given

    const propertyNewValue = Math.random();
    const json = {
      property: propertyNewValue
    };

    // Act, When

    const instance = new ConfigurationTest(json).initialize();

    // Assert, Then

    expect(instance.property).not.toBe(propertyDefaultValue);
    expect(instance.property).toBe(propertyNewValue);
  });
  test('Chamar initialize() depois da primeira vez não deve surtir efeito', () => {
    // Arrange, Given

    const propertyNewValue1 = Math.random();
    const propertyNewValue2 = Math.random();

    const json = {
      property: propertyNewValue1
    };

    // Act, When

    const instance = new ConfigurationTest(json);
    const read1 = instance.property;
    instance.initialize();
    const read2 = instance.property;
    instance.property = propertyNewValue2;
    instance.initialize();
    const read3 = instance.property;

    // Assert, Then

    expect(read1).toBe(propertyDefaultValue);
    expect(read2).toBe(propertyNewValue1);
    expect(read3).not.toBe(propertyNewValue1);
    expect(read3).toBe(propertyNewValue2);
  });
});
