import { CommandLineConfiguration } from '../../ts';

describe('CommandLineConfiguration', () => {
    describe('Valores padrão', () => {
        test('caseInsensitiveForName', () => {
            // Arrange, Given
            const expectedValue = false;
            // Act, When
            const sut = new CommandLineConfiguration();
            // Assert, Then
            expect(sut.caseInsensitiveForName).toBe(expectedValue);
        });
        test('caseInsensitiveForValue', () => {
            // Arrange, Given
            const expectedValue = false;
            // Act, When
            const sut = new CommandLineConfiguration();
            // Assert, Then
            expect(sut.caseInsensitiveForValue).toBe(expectedValue);
        });
        test('attribution', () => {
            // Arrange, Given
            const expectedValue = '=';
            // Act, When
            const sut = new CommandLineConfiguration();
            // Assert, Then
            expect(sut.attribution).toBe(expectedValue);
        });
        test('quotes', () => {
            // Arrange, Given
            const expectedValue: Array<[string, string]> = [
                ['"', '"'],
                ["'", "'"],
                ['`', '`'],
                ['´', '´']
            ];
            // Act, When
            const sut = new CommandLineConfiguration();
            // Assert, Then
            expect(sut.quotes.length).toBe(expectedValue.length);
            for (let i = 0; i < sut.quotes.length; i++) {
                expect(sut.quotes[i]).toStrictEqual(expectedValue[i]);
            }
        });
    });
    test('Não deve poder modificar', () => {

    })
});
