import { InvalidUserOperationError } from '../../ts/Error/InvalidUserOperationError';

describe('Classe InvalidUserOperationError', function () {
  test('Criar uma instância de erro', () => {
    // Arrange, Given

    const inputMessage = Math.random().toString();
    const expectedMessage = `InvalidUserOperationError: ${inputMessage}`;

    // Act, When

    const throwError = () => {
      throw new InvalidUserOperationError(inputMessage);
    };

    // Assert, Then

    expect(throwError).toThrowError(expectedMessage);
  });
});
