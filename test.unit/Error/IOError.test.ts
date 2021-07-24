import { IOError } from '../../ts/Error/IOError';

describe('Classe IOError', function () {
  test('Criar uma instância de erro', () => {
    // Arrange, Given

    const inputMessage = Math.random().toString();
    const expectedMessage = `IOError: ${inputMessage}`;

    // Act, When

    const throwError = () => {
      throw new IOError(inputMessage);
    };

    // Assert, Then

    expect(throwError).toThrowError(expectedMessage);
  });
});
