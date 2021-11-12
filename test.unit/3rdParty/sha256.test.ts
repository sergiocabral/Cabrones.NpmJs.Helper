import { sha256 } from '../../ts';

describe('sha256', () => {
  test('o hash de saída deve ser o esperado', () => {
    // Arrange, Given

    const wellKnownSha256 = {
      value:
        'valor de entrada com hash de saida conhecido para o proposito deste teste',
      hash: 'eede78d21e995cd1cd5a77fe8309e62b31664ee86470777ee1e2d6a473a5c856'
    };

    // Act, When

    const calculatedHash = sha256(wellKnownSha256.value);

    // Assert, Then

    expect(calculatedHash).toBe(wellKnownSha256.hash);
  })
});
