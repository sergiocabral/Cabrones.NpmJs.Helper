import { HelperList } from '../../ts';

describe('Prototype para Array', () => {
  const originals: Record<string, any> = {};

  beforeEach(() => {
    originals['HelperList.getRandom'] = HelperList.getRandom;
  });

  afterEach(() => {
    HelperList.getRandom = originals['HelperList.getRandom'];
  });

  describe('Funções devem corresponder a mesma função em HelperList', () => {
    test('getRandom', () => {
      // Arrange, Given
      const func = (HelperList.getRandom = jest.fn());
      // Act, When
      Array([]).getRandom();
      // Assert, Then
      expect(func).toBeCalledTimes(1);
    });
  });
});
