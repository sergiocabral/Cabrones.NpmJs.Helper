import { LogLevel } from '../../ts';

describe('Enum LogLevel', () => {
  test('LogLevel deve ter valor numérico começando em zero', () => {
    // Arrange, Given
    // Act, When
    // Assert, Then

    let value = 0;
    expect(LogLevel.Verbose).toBe(value++);
    expect(LogLevel.Debug).toBe(value++);
    expect(LogLevel.Information).toBe(value++);
    expect(LogLevel.Warning).toBe(value++);
    expect(LogLevel.Error).toBe(value++);
    expect(LogLevel.Critical).toBe(value++);
    expect(LogLevel.Fatal).toBe(value++);

    expect(Object.keys(LogLevel).length).toBe(value * 2);
  });
});
