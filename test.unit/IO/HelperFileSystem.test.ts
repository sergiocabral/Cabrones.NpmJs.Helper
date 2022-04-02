import { HelperFileSystem, InvalidExecutionError } from '../../ts';

describe('Classe HelperFileSystem', () => {
  test('Não deve permitir instanciar', () => {
    // Arrange, Given
    // Act, When

    const instantiate = () => new HelperFileSystem();

    // Assert, Then

    expect(instantiate).toThrowError(InvalidExecutionError);
  });
});
