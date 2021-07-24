import { EmptyError } from '../../ts/Error/EmptyError';

describe('Classe EmptyError', function () {
  test('Criar uma instância de erro', () => {
    // Arrange, Given

    const inputMessage = Math.random().toString();
    const expectedMessage = `EmptyError: ${inputMessage}`;

    // Act, When

    const throwError = () => {
      throw new EmptyError(inputMessage);
    };

    // Assert, Then

    expect(throwError).toThrowError(expectedMessage);
  });
});
