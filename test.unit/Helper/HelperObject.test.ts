// noinspection JSPrimitiveTypeWrapperUsage,JSUnusedLocalSymbols

import { HelperObject, InvalidExecutionError, KeyValue } from '../../ts';

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
class ClassWithErrorIntoProperty {
  public thisValue = 123;
  public get tryReadMe(): string {
    throw new Error("you can't");
  }
  public get thisGetter(): number {
    return this.thisValue;
  }
}

describe('Classe HelperObject', () => {
  const originals: KeyValue<any> = {};

  beforeEach(() => {
    originals['HelperObject.getMembers'] = HelperObject.getMembers;
    originals['HelperObject.getFunctionSignature'] =
      HelperObject.getFunctionSignature;
  });

  afterEach(() => {
    HelperObject.getMembers = originals['HelperObject.getMembers'];
    HelperObject.getFunctionSignature =
      originals['HelperObject.getFunctionSignature'];
  });

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
      memberNull: null,
      memberUndefined: undefined,
      memberFakeConstructor: {
        constructor: 'fake constructor'
      },
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

    const members = HelperObject.getMembers(instance, false, false);

    // Assert, Then

    expect(members.size).toBe(11);
    expect(members.get('memberText')![0]).toBe('string');
    expect(members.get('memberText')![1]).toBe('String');
    expect(members.get('memberNumber')![0]).toBe('number');
    expect(members.get('memberNumber')![1]).toBe('Number');
    expect(members.get('memberBoolean')![0]).toBe('boolean');
    expect(members.get('memberBoolean')![1]).toBe('Boolean');
    expect(members.get('memberDate')![0]).toBe('object');
    expect(members.get('memberDate')![1]).toBe('Date');
    expect(members.get('memberNull')![0]).toBe('object');
    expect(members.get('memberNull')![1]).toBe('null');
    expect(members.get('memberUndefined')![0]).toBe('undefined');
    expect(members.get('memberUndefined')![1]).toBe('undefined');
    expect(members.get('memberFakeConstructor')![0]).toBe('object');
    expect(members.get('memberFakeConstructor')![1]).toBe('');
    expect(members.get('memberRecursive1')![0]).toBe('object');
    expect(members.get('memberRecursive1')![1]).toBe('Object');
    expect(members.get('memberInner')![0]).toBe('object');
    expect(members.get('memberInner')![1]).toBe('Object');
    expect(members.get('memberFuncFunction')![0]).toBe('function');
    expect(members.get('memberFuncFunction')![1]).toBe('memberFuncFunction');
    expect(members.get('memberFuncArrow')![0]).toBe('function');
    expect(members.get('memberFuncArrow')![1]).toBe('memberFuncArrow');
  });
  test('getMembers() retorna vazio se instância é vazia', () => {
    // Arrange, Given

    const instance = {};

    // Act, When

    const members = HelperObject.getMembers(instance, false, false);

    // Assert, Then

    expect(members.size).toBe(0);
  });
  test('getMembers() deve usar como padrão deep=true e includeObjectMembers=true', () => {
    // Arrange, Given

    const instance = new Date();

    // Act, When

    const members = HelperObject.getMembers(instance);

    // Assert, Then

    expect(Array.from(members.keys()).includes('toString')).toBe(true);
    expect(Array.from(members.keys()).includes('getTime')).toBe(true);
  });
  test('getMembers() retorna propriedades de Object se definir deep=true', () => {
    // Arrange, Given

    const instance = {};

    // Act, When

    const members = HelperObject.getMembers(instance, true, true);

    // Assert, Then

    expect(members.size).toBeGreaterThan(0);
  });
  test('getMembers() retorna vazio se instância é vazia e usar deep=true e includeObjectMembers=false', () => {
    // Arrange, Given

    const instance = {};

    // Act, When

    const members = HelperObject.getMembers(instance, true, false);

    // Assert, Then

    expect(members.size).toBe(0);
  });
  test('getMembers() retorna propriedades da instância exceto de Object se deep=true e includeObjectMembers=false', () => {
    // Arrange, Given

    const object = new Object();
    const objectMembers = HelperObject.getMembers(object, true, true);

    const instance = new Date();

    // Act, When

    const members = HelperObject.getMembers(instance, true, false);

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

    const members = HelperObject.getMembers(instance, true, true);

    // Assert, Then

    expect(members.has('propertyBase')).toBe(true);
    expect(members.has('propertyOverride')).toBe(true);
    expect(members.has('propertyAbstract')).toBe(true);
    expect(members.has('propertyReal')).toBe(true);
  });
  test('getMembers() não deve falhar se a leitura do objeto falhar', () => {
    // Arrange, Given

    const instance = new ClassWithErrorIntoProperty();

    // Act, When

    const tryRead = () => HelperObject.getMembers(instance, true, true);

    // Assert, Then

    expect(tryRead).not.toThrow();
  });
  test('getMembers() exibe tipo Error se a leitura da propriedade falhar', () => {
    // Arrange, Given

    const instance = new ClassWithErrorIntoProperty();

    // Act, When

    const members = HelperObject.getMembers(instance, true, true);

    // Assert, Then

    expect(members.get('tryReadMe')![0]).toBe('object');
    expect(members.get('tryReadMe')![1]).toBe('Error');
  });
  test('getMembers() deve fazer bind dos getter para o caso de usarem this', () => {
    // Arrange, Given

    const instance = new ClassWithErrorIntoProperty();

    // Act, When

    const members = HelperObject.getMembers(instance, true, true);

    // Assert, Then

    expect(members.get('thisGetter')![0]).toBe('number');
    expect(members.get('thisGetter')![1]).toBe('Number');
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
    const nativeCodeFlag = '/* [native code] */';

    // Act, When

    const signature = HelperObject.getFunctionSignature(func);

    // Assert, Then

    expect(signature).toBe(`toString(${nativeCodeFlag})`);
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
    const nativeCodeFlag = '/* [native code] */';

    // Act, When

    const signature = HelperObject.getFunctionSignature(func);

    // Assert, Then

    expect(signature).toBe(`hasOwnProperty(${nativeCodeFlag})`);
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
  test('describe() deve usar HelperObject.getMembers para obter lista de propriedades', () => {
    // Arrange, Given

    const mockGetMembers = jest.fn(
      (instance: unknown, deep: boolean, includeObjectMembers: boolean) =>
        new Map<string, [string, string]>()
    );
    HelperObject.getMembers = mockGetMembers;

    const arg1 = Math.random();
    const arg2 = Math.floor(Math.random() * 10) % 2 === 0;
    const arg3 = Math.floor(Math.random() * 10) % 2 === 0;

    // Act, When

    HelperObject.describe(arg1, arg2, arg3);

    // Assert, Then

    expect(mockGetMembers).toBeCalledTimes(1);
    expect(mockGetMembers.mock.calls[0][0]).toBe(arg1);
    expect(mockGetMembers.mock.calls[0][1]).toBe(arg2);
    expect(mockGetMembers.mock.calls[0][2]).toBe(arg3);
  });
  test('describe() deve usar por padrão deep=true e includeObjectMembers=true', () => {
    // Arrange, Given

    const mockGetMembers = jest.fn(
      (instance: unknown, deep: boolean, includeObjectMembers: boolean) =>
        new Map<string, [string, string]>()
    );
    HelperObject.getMembers = mockGetMembers;

    const expectedArg2 = true;
    const expectedArg3 = true;

    // Act, When

    HelperObject.describe({});

    // Assert, Then

    expect(mockGetMembers).toBeCalledTimes(1);
    expect(mockGetMembers.mock.calls[0][1]).toBe(expectedArg2);
    expect(mockGetMembers.mock.calls[0][2]).toBe(expectedArg3);
  });
  test('describe() deve usar HelperObject.getFunctionSignature para obter assinatura de funções', () => {
    // Arrange, Given

    const mockGetFunctionSignature = jest.fn((func: unknown) => '()');
    HelperObject.getFunctionSignature = mockGetFunctionSignature;

    const instance = {
      func: () => {}
    };

    // Act, When

    HelperObject.describe(instance, false, false);

    // Assert, Then

    expect(mockGetFunctionSignature).toBeCalledTimes(1);
    expect(mockGetFunctionSignature.mock.calls[0][0]).toBe(instance.func);
  });
  test('describe() descreve instância vazia', () => {
    // Arrange, Given

    const instance = {};

    const labelProperties = 'Properties';
    const labelMethods = 'Methods';
    const noneListed = 'none listed';
    const lineSeparator = '\n';
    const expectedDescribed = [
      `${labelProperties}: ${noneListed}`,
      `${labelMethods}: ${noneListed}`
    ].join(lineSeparator);

    // Act, When

    const described = HelperObject.describe(instance, false, false);

    // Assert, Then

    expect(described).toBe(expectedDescribed);
  });
  test('describe() lista os membros em ordem alfabética', () => {
    // Arrange, Given

    const instance = {
      propZ: 'Z',
      propA: 'A',
      funcZ: () => {},
      funcA: () => {}
    };

    // Act, When

    const described = HelperObject.describe(instance, false, false);

    // Assert, Then

    expect(described.indexOf('propA')).toBeGreaterThanOrEqual(0);
    expect(described.indexOf('propA')).toBeLessThan(described.indexOf('propZ'));
    expect(described.indexOf('funcA')).toBeGreaterThanOrEqual(0);
    expect(described.indexOf('funcA')).toBeLessThan(described.indexOf('funcZ'));
  });
  test('describe() lista propriedades com seus tipos', () => {
    // Arrange, Given

    const instance = {
      property: 'value'
    };

    const labelProperties = 'Properties';
    const lineSeparator = '\n';
    const expectedDescribed = [
      `${labelProperties}:`,
      `- ${Object.keys(instance)[0]} : ${typeof Object.values(instance)[0]}`
    ].join(lineSeparator);

    // Act, When

    const described = HelperObject.describe(instance, false, false);

    // Assert, Then

    expect(described.includes(expectedDescribed)).toBe(true);
  });
  test('describe() lista métodos com suas assinaturas', () => {
    // Arrange, Given

    const instance = {
      func: function MyFunction(arg1: string, arg2: number = 10) {}
    };

    const regexFunctionName = /^[^(]*/;
    const labelMethods = 'Methods';
    const lineSeparator = '\n';
    const expectedDescribed = [
      `${labelMethods}:`,
      `- ${HelperObject.getFunctionSignature(
        Object.values(instance)[0]
      ).replace(regexFunctionName, Object.keys(instance)[0])}`
    ].join(lineSeparator);

    // Act, When

    const described = HelperObject.describe(instance, false, false);

    // Assert, Then

    expect(described.includes(expectedDescribed)).toBe(true);
  });
  test('describe() deve usa o nome da função na instância e não o nome original da função', () => {
    // Arrange, Given

    const instance = {
      nameIntoInstance: function OriginalName(
        arg1: string,
        arg2: number = 10
      ) {}
    };
    const expectedName = Object.keys(instance)[0];
    const notExpectedName = instance.nameIntoInstance.name;

    // Act, When

    const described = HelperObject.describe(instance, false, false);

    // Assert, Then

    expect(expectedName?.length).toBeGreaterThan(0);
    expect(notExpectedName?.length).toBeGreaterThan(0);
    expect(described.includes(expectedName)).toBe(true);
    expect(described.includes(notExpectedName)).toBe(false);
  });
  test('describe() lista primeiro propriedades e depois métodos', () => {
    // Arrange, Given

    const labelProperties = 'Properties';
    const labelMethods = 'Methods';

    // Act, When

    const described = HelperObject.describe({}, false, false);

    // Assert, Then

    expect(described.indexOf(labelProperties)).toBeGreaterThanOrEqual(0);
    expect(described.indexOf(labelProperties)).toBeLessThan(
      described.indexOf(labelMethods)
    );
  });
  test('describe() deve poder filtrar membros por nome e tipo', () => {
    // Arrange, Given

    const ignoreTypes = ['boolean', 'number'];
    const instance = {
      stringValue: 'string',
      booleanValue: true,
      numberValue: 123,
      ignoreProperty: 'value',
      acceptProperty: 'value',
      ignoreMethod: () => {},
      acceptMethod: () => {}
    };

    // Act, When

    const filter = (name: string, type: string): boolean =>
      !name.includes('ignore') && !ignoreTypes.includes(type);
    const described = HelperObject.describe(instance, true, true, filter);

    // Assert, Then

    expect(described.includes('ignore')).toBe(false);
    expect(described.includes('accept')).toBe(true);
    expect(described.includes('string')).toBe(true);
    for (const ignoreType of ignoreTypes) {
      expect(described.includes(ignoreType)).toBe(false);
    }
  });
  test('describe() lista os membros de uma instância', () => {
    // Arrange, Given

    const instance = {
      memberDate: new Date(2011, 11, 11, 11, 11, 11, 11),
      memberText: 'Hello World',
      funcArrow: (arg1: number = 20) => {},
      funcFunction: function OtherName(arg1: number = 20) {},
      valueNull: null,
      valueUndefined: undefined
    };

    // Act, When

    const described = HelperObject.describe(instance, false, false);

    // Assert, Then

    expect(described).toBe(
      `Properties:
- memberDate : object, Date
- memberText : string, String
- valueNull : object, null
- valueUndefined : undefined
Methods:
- funcArrow(arg1 = 20)
- funcFunction(arg1 = 20)`
    );
  });
});
