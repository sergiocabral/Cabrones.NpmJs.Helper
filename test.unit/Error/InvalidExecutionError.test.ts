import { InvalidExecutionError } from '../../ts';

describe('Classe InvalidExecutionError', function () {
  test('Criar uma instância de erro', () => {
    // Arrange, Given

    const inputMessage = Math.random().toString();
    const expectedMessage = `InvalidExecutionError: ${inputMessage}`;

    // Act, When

    const throwError = () => {
      throw new InvalidExecutionError(inputMessage);
    };

    // Assert, Then

    expect(throwError).toThrowError(expectedMessage);
  });
});
