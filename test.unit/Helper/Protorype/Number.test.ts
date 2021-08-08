import { HelperNumeric, KeyValue } from '../../../ts';

describe('Prototype para Number', () => {
  const originals: KeyValue<any> = {};

  beforeEach(() => {
    originals['HelperNumber.format'] = HelperNumeric.format;
  });

  afterEach(() => {
    HelperNumeric.format = originals['HelperNumber.format'];
  });

  describe('Funções devem corresponder a mesma função em HelperNumber', () => {
    test('format', () => {
      // Arrange, Given
      const func = (HelperNumeric.format = jest.fn());
      // Act, When
      (0).format();
      // Assert, Then
      expect(func).toBeCalledTimes(1);
    });
  });
});
