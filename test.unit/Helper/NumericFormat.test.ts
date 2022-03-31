import { NumericFormat } from '../../ts';

describe('Classe NumericFormat', () => {
  const originals: Record<string, any> = {};

  beforeEach(() => {
    originals['NumericFormat.suffix'] = NumericFormat.suffix;
    originals['NumericFormat.digits'] = NumericFormat.digits;
    originals['NumericFormat.decimal'] = NumericFormat.decimal;
    originals['NumericFormat.miles'] = NumericFormat.miles;
    originals['NumericFormat.prefix'] = NumericFormat.prefix;
    originals['NumericFormat.showPositive'] = NumericFormat.showPositive;
  });

  afterEach(() => {
    NumericFormat.suffix = originals['NumericFormat.suffix'];
    NumericFormat.digits = originals['NumericFormat.digits'];
    NumericFormat.decimal = originals['NumericFormat.decimal'];
    NumericFormat.miles = originals['NumericFormat.miles'];
    NumericFormat.prefix = originals['NumericFormat.prefix'];
    NumericFormat.showPositive = originals['NumericFormat.showPositive'];
  });

  test('As propriedades estáticas deve usar valores padrão americano', () => {
    // Arrange, Given
    // Act, When
    // Assert, Then

    expect(NumericFormat.suffix).toBe('');
    expect(NumericFormat.digits).toBe(2);
    expect(NumericFormat.decimal).toBe('.');
    expect(NumericFormat.miles).toBe(',');
    expect(NumericFormat.prefix).toBe('');
    expect(NumericFormat.showPositive).toBe(false);
  });
  test('Ao criar deve usar as propriedades estáticas como base', () => {
    // Arrange, Given

    NumericFormat.suffix = Math.random().toString();
    NumericFormat.digits = Math.random();
    NumericFormat.decimal = Math.random().toString();
    NumericFormat.miles = Math.random().toString();
    NumericFormat.prefix = Math.random().toString();
    NumericFormat.showPositive = Math.random() * 2 < 1;

    // Act, When

    const instance = new NumericFormat();

    // Assert, Then

    expect(instance.suffix).toBe(NumericFormat.suffix);
    expect(instance.digits).toBe(NumericFormat.digits);
    expect(instance.decimal).toBe(NumericFormat.decimal);
    expect(instance.miles).toBe(NumericFormat.miles);
    expect(instance.prefix).toBe(NumericFormat.prefix);
    expect(instance.showPositive).toBe(NumericFormat.showPositive);
  });
  test('Deve poder definir os valores padrão', () => {
    // Arrange, Given

    const defaults = {
      suffix: Math.random().toString(),
      digits: Math.random(),
      decimal: Math.random().toString(),
      miles: Math.random().toString(),
      prefix: Math.random().toString(),
      showPositive: Math.random() * 2 < 1
    };
    NumericFormat.defaults(defaults);

    // Act, When

    const instance = new NumericFormat();

    // Assert, Then

    expect(instance.suffix).toBe(defaults.suffix);
    expect(instance.digits).toBe(defaults.digits);
    expect(instance.decimal).toBe(defaults.decimal);
    expect(instance.miles).toBe(defaults.miles);
    expect(instance.prefix).toBe(defaults.prefix);
    expect(instance.showPositive).toBe(defaults.showPositive);
  });
  test('Se definir os valores padrão com um objeto vazio não deve surtir nenhum efeito', () => {
    // Arrange, Given

    const originalSuffix = NumericFormat.suffix;
    const originalDigits = NumericFormat.digits;
    const originalDecimal = NumericFormat.decimal;
    const originalMiles = NumericFormat.miles;
    const originalPrefix = NumericFormat.prefix;
    const originalShowPositive = NumericFormat.showPositive;

    // Act, When

    NumericFormat.defaults({});

    // Assert, Then

    expect(NumericFormat.suffix).toBe(originalSuffix);
    expect(NumericFormat.digits).toBe(originalDigits);
    expect(NumericFormat.decimal).toBe(originalDecimal);
    expect(NumericFormat.miles).toBe(originalMiles);
    expect(NumericFormat.prefix).toBe(originalPrefix);
    expect(NumericFormat.showPositive).toBe(originalShowPositive);
  });
  test('Se definir os valores padrão como nulo não deve surtir nenhum efeito', () => {
    // Arrange, Given

    const originalSuffix = NumericFormat.suffix;
    const originalDigits = NumericFormat.digits;
    const originalDecimal = NumericFormat.decimal;
    const originalMiles = NumericFormat.miles;
    const originalPrefix = NumericFormat.prefix;
    const originalShowPositive = NumericFormat.showPositive;

    // Act, When

    NumericFormat.defaults(null as any);

    // Assert, Then

    expect(NumericFormat.suffix).toBe(originalSuffix);
    expect(NumericFormat.digits).toBe(originalDigits);
    expect(NumericFormat.decimal).toBe(originalDecimal);
    expect(NumericFormat.miles).toBe(originalMiles);
    expect(NumericFormat.prefix).toBe(originalPrefix);
    expect(NumericFormat.showPositive).toBe(originalShowPositive);
  });
  test('Deve montar uma instância de formato sem modificar as fontes', () => {
    // Arrange, Given

    const source = { prefix: Math.random().toString() };
    const originalSourceAsText = JSON.stringify(source);
    const originalStaticAsText = JSON.stringify(new NumericFormat());

    // Act, When

    const result = NumericFormat.get(source);
    const resultAsText = JSON.stringify(result);

    // Assert, Then

    expect(JSON.stringify(source)).toBe(originalSourceAsText);
    expect(JSON.stringify(new NumericFormat())).toBe(originalStaticAsText);
    expect(resultAsText).not.toBe(originalSourceAsText);
    expect(resultAsText).not.toBe(originalStaticAsText);
    expect(result.prefix).toBe(source.prefix);
    expect(result.prefix).not.toBe(NumericFormat.prefix);
  });
});
