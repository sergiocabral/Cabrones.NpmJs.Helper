import { NotReadyError } from '../../ts/Error/NotReadyError';

describe('Classe NotReadyError', function () {
  test('Criar uma instância de erro', () => {
    // Arrange, Given

    const inputMessage = Math.random().toString();
    const expectedMessage = `NotReadyError: ${inputMessage}`;

    // Act, When

    const throwError = () => {
      throw new NotReadyError(inputMessage);
    };

    // Assert, Then

    expect(throwError).toThrowError(expectedMessage);
  });
});
