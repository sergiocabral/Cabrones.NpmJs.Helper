import { NotImplementedError } from '../../ts/Error/NotImplementedError';

describe('Classe NotImplementedError', function () {
  test('Criar uma instância de erro', () => {
    // Arrange, Given

    const inputMessage = Math.random().toString();
    const expectedMessage = `NotImplementedError: ${inputMessage}`;

    // Act, When

    const throwError = () => {
      throw new NotImplementedError(inputMessage);
    };

    // Assert, Then

    expect(throwError).toThrowError(expectedMessage);
  });
});
