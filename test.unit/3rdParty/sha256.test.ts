import { sha256 } from '../../ts';

describe('sha256', () => {
  test('o hash de saída deve ser o esperado', () => {
    // Arrange, Given

    const wellKnownSha256 = {
      'valor de entrada com hash de saida conhecido para o proposito deste teste':
        'eede78d21e995cd1cd5a77fe8309e62b31664ee86470777ee1e2d6a473a5c856'
    };

    for (const valueHash of Object.entries(wellKnownSha256)) {
      // Act, When

      const calculatedHash = sha256(valueHash[0]);

      // Assert, Then

      expect(calculatedHash).toBe(valueHash[1]);
    }
  });

  test('sha256 só recebe como entrada ASCII', () => {
    // Arrange, Given

    const nonAsciiValue = '👽';

    // Act, When

    const invalidCall = () => sha256(nonAsciiValue);

    // Assert, Then

    expect(invalidCall).toThrow('ASCII input expected. Only accept characters in range 0-255.');
  });
});
