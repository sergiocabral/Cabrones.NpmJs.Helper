import { KeyValue } from '../../ts';
import { DateTimeFormat } from '../../ts/Helper/DateTimeFormat';

describe('Classe DateTimeFormat', () => {
  const originals: KeyValue<any> = {};

  beforeEach(() => {
    originals['DateTimeFormat.mask'] = DateTimeFormat.mask;
    originals['DateTimeFormat.day'] = DateTimeFormat.day;
    originals['DateTimeFormat.days'] = DateTimeFormat.days;
    originals['DateTimeFormat.useUTC'] = DateTimeFormat.useUTC;
  });

  afterEach(() => {
    DateTimeFormat.mask = originals['DateTimeFormat.mask'];
    DateTimeFormat.day = originals['DateTimeFormat.day'];
    DateTimeFormat.days = originals['DateTimeFormat.days'];
    DateTimeFormat.useUTC = originals['DateTimeFormat.useUTC'];
  });

  test('As propriedades estáticas deve usar valores padrão americano', () => {
    // Arrange, Given
    // Act, When
    // Assert, Then

    expect(DateTimeFormat.mask).toBe('M/d/y h:m:s');
    expect(DateTimeFormat.day).toBe('day');
    expect(DateTimeFormat.days).toBe('days');
    expect(DateTimeFormat.useUTC).toBe(false);
  });
  test('Ao criar deve usar as propriedades estáticas como base', () => {
    // Arrange, Given

    DateTimeFormat.mask = Math.random().toString();
    DateTimeFormat.day = Math.random().toString();
    DateTimeFormat.days = Math.random().toString();
    DateTimeFormat.useUTC = Math.random() * 2 < 1;

    // Act, When

    const instance = new DateTimeFormat();

    // Assert, Then

    expect(instance.mask).toBe(DateTimeFormat.mask);
    expect(instance.day).toBe(DateTimeFormat.day);
    expect(instance.days).toBe(DateTimeFormat.days);
    expect(instance.useUTC).toBe(DateTimeFormat.useUTC);
  });
  test('Deve poder definir os valores padrão', () => {
    // Arrange, Given

    const defaults = {
      mask: Math.random().toString(),
      day: Math.random().toString(),
      days: Math.random().toString(),
      useUTC: Math.random() * 2 < 1
    };
    DateTimeFormat.defaults(defaults);

    // Act, When

    const instance = new DateTimeFormat();

    // Assert, Then

    expect(instance.mask).toBe(defaults.mask);
    expect(instance.day).toBe(defaults.day);
    expect(instance.days).toBe(defaults.days);
    expect(instance.useUTC).toBe(defaults.useUTC);
  });
  test('Se definir os valores padrão com um objeto vazio não deve surtir nenhum efeito', () => {
    // Arrange, Given

    const originalMask = DateTimeFormat.mask;
    const originalDay = DateTimeFormat.day;
    const originalDays = DateTimeFormat.days;
    const originalUseUTC = DateTimeFormat.useUTC;

    // Act, When

    DateTimeFormat.defaults({});

    // Assert, Then

    expect(DateTimeFormat.mask).toBe(originalMask);
    expect(DateTimeFormat.day).toBe(originalDay);
    expect(DateTimeFormat.days).toBe(originalDays);
    expect(DateTimeFormat.useUTC).toBe(originalUseUTC);
  });
  test('Se definir os valores padrão como nulo não deve surtir nenhum efeito', () => {
    // Arrange, Given

    const originalMask = DateTimeFormat.mask;
    const originalDay = DateTimeFormat.day;
    const originalDays = DateTimeFormat.days;
    const originalUseUTC = DateTimeFormat.useUTC;

    // Act, When

    DateTimeFormat.defaults(null as any);

    // Assert, Then

    expect(DateTimeFormat.mask).toBe(originalMask);
    expect(DateTimeFormat.day).toBe(originalDay);
    expect(DateTimeFormat.days).toBe(originalDays);
    expect(DateTimeFormat.useUTC).toBe(originalUseUTC);
  });
  test('Deve montar uma instância de formato sem modificar as fontes', () => {
    // Arrange, Given

    const source = { mask: Math.random().toString() };
    const originalSourceAsText = JSON.stringify(source);
    const originalStaticAsText = JSON.stringify(new DateTimeFormat());

    // Act, When

    const result = DateTimeFormat.get(source);
    const resultAsText = JSON.stringify(result);

    // Assert, Then

    expect(JSON.stringify(source)).toBe(originalSourceAsText);
    expect(JSON.stringify(new DateTimeFormat())).toBe(originalStaticAsText);
    expect(resultAsText).not.toBe(originalSourceAsText);
    expect(resultAsText).not.toBe(originalStaticAsText);
    expect(result.mask).toBe(source.mask);
    expect(result.mask).not.toBe(DateTimeFormat.mask);
  });
});
