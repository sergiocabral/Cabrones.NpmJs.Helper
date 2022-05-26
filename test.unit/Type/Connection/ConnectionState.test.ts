import { ConnectionState } from '../../../ts';

describe('Enum ConnectionState', () => {
  test('ConnectionState deve ter valor numérico começando em zero', () => {
    // Arrange, Given
    // Act, When
    // Assert, Then

    let value = 0;
    expect(ConnectionState.Closed).toBe(value++);
    expect(ConnectionState.Switching).toBe(value++);
    expect(ConnectionState.Ready).toBe(value++);

    expect(Object.keys(ConnectionState).length).toBe(value * 2);
  });
});
