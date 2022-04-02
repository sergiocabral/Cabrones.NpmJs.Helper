import { HelperNodeJs, InvalidExecutionError } from '../../ts';

describe('Classe HelperNodeJs', () => {
  test('Não deve permitir instanciar', () => {
    // Arrange, Given
    // Act, When

    const instantiate = () => new HelperNodeJs();

    // Assert, Then

    expect(instantiate).toThrowError(InvalidExecutionError);
  });
});
