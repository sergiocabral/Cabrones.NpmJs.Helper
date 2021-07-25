import { HelperObject, InvalidExecutionError } from '../../ts';

describe('Classe HelperObject', () => {
  test('Não deve permitir instanciar', () => {
    // Arrange, Given
    // Act, When

    const instantiate = () => new HelperObject();

    // Assert, Then

    expect(instantiate).toThrowError(InvalidExecutionError);
  });

  test('isFunction deve determinar se uma variável é uma função', () => {
    // Arrange, Given

    const isFunction = () => {};
    const isConstructor = String;
    const isValue = 'String';

    // Act, When

    const checkForFunction = HelperObject.isFunction(isFunction);
    const checkForConstructor = HelperObject.isFunction(isConstructor);
    const checkForValue = HelperObject.isFunction(isValue);

    // Assert, Then

    expect(checkForFunction).toBe(true);
    expect(checkForConstructor).toBe(true);
    expect(checkForValue).toBe(false);
  });
});
