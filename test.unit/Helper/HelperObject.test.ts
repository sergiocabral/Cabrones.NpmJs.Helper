// noinspection JSPrimitiveTypeWrapperUsage,JSUnusedLocalSymbols

import { HelperObject, InvalidExecutionError } from '../../ts';

abstract class ClassBase {
  public propertyBase: string = 'valueBase';
  public propertyOverride: string = 'propertyOverrideBase';
  public abstract propertyAbstract: string;
}
class ClassReal extends ClassBase {
  public override propertyOverride: string = 'valueOverrideReal';
  public propertyAbstract: string = 'valueAbstractReal';
  public propertyReal: string = 'valueReal';
}

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
      text: 'Hello World',
      number: 123,
      boolean: true,
      date: new Date(2011, 11, 11, 11, 11, 11, 11),
      recursive1: null as any,
      inner: {
        recursive2: null as any
      },
      func: function () {
        return 'func return';
      }
    };
    instanceWithRecursive.recursive1 = instanceWithRecursive;
    instanceWithRecursive.inner.recursive2 = instanceWithRecursive;

    // Act, When

    const text = HelperObject.toText(instanceWithRecursive);

    // Assert, Then

    expect(text).toBeDefined();
  });
  test('getMembers() deve retornar propriedades e métodos imediatos', () => {
    // Arrange, Given

    const instance = {
      memberText: 'Hello World',
      memberNumber: 123,
      memberBoolean: true,
      memberDate: new Date(2011, 11, 11, 11, 11, 11, 11),
      memberRecursive1: null as any,
      memberInner: {
        recursive2: null as any
      },
      memberFuncFunction: function () {
        return 'funcFunction return';
      },
      memberFuncArrow: () => {
        return 'funcArrow return';
      }
    };
    instance.memberRecursive1 = instance;
    instance.memberInner.recursive2 = instance;

    // Act, When

    const members = HelperObject.getMembers(instance);

    // Assert, Then

    expect(members.size).toBe(8);
    expect(members.get('memberText')).toBe('string');
    expect(members.get('memberNumber')).toBe('number');
    expect(members.get('memberBoolean')).toBe('boolean');
    expect(members.get('memberDate')).toBe('object');
    expect(members.get('memberRecursive1')).toBe('object');
    expect(members.get('memberInner')).toBe('object');
    expect(members.get('memberFuncFunction')).toBe('function');
    expect(members.get('memberFuncArrow')).toBe('function');
  });
  test('getMembers() retorna vazio se instância é vazia', () => {
    // Arrange, Given

    const instance = {};

    // Act, When

    const members = HelperObject.getMembers(instance);

    // Assert, Then

    expect(members.size).toBe(0);
  });
  test('getMembers() retorna propriedades de Object se definir deep=true', () => {
    // Arrange, Given

    const instance = {};

    // Act, When

    const members = HelperObject.getMembers(instance, true);

    // Assert, Then

    expect(members.size).toBeGreaterThan(0);
  });
  test('getMembers() retorna vazio se instância é vazia e usar deep=true e ignoreObjectMembers=true', () => {
    // Arrange, Given

    const instance = {};

    // Act, When

    const members = HelperObject.getMembers(instance, true, true);

    // Assert, Then

    expect(members.size).toBe(0);
  });
  test('getMembers() retorna propriedades da instância exceto de Object se deep=true e ignoreObjectMembers=true', () => {
    // Arrange, Given

    const object = new Object();
    const objectMembers = HelperObject.getMembers(object, true);

    const instance = new Date();

    // Act, When

    const members = HelperObject.getMembers(instance, true, true);

    // Assert, Then

    expect(members.size).toBeGreaterThan(0);
    for (const objectMember of objectMembers) {
      expect(members.has(objectMember[0])).toBe(false);
    }
  });
  test('getMembers() propriedades da heranças não são afetadas com deep=true', () => {
    // Arrange, Given

    const instance = new ClassReal();

    // Act, When

    const members = HelperObject.getMembers(instance);

    // Assert, Then

    expect(members.has('propertyBase')).toBe(true);
    expect(members.has('propertyOverride')).toBe(true);
    expect(members.has('propertyAbstract')).toBe(true);
    expect(members.has('propertyReal')).toBe(true);
  });
  test('getFunctionSignature() retorna vazio para algo que não seja função', () => {
    // Arrange, Given

    const noFunctions: unknown[] = ['string', {}, new Date(), null, undefined];

    for (const noFunction of noFunctions) {
      // Act, When

      const signature = HelperObject.getFunctionSignature(noFunction);

      // Assert, Then

      expect(signature).toBe('');
    }
  });
  test('getFunctionSignature() retorna a assinatura para native function sem parâmetros', () => {
    // Arrange, Given

    const func = {}.toString;

    // Act, When

    const signature = HelperObject.getFunctionSignature(func);

    // Assert, Then

    expect(signature).toBe('toString()');
  });
  test('getFunctionSignature() retorna a assinatura para function sem parâmetros', () => {
    // Arrange, Given

    const func = function MyFunctionName() {};

    // Act, When

    const signature = HelperObject.getFunctionSignature(func);

    // Assert, Then

    expect(signature).toBe('MyFunctionName()');
  });
  test('getFunctionSignature() retorna a assinatura para arrow function sem parâmetros', () => {
    // Arrange, Given

    const func = () => {};

    // Act, When

    const signature = HelperObject.getFunctionSignature(func);

    // Assert, Then

    expect(signature).toBe('()');
  });
  test('getFunctionSignature() retorna a assinatura para native function com parâmetros', () => {
    // Arrange, Given

    const func = {}.hasOwnProperty;

    // Act, When

    const signature = HelperObject.getFunctionSignature(func);

    // Assert, Then

    expect(signature).toBe('hasOwnProperty()');
  });
  test('getFunctionSignature() retorna a assinatura para function com parâmetros', () => {
    // Arrange, Given

    const func = function MyFunctionName(arg1: string, arg2: number = 10) {};

    // Act, When

    const signature = HelperObject.getFunctionSignature(func);

    // Assert, Then

    expect(signature).toBe('MyFunctionName(arg1, arg2 = 10)');
  });
  test('getFunctionSignature() retorna a assinatura para arrow function com parâmetros', () => {
    // Arrange, Given

    const func = (arg1: string, arg2: number = 10) => {};

    // Act, When

    const signature = HelperObject.getFunctionSignature(func);

    // Assert, Then

    expect(signature).toBe('(arg1, arg2 = 10)');
  });
});
