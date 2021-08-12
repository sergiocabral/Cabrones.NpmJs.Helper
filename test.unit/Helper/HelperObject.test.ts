// noinspection JSPrimitiveTypeWrapperUsage

import { HelperObject, InvalidExecutionError } from '../../ts';

describe('Classe HelperObject', () => {
  test('Não deve permitir instanciar', () => {
    // Arrange, Given
    // Act, When

    const instantiate = () => new HelperObject();

    // Assert, Then

    expect(instantiate).toThrowError(InvalidExecutionError);
  });

  test('isFunction deve determinar se uma variável é uma função', () => {
    // Arrange, Given

    const isFunction = () => {};
    const isConstructor = String;
    const isValue = 'String';

    // Act, When

    const checkForFunction = HelperObject.isFunction(isFunction);
    const checkForConstructor = HelperObject.isFunction(isConstructor);
    const checkForValue = HelperObject.isFunction(isValue);

    // Assert, Then

    expect(checkForFunction).toBe(true);
    expect(checkForConstructor).toBe(true);
    expect(checkForValue).toBe(false);
  });
  describe('getName() deve obter o nome descritivo do tipo de uma instância', () => {
    test('tipo primitivo retorna o próprio valor', () => {
      // Arrange, Given

      const primitiveString = Math.random().toString();
      const primitiveNumber = Math.random();
      const primitiveBoolean = false;

      // Act, When

      const nameOfPrimitiveString = HelperObject.getName(primitiveString);
      const nameOfPrimitiveNumber = HelperObject.getName(primitiveNumber);
      const nameOfPrimitiveBoolean = HelperObject.getName(primitiveBoolean);

      // Assert, Then

      expect(nameOfPrimitiveString).toBe(String(primitiveString));
      expect(nameOfPrimitiveNumber).toBe(String(primitiveNumber));
      expect(nameOfPrimitiveBoolean).toBe(String(primitiveBoolean));
    });
    test('tipo object retorna o nome do construtor', () => {
      // Arrange, Given

      const objectDate = new Date();
      const objectBoolean = new Boolean();
      const objectString = new String();

      // Act, When

      const nameOfObjectDate = HelperObject.getName(objectDate);
      const nameOfObjectBoolean = HelperObject.getName(objectBoolean);
      const nameOfObjectString = HelperObject.getName(objectString);

      // Assert, Then

      expect(nameOfObjectDate).toBe('Date');
      expect(nameOfObjectBoolean).toBe('Boolean');
      expect(nameOfObjectString).toBe('String');
    });
    test('tipo function retorna o nome da função', () => {
      // Arrange, Given

      const functionFunction = function NameOfFunction() {};
      const functionConstructor = Boolean;

      // Act, When

      const nameOfFunctionFunction = HelperObject.getName(functionFunction);
      const nameOfFunctionConstructor =
        HelperObject.getName(functionConstructor);

      // Assert, Then

      expect(nameOfFunctionFunction).toBe('NameOfFunction');
      expect(nameOfFunctionConstructor).toBe('Boolean');
    });
    test('tipo null ou undefined retorna o o próprio nome', () => {
      // Arrange, Given

      const typeUndefined = undefined;
      const typeNull = null;

      // Act, When

      const nameOfTypeUndefined = HelperObject.getName(typeUndefined);
      const nameOfTypeNull = HelperObject.getName(typeNull);

      // Assert, Then

      expect(nameOfTypeUndefined).toBe('undefined');
      expect(nameOfTypeNull).toBe('null');
    });
    test('tipo json retorna Object', () => {
      // Arrange, Given

      const json = {};

      // Act, When

      const nameOfJson = HelperObject.getName(json);

      // Assert, Then

      expect(nameOfJson).toBe('Object');
    });
  });
  test('eval() deve avaliar um código JavaScript', () => {
    // Arrange, Given

    const date = new Date();
    const dateAsString = date.toISOString();
    const code = `new Date("${dateAsString}").getTime();`;
    const expectedDateTime = date.getTime();

    // Act, When

    const dateTime = HelperObject.eval(code);

    // Assert, Then

    expect(dateTime).toBe(expectedDateTime);
  });
  test('toText() deve converter um objeto qualquer em texto', () => {
    // Arrange, Given

    const instanceWithRecursive = {
      text: "Hello World",
      number: 123,
      boolean: true,
      date: new Date(2011,11,11,11,11,11,11),
      recursive1: null as any,
      inner: {
        recursive2: null as any,
      },
      func: function () { return "func return"; }
    }
    instanceWithRecursive.recursive1 = instanceWithRecursive;
    instanceWithRecursive.inner.recursive2 = instanceWithRecursive;

    // Act, When

    const text = HelperObject.toText(instanceWithRecursive);

    // Assert, Then

    expect(text).toBeDefined();
  })
});
