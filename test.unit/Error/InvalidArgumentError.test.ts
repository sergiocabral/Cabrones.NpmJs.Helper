import { InvalidArgumentError } from '../../ts/Error/InvalidArgumentError';

describe('Classe InvalidArgumentError', function () {
  test('Criar uma instância de erro', () => {
    // Arrange, Given

    const inputMessage = Math.random().toString();
    const expectedMessage = `InvalidArgumentError: ${inputMessage}`;

    // Act, When

    const throwError = () => {
      throw new InvalidArgumentError(inputMessage);
    };

    // Assert, Then

    expect(throwError).toThrowError(expectedMessage);
  });
});
