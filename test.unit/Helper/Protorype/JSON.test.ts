// noinspection JSUnusedLocalSymbols

import { HelperObject } from '../../../ts';

describe('Prototype para JSON', () => {
  const originals: Record<string, any> = {};

  beforeEach(() => {
    originals['HelperObject.toText'] = HelperObject.toText;
    originals['HelperObject.describe'] = HelperObject.describe;
  });

  afterEach(() => {
    HelperObject.toText = originals['HelperObject.toText'];
    HelperObject.describe = originals['HelperObject.describe'];
  });

  describe('Funções devem corresponder a mesma função em HelperObject', () => {
    test('toText', () => {
      // Arrange, Given

      const func = (HelperObject.toText = jest.fn(
        (instance: unknown, space?: undefined | string | number) => ''
      ));
      const arg1 = Math.random();
      const arg2 = Math.random().toString();

      // Act, When

      JSON.stringify2(arg1, arg2);

      // Assert, Then

      expect(func).toBeCalledTimes(1);
      expect(func.mock.calls[0][0]).toBe(arg1);
      expect(func.mock.calls[0][1]).toBe(arg2);
    });
    test('describe', () => {
      // Arrange, Given

      const func = (HelperObject.describe = jest.fn(
        (
          instance: unknown,
          deep = true,
          ignoreObjectMembers = false,
          filter?: (name: string, type: string) => boolean
        ) => ''
      ));
      const arg1 = Math.random();
      const arg2 = Math.floor(Math.random() * 10) % 2 === 0;
      const arg3 = Math.floor(Math.random() * 10) % 2 === 0;
      const arg4 = () => false;

      // Act, When

      JSON.describe(arg1, arg2, arg3, arg4);

      // Assert, Then

      expect(func).toBeCalledTimes(1);
      expect(func.mock.calls[0][0]).toBe(arg1);
      expect(func.mock.calls[0][1]).toBe(arg2);
      expect(func.mock.calls[0][2]).toBe(arg3);
      expect(func.mock.calls[0][3]).toBe(arg4);
    });
  });
});
