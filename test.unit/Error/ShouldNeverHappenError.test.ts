import { ShouldNeverHappenError } from '../../ts';

describe('Classe ShouldNeverHappenError', function () {
  test('Criar uma instância de erro', () => {
    // Arrange, Given

    const inputMessage = Math.random().toString();
    const expectedMessage = `ShouldNeverHappenError: ${inputMessage}`;

    // Act, When

    const throwError = () => {
      throw new ShouldNeverHappenError(inputMessage);
    };

    // Assert, Then

    expect(throwError).toThrowError(expectedMessage);
  });
});
