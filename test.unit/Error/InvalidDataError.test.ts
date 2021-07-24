import { InvalidDataError } from '../../ts/Error/InvalidDataError';

describe('Classe InvalidDataError', function () {
  test('Criar uma instância de erro', () => {
    // Arrange, Given

    const inputMessage = Math.random().toString();
    const expectedMessage = `InvalidDataError: ${inputMessage}`;

    // Act, When

    const throwError = () => {
      throw new InvalidDataError(inputMessage);
    };

    // Assert, Then

    expect(throwError).toThrowError(expectedMessage);
  });
});
