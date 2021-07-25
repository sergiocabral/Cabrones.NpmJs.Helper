import { NetworkError } from '../../ts';

describe('Classe NetworkError', function () {
  test('Criar uma instância de erro', () => {
    // Arrange, Given

    const inputMessage = Math.random().toString();
    const expectedMessage = `NetworkError: ${inputMessage}`;

    // Act, When

    const throwError = () => {
      throw new NetworkError(inputMessage);
    };

    // Assert, Then

    expect(throwError).toThrowError(expectedMessage);
  });
});
