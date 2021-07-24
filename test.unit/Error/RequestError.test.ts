import { RequestError } from '../../ts/Error/RequestError';

describe('Classe RequestError', function () {
  test('Criar uma instância de erro', () => {
    // Arrange, Given

    const inputMessage = Math.random().toString();
    const expectedMessage = `RequestError: ${inputMessage}`;

    // Act, When

    const throwError = () => {
      throw new RequestError(inputMessage);
    };

    // Assert, Then

    expect(throwError).toThrowError(expectedMessage);
  });
});
