import { NotEmptyError } from '../../ts';

describe('Classe NotEmptyError', function () {
  test('Criar uma instância de erro', () => {
    // Arrange, Given

    const inputMessage = Math.random().toString();
    const expectedMessage = `NotEmptyError: ${inputMessage}`;

    // Act, When

    const throwError = () => {
      throw new NotEmptyError(inputMessage);
    };

    // Assert, Then

    expect(throwError).toThrowError(expectedMessage);
  });
});
