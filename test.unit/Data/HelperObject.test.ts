// noinspection JSPrimitiveTypeWrapperUsage,JSUnusedLocalSymbols

import { HelperObject, InvalidExecutionError, ResultEvent } from '../../ts';

abstract class ClassBase {
  public thisValue = 123;
  public propertyBase: string = 'valueBase';
  public propertyOverride: string = 'propertyOverrideBase';
  public abstract propertyAbstract: string;
}
class ClassReal extends ClassBase {
  public override propertyOverride: string = 'valueOverrideReal';
  public propertyAbstract: string = 'valueAbstractReal';
  public propertyReal: string = 'valueReal';
}
class ClassWithErrorIntoProperty extends ClassReal {
  public get tryReadMe(): string {
    throw new Error("you can't");
  }
  public get thisGetter(): number {
    return this.thisValue;
  }
}

describe('Classe HelperObject', () => {
  const originals: Record<string, any> = {};

  beforeEach(() => {
    originals['HelperObject.toValue'] = HelperObject.toValue;
    originals['HelperObject.isValue'] = HelperObject.isValue;
    originals['HelperObject.getMembers'] = HelperObject.getMembers;
    originals['HelperObject.getFunctionSignature'] =
      HelperObject.getFunctionSignature;
  });

  afterEach(() => {
    HelperObject.toValue = originals['HelperObject.toValue'];
    HelperObject.isValue = originals['HelperObject.isValue'];
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
  test('describe() deve exibir propriedades com nomes compostos entre aspas', () => {
    // Arrange, Given

    const instance = {
      'composite: name': 'from composite name',
      'composite: arrow': () => {},
      'composite: function': function () {}
    };

    // Act, When

    const described = HelperObject.describe(instance, false, false);

    // Assert, Then

    expect(described.includes('"composite: name"')).toBe(true);
    expect(described.includes('"composite: arrow"')).toBe(true);
    expect(described.includes('"composite: function"')).toBe(true);
  });
  test('describe() lista os membros de uma instância', () => {
    // Arrange, Given

    const instance = {
      memberDate: new Date(2011, 11, 11, 11, 11, 11, 11),
      memberText: 'Hello World',
      funcArrow: (arg1: number = 20) => {},
      funcFunction: function OtherName(arg1: number = 20) {},
      valueNull: null,
      valueUndefined: undefined,
      'composite: property': 'from composite name',
      'composite: arrow': (arg1: number = 20) => {},
      'composite: func': function OtherName(arg1: number = 20) {}
    };

    // Act, When

    const described = HelperObject.describe(instance, false, false);

    // Assert, Then

    expect(described).toBe(
      `Properties:
- "composite: property" : string
- memberDate : object, Date
- memberText : string
- valueNull : object, null
- valueUndefined : undefined
Methods:
- "composite: arrow"(arg1 = 20)
- "composite: func"(arg1 = 20)
- funcArrow(arg1 = 20)
- funcFunction(arg1 = 20)`
    );
  });
  describe('setProperty e getProperty', () => {
    test('setProperty deve poder definir uma nova propriedade', () => {
      // Arrange, Given

      const instance = {};
      const propertyName = Math.random().toString();
      const propertyValue = Math.random();

      // Act, When

      HelperObject.setProperty(instance, propertyName, propertyValue);

      // Assert, Then

      expect(Object.keys(instance)[0]).toBe(propertyName);
      expect(Object.values(instance)[0]).toBe(propertyValue);
    });
    test('setProperty deve poder substituir uma propriedade', () => {
      // Arrange, Given

      const originalValue = Math.random();
      const newValue = Math.random();
      const instance = {
        value: originalValue
      };

      // Act, When

      HelperObject.setProperty(instance, 'value', newValue);

      // Assert, Then

      expect(instance.value).not.toBe(originalValue);
      expect(instance.value).toBe(newValue);
    });
    test('setProperty deve retornar a mesma instância de entrada', () => {
      // Arrange, Given

      const inputInstance = {};

      // Act, When

      const outputInstance = HelperObject.setProperty(
        inputInstance,
        'any',
        'any'
      );

      // Assert, Then

      expect(outputInstance).toBe(inputInstance);
    });
    test('getProperty deve retornar uma propriedade de uma instância', () => {
      // Arrange, Given

      const instance = {
        value: Symbol()
      };

      // Act, When

      const existentValue = HelperObject.getProperty(instance, 'value');
      const nonExistentValue = HelperObject.getProperty(instance, 'value2');

      // Assert, Then

      expect(existentValue).toBe(instance.value);
      expect(nonExistentValue).not.toBeDefined();
    });
  });
  describe('triggerEvent', function () {
    test('deve executar todas as funções da lista', async () => {
      // Arrange, Given

      const listener = (success: boolean, data?: number) => {
        receivedValues.push([success, data]);
      };

      const eventArray: ResultEvent<number>[] = [listener, listener, listener];

      const originalValue: [boolean, number] = [true, Math.random()];

      const receivedValues: [boolean, number?][] = [];

      // Act, When

      await HelperObject.triggerEvent(
        eventArray,
        originalValue[0],
        originalValue[1]
      );

      // Assert, Then

      expect(receivedValues.length).toBe(eventArray.length);
      for (const receivedValue of receivedValues) {
        expect(receivedValue[0]).toBe(originalValue[0]);
        expect(receivedValue[1]).toBe(originalValue[1]);
      }
    });
    test('deve retorna a mesma quanidade de resultados que as funções da lista', async () => {
      // Arrange, Given

      const listener = () => {};
      const eventArray: ResultEvent<number>[] = [listener, listener, listener];

      // Act, When

      const results = await HelperObject.triggerEvent(
        eventArray,
        true,
        Math.random()
      );

      // Assert, Then

      expect(results.length).toBe(eventArray.length);
    });
    test('deve retornar os erros para funções que deram erros', async () => {
      // Arrange, Given

      const error = 'error';
      const listenerNoError = () => {};
      const listenerWithError = () => {
        throw error;
      };

      const eventArray: ResultEvent<number>[] = [
        listenerNoError,
        listenerWithError,
        listenerNoError,
        listenerWithError
      ];

      // Act, When

      const results = await HelperObject.triggerEvent(
        eventArray,
        true,
        Math.random()
      );

      // Assert, Then

      expect(results[0]).toBeUndefined();
      expect(results[1]).toBe(error);
      expect(results[2]).toBeUndefined();
      expect(results[3]).toBe(error);
    });
    test('deve para no primeiro erro se for especificado', async () => {
      // Arrange, Given

      const runWithErrors = false;

      const listenerNoError = () => {};
      const listenerWithError = () => {
        throw 'error';
      };

      const eventArray: ResultEvent<number>[] = [
        listenerNoError,
        listenerWithError,
        listenerWithError
      ];

      // Act, When

      const results = await HelperObject.triggerEvent(
        eventArray,
        true,
        Math.random(),
        runWithErrors
      );

      // Assert, Then

      expect(results.length).toBe(2);
      expect(results[0]).toBeUndefined();
      expect(results[1]).toBeDefined();
    });
  });
  describe('HelperObject.areEquals', () => {
    test('verificação de valores null ou undefined', async () => {
      // Arrange, Given

      const emptyValues = [null, undefined];

      for (const emptyValue of emptyValues) {
        // Act, When

        const result = HelperObject.areEquals(emptyValue, emptyValue);

        // Assert, Then

        expect(result).toBe(true);
      }
    });
    test('verificação de valores primitivos iguais', async () => {
      // Arrange, Given

      const primitiveValues = [
        Math.random(), // Number
        Math.random().toString(), // String
        Math.floor(Math.random() * 1000) % 2 === 0 // Boolean
      ];

      for (const primitiveValue of primitiveValues) {
        // Act, When

        const result = HelperObject.areEquals(primitiveValue, primitiveValue);

        // Assert, Then

        expect(result).toBe(true);
      }
    });
    test('verificação de valores primitivos', async () => {
      // Arrange, Given

      const primitiveValues1 = [
        Math.random(), // Number
        Math.random().toString(), // String
        Math.floor(Math.random() * 1000) % 2 === 0 // Boolean
      ];

      const primitiveValues2 = [
        Math.random(), // Number
        Math.random().toString(), // String
        !primitiveValues1[primitiveValues1.length - 1]
      ];

      for (
        let i = 0;
        i < primitiveValues1.length && i < primitiveValues2.length;
        i++
      ) {
        const value1 = primitiveValues1[i];
        const value2 = primitiveValues2[i];

        // Act, When

        const result = HelperObject.areEquals(value1, value2);

        // Assert, Then

        expect(result).toBe(false);
      }
    });
    test('verificação de valores de data', async () => {
      // Arrange, Given

      const date1a = new Date(Math.random() * 1000000000000);
      const date1b = new Date(date1a.getTime());
      const date2 = new Date(Math.random() * 1000000000000);

      // Act, When

      const expectedTrue = HelperObject.areEquals(date1a, date1b);
      const expectedFalse = HelperObject.areEquals(date1a, date2);

      // Assert, Then

      expect(date1a).not.toBe(date1b);
      expect(expectedTrue).toBe(true);
      expect(expectedFalse).toBe(false);
    });
    test('verificação de valores de outros tipos', async () => {
      // Arrange, Given

      const value1a = {
        prop1: Math.random(),
        prop2: Math.random().toString()
      };
      const value1b = JSON.parse(JSON.stringify(value1a));
      const value2 = {
        prop2: value1a.prop2,
        prop1: value1a.prop1
      };

      // Act, When

      const expectedTrue = HelperObject.areEquals(value1a, value1b);
      const expectedFalse = HelperObject.areEquals(value1a, value2);

      // Assert, Then

      expect(value1a).not.toBe(value1b);
      expect(expectedTrue).toBe(true);
      expect(expectedFalse).toBe(false);
    });
  });
  describe('isValue', () => {
    test('valores', () => {
      // Arrange, Given

      const values = [
        Math.random(),
        NaN,
        Infinity,
        Math.random().toString(),
        Math.floor(Math.random() * 100 + 100) % 2 === 0,
        new Date(),
        new Date(Number.MIN_SAFE_INTEGER)
      ];

      for (const value of values) {
        // Act, When

        const isValue = HelperObject.isValue(value);

        // Assert, Then

        expect(isValue).toBe(true);
      }
    });
    test('não valores', () => {
      // Arrange, Given

      const nonValues = [{}, null, undefined];

      for (const nonValue of nonValues) {
        // Act, When

        const isNonValue = HelperObject.isValue(nonValue) === false;

        // Assert, Then

        expect(isNonValue).toBe(true);
      }
    });
  });
  describe('isValidValue', () => {
    test('valores válidos', () => {
      // Arrange, Given

      const validValues = [
        Math.random(),
        Math.random().toString(),
        Math.floor(Math.random() * 100 + 100) % 2 === 0
      ];

      for (const validValue of validValues) {
        // Act, When

        const isValid = HelperObject.isValidValue(validValue);

        // Assert, Then

        expect(isValid).toBe(true);
      }
    });
    test('data válida é valor válido', () => {
      // Arrange, Given

      const dateValue = new Date();

      // Act, When

      const isValid = HelperObject.isValidValue(dateValue);

      // Assert, Then

      expect(isValid).toBe(true);
    });
    test('data inválida não é valor válido', () => {
      // Arrange, Given

      const dateValue = new Date(Number.MAX_SAFE_INTEGER);

      // Act, When

      const isValid = HelperObject.isValidValue(dateValue);

      // Assert, Then

      expect(isValid).toBe(false);
    });
    test('números não finitos não é válido', () => {
      // Arrange, Given

      const invalidNumbers = [NaN, Infinity];

      for (const invalidNumber of invalidNumbers) {
        // Act, When

        const isValid = HelperObject.isValidValue(invalidNumber);

        // Assert, Then

        expect(isValid).toBe(false);
      }
    });
    test('valores inválidos', () => {
      // Arrange, Given

      const invalidValues = [
        new Date(Number.MIN_SAFE_INTEGER),
        {},
        NaN,
        Infinity,
        null,
        undefined
      ];

      for (const invalidValue of invalidValues) {
        // Act, When

        const isInvalid = HelperObject.isValidValue(invalidValue) === false;

        // Assert, Then

        expect(isInvalid).toBe(true);
      }
    });
  });
  describe('isEmptyValue', () => {
    test('valores vazios', () => {
      // Arrange, Given

      const emptyValues = [null, undefined];

      for (const emptyValue of emptyValues) {
        // Act, When

        const isEmpty = HelperObject.isEmptyValue(emptyValue);

        // Assert, Then

        expect(isEmpty).toBe(true);
      }
    });
    test('valores não vazios', () => {
      // Arrange, Given

      const nonEmptyValues = [
        new Date(),
        {},
        NaN,
        Infinity,
        Math.random(),
        Math.random().toString(),
        Math.floor(Math.random() * 100 + 100) % 2 === 0
      ];

      for (const nonEmptyValue of nonEmptyValues) {
        // Act, When

        const isNonEmptyValue =
          HelperObject.isEmptyValue(nonEmptyValue) === false;

        // Assert, Then

        expect(isNonEmptyValue).toBe(true);
      }
    });
  });
  describe('toValue', () => {
    test('string: entrada é igual a saída', () => {
      // Arrange, Given

      const inputText = Math.random().toString();

      // Act, When

      const value = HelperObject.toValue(inputText);

      // Assert, Then

      expect(value).toBe(inputText);
    });
    test('boolean: entrada é igual a saída', () => {
      // Arrange, Given

      const inputBoolean = (Math.random() * 1000 + 1000) % 2 === 0;

      // Act, When

      const value = HelperObject.toValue(inputBoolean);

      // Assert, Then

      expect(value).toBe(inputBoolean);
    });
    test('number finito: entrada é igual a saída', () => {
      // Arrange, Given

      const inputFiniteNumber = Math.random();

      // Act, When

      const value = HelperObject.toValue(inputFiniteNumber);

      // Assert, Then

      expect(value).toBe(inputFiniteNumber);
    });
    test('number infinito: retorno é undefined', () => {
      // Arrange, Given

      const inputInfiniteNumber = Infinity;

      // Act, When

      const value = HelperObject.toValue(inputInfiniteNumber);

      // Assert, Then

      expect(value).toBeUndefined();
    });
    test('number não número: retorno é undefined', () => {
      // Arrange, Given

      const inputNotANumber = NaN;

      // Act, When

      const value = HelperObject.toValue(inputNotANumber);

      // Assert, Then

      expect(value).toBeUndefined();
    });
    test('Date: retorna em formato texto ISO', () => {
      // Arrange, Given

      const inputDate = new Date();

      // Act, When

      const value = HelperObject.toValue(inputDate);

      // Assert, Then

      expect(value).toBe(inputDate.toISOString());
    });
    test('Date inválida: retorna undefined', () => {
      // Arrange, Given

      const inputInvalidDate = new Date(Number.MIN_SAFE_INTEGER);

      // Act, When

      const value = HelperObject.toValue(inputInvalidDate);

      // Assert, Then

      expect(value).toBeUndefined();
    });
    test('undefined: retorna undefined', () => {
      // Arrange, Given

      const inputUndefined = undefined;

      // Act, When

      const value = HelperObject.toValue(inputUndefined);

      // Assert, Then

      expect(value).toBeUndefined();
    });
    test('null: retorna undefined', () => {
      // Arrange, Given

      const inputNull = null;

      // Act, When

      const value = HelperObject.toValue(inputNull);

      // Assert, Then

      expect(value).toBeUndefined();
    });
    test('objeto que tem toString(): retorna objeto como texto', () => {
      // Arrange, Given

      const inputObjectWithToString = [
        Math.random(),
        Math.random(),
        Math.random()
      ];

      // Act, When

      const value = HelperObject.toValue(inputObjectWithToString);

      // Assert, Then

      expect(value).toBe(inputObjectWithToString.toString());
      expect(value).not.toBe({}.toString());
    });
    test('objeto genérico: retorna objeto como JSON', () => {
      // Arrange, Given

      const inputGenericObject = {
        property: Math.random()
      };

      // Act, When

      const value = HelperObject.toValue(inputGenericObject);

      // Assert, Then

      expect(value).toBe(JSON.stringify(inputGenericObject));
      expect(value).not.toBe({}.toString());
    });
    test('objeto genérico com referência circular: retorna objeto como JSON', () => {
      // Arrange, Given

      const inputcyClicObject: Record<string, unknown> = {
        property: Math.random()
      };
      const otherObject: Record<string, unknown> = {
        property: Math.random()
      };
      inputcyClicObject['otherObject'] = otherObject;
      otherObject['inputcyClicObject'] = inputcyClicObject;

      // Act, When

      const value = HelperObject.toValue(inputcyClicObject);

      // Assert, Then

      expect(value).toBe(HelperObject.toText(inputcyClicObject, 0));
      expect(value).not.toBe({}.toString());
    });
  });
  describe('flatten', () => {
    test('valor simples retorna como objeto similar a array de 1 item', () => {
      // Arrange, Given

      const simpleValue = Math.random();

      // Act, When

      const flattened = HelperObject.flatten(simpleValue);

      // Assert, Then

      const flattenedKeys = Object.keys(flattened);
      const flattenedValues = Object.values(flattened);

      expect(flattenedKeys.length).toBe(1);
      expect(flattenedKeys[0]).toBe('0');
      expect(flattenedValues[0]).toBe(simpleValue);
    });
    test('array simples retorna como objeto similar a array simples', () => {
      // Arrange, Given

      const simpleArray = [Math.random(), Math.random(), Math.random()];

      // Act, When

      const flattened = HelperObject.flatten(simpleArray);

      // Assert, Then

      const flattenedKeys = Object.keys(flattened);
      const flattenedValues = Object.values(flattened);

      expect(flattenedKeys.length).toBe(simpleArray.length);
      for (let i = 0; i < simpleArray.length; i++) {
        expect(flattenedKeys.includes(String(i))).toBe(true);
        expect(flattenedValues.includes(simpleArray[i])).toBe(true);
      }
    });
    test('object simples retorna objeto igual', () => {
      // Arrange, Given

      const simpleObject = {
        propertyDate: new Date(),
        propertyNumber: Math.random()
      };

      // Act, When

      const flattened = HelperObject.flatten(simpleObject);

      // Assert, Then

      expect(JSON.stringify(flattened)).toBe(JSON.stringify(simpleObject));
    });
    test('deve usar HelperObject.isValue e HelperObject.toValue para montar valores', () => {
      // Arrange, Given

      const mockIsValue = jest.fn(() => true);
      HelperObject.isValue = mockIsValue;

      const mockToValue = jest.fn();
      HelperObject.toValue = mockToValue;

      const value = Math.random();

      // Act, When

      HelperObject.flatten(value);

      // Assert, Then

      expect(mockIsValue).toBeCalled();
      expect(mockToValue).toBeCalled();
    });
    test('objeto estruturado retorna objeto achatado com propriedades separadas por ponto', () => {
      // Arrange, Given

      const structuredObject = {
        name: {
          first: 'sergio',
          last: 'cabral'
        },
        address: {
          country: 'brazil',
          city: {
            name: 'macae',
            state: 'rj'
          },
          street: {
            name: 'getulio vargas',
            neighborhood: 'neighborhood',
            number: 120,
            postalCode: '27943-382'
          }
        },
        today: new Date()
      };

      // Act, When

      const flattened = HelperObject.flatten(structuredObject);

      // Assert, Then

      const flattenedKeys = Object.keys(flattened);

      expect(flattenedKeys.includes('name.first')).toBe(true);
      expect(flattenedKeys.includes('name.last')).toBe(true);
      expect(flattenedKeys.includes('address.country')).toBe(true);
      expect(flattenedKeys.includes('address.city.name')).toBe(true);
      expect(flattenedKeys.includes('address.city.state')).toBe(true);
      expect(flattenedKeys.includes('address.street.name')).toBe(true);
      expect(flattenedKeys.includes('address.street.neighborhood')).toBe(true);
      expect(flattenedKeys.includes('address.street.number')).toBe(true);
      expect(flattenedKeys.includes('address.street.postalCode')).toBe(true);
      expect(flattenedKeys.includes('today')).toBe(true);

      expect(flattened['name.first']).toBe(structuredObject.name.first);
      expect(flattened['name.last']).toBe(structuredObject.name.last);
      expect(flattened['address.country']).toBe(
        structuredObject.address.country
      );
      expect(flattened['address.city.name']).toBe(
        structuredObject.address.city.name
      );
      expect(flattened['address.city.state']).toBe(
        structuredObject.address.city.state
      );
      expect(flattened['address.street.name']).toBe(
        structuredObject.address.street.name
      );
      expect(flattened['address.street.neighborhood']).toBe(
        structuredObject.address.street.neighborhood
      );
      expect(flattened['address.street.number']).toBe(
        structuredObject.address.street.number
      );
      expect(flattened['address.street.postalCode']).toBe(
        structuredObject.address.street.postalCode
      );
      expect(flattened['today']).toBe(structuredObject.today.toISOString());
    });
    test('objeto estruturado com array retorna objeto achatado com propriedades separadas por ponto', () => {
      // Arrange, Given

      const structuredObject = {
        name: {
          first: 'sergio',
          last: 'cabral'
        },
        list: {
          numbers: [Math.random(), Math.random(), Math.random()]
        }
      };

      // Act, When

      const flattened = HelperObject.flatten(structuredObject);

      // Assert, Then

      const flattenedKeys = Object.keys(flattened);

      expect(flattenedKeys.includes('name.first')).toBe(true);
      expect(flattenedKeys.includes('name.last')).toBe(true);
      expect(flattenedKeys.includes('list.numbers.0')).toBe(true);
      expect(flattenedKeys.includes('list.numbers.1')).toBe(true);
      expect(flattenedKeys.includes('list.numbers.2')).toBe(true);

      expect(flattened['name.first']).toBe(structuredObject.name.first);
      expect(flattened['name.last']).toBe(structuredObject.name.last);
      expect(flattened['list.numbers.0']).toBe(
        structuredObject.list.numbers[0]
      );
      expect(flattened['list.numbers.1']).toBe(
        structuredObject.list.numbers[1]
      );
      expect(flattened['list.numbers.2']).toBe(
        structuredObject.list.numbers[2]
      );
    });
  });
});
