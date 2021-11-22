import { HashJson } from '../../ts/Json/HashJson';

describe('HashJson', () => {
  afterEach(() => jest.useRealTimers());

  test('Deve poder definir e ler uma valor baseado no JSON', () => {
    // Arrange, Given

    const anyObject = {
      propNumber: Math.random(),
      propDate: new Date(),
      propText: Math.random().toString(),
      propBoolean: true.toString()
    };
    const otherObjectButSameJson = JSON.parse(JSON.stringify(anyObject));

    var inputObjectAsValue = {};

    var sut = new HashJson<unknown>();

    // Act, When

    sut.set(anyObject, inputObjectAsValue);
    var outputObjectAsValue = sut.get(otherObjectButSameJson);

    // Assert, Then

    expect(outputObjectAsValue).toBe(inputObjectAsValue);
  });

  test('O valor deve permanecer se o tempo não expirou', () => {
    // Arrange, Given

    jest.useFakeTimers();

    const anyObject = {};
    const inputValue = {};
    const expirationTime = Math.round(Math.random() * 100 + 100);

    var sut = new HashJson<unknown>();

    // Act, When

    sut.set(anyObject, inputValue, expirationTime);
    jest.advanceTimersByTime(expirationTime - 1);
    var outputValue = sut.get(anyObject);

    // Assert, Then

    expect(outputValue).toBe(inputValue);
  });

  test('O valor deve ser undefined se o tempo já expirou', () => {
    // Arrange, Given

    jest.useFakeTimers();

    const anyObject = {};
    const inputValue = {};
    const expirationTime = Math.round(Math.random() * 100 + 100);

    var sut = new HashJson<unknown>();

    // Act, When

    sut.set(anyObject, inputValue, expirationTime);
    jest.advanceTimersByTime(expirationTime);
    var outputValue = sut.get(anyObject);

    // Assert, Then

    expect(outputValue).toBeUndefined();
  });

  test('O tempo de expiração deve ser infinito por padrão', () => {
    // Arrange, Given

    jest.useFakeTimers();

    const anyObject = {};
    const inputValue = {};

    var sut = new HashJson<unknown>();

    // Act, When

    sut.set(anyObject, inputValue);
    jest.advanceTimersByTime(Number.MAX_SAFE_INTEGER);
    var outputValue = sut.get(anyObject);

    // Assert, Then

    expect(outputValue).toBe(inputValue);
  });

  test('O tempo de expiração padrão pode ser especificado', () => {
    // Arrange, Given

    jest.useFakeTimers();

    const anyObject = {};
    const expirationTime = Math.round(Math.random() * 100 + 100);

    var sut = new HashJson<unknown>(expirationTime);

    // Act, When

    sut.set(anyObject, {});
    jest.advanceTimersByTime(expirationTime - 1);
    var expectedOutputDefined = sut.get(anyObject);
    jest.advanceTimersByTime(1);
    var expectedOutputUndefined = sut.get(anyObject);

    // Assert, Then

    expect(expectedOutputDefined).toBeDefined();
    expect(expectedOutputUndefined).toBeUndefined();
  });

  test('O tempo de expiração padrão deve ser sobreposto se um tempo de expiração for especificado', () => {
    // Arrange, Given

    jest.useFakeTimers();

    const anyObject = {};
    const expirationTimeAtInitialization = Math.round(
      Math.random() * 100 + 100
    );

    var sut = new HashJson<unknown>(expirationTimeAtInitialization);

    // Act, When

    sut.set(anyObject, {}, expirationTimeAtInitialization + 1);
    jest.advanceTimersByTime(expirationTimeAtInitialization);
    var expectedOutputDefined = sut.get(anyObject);

    // Assert, Then

    expect(expectedOutputDefined).toBeDefined();
  });

  test('Deve ser possível sobreescrever um valor', () => {
    // Arrange, Given

    const anyObject = {};
    const outputValue1 = {};
    const outputValue2 = {};

    var sut = new HashJson<unknown>();

    // Act, When

    sut.set(anyObject, outputValue1);
    sut.set(anyObject, outputValue2);

    var outputValue = sut.get(anyObject);

    // Assert, Then

    expect(outputValue).not.toBe(outputValue1);
    expect(outputValue).toBe(outputValue2);
  });
});
