import { HelperObject, KeyValue } from '../../../ts';

describe('Prototype para JSON', () => {
  const originals: KeyValue<any> = {};

  beforeEach(() => {
    originals['HelperObject.toText'] = HelperObject.toText;
  });

  afterEach(() => {
    HelperObject.toText = originals['HelperObject.toText'];
  });

  describe('Funções devem corresponder a mesma função em HelperObject', () => {
    test('toText', () => {
      // Arrange, Given
      const func = (HelperObject.toText = jest.fn());
      // Act, When
      JSON.stringify2({});
      // Assert, Then
      expect(func).toBeCalledTimes(1);
    });
  });
});
