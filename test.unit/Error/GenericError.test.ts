import { GenericError } from '../../ts';

describe('Classe GenericError', function () {
  test('Criar uma instância de erro', () => {
    // Arrange, Given

    const inputMessage = Math.random().toString();
    const expectedMessage = `GenericError: ${inputMessage}`;

    // Act, When

    const throwError = () => {
      throw new GenericError(inputMessage);
    };

    // Assert, Then

    expect(throwError).toThrowError(expectedMessage);
  });

  test('Definir o prefixo da mensagem de erro', () => {
    // Arrange, Given

    const prefixMessage = Math.random().toString();
    const inputMessage = Math.random().toString();
    const expectedMessage = `${prefixMessage}: ${inputMessage}`;

    // Act, When

    const throwError = () => {
      throw new GenericError(inputMessage, undefined, prefixMessage);
    };

    // Assert, Then

    expect(throwError).toThrowError(expectedMessage);
  });

  test('Definir um Error originador', () => {
    // Arrange, Given

    const originalError = new Error();

    // Act, When

    const throwError = () => {
      throw new GenericError('error message', originalError);
    };

    // Assert, Then

    try {
      throwError();
    } catch (error) {
      expect((error as GenericError).innerError).toBe(originalError);
    }
  });

  test('Obter o primeiro Error originador', () => {
    // Arrange, Given

    const firstError = new Error();

    const levels = 10;
    let currentError: GenericError | Error = firstError;
    for (let i = 1; i <= levels; i++) {
      currentError = new GenericError(`Error ${i}`, currentError);
    }

    // Act, When

    const throwError = () => {
      throw currentError;
    };

    // Assert, Then

    try {
      throwError();
    } catch (error) {
      expect((error as GenericError).firstError).toBe(firstError);
    }
  });

  test('O primeiro Error originador é a própria instância se houve apenas uma', () => {
    // Arrange, Given

    const error = new GenericError();

    // Act, When

    const firstError = error.firstError;

    // Assert, Then

    expect(firstError).toBe(error);
  });

  test('Descrição do erro não deve ter espaços em branco sobrando', () => {
    // Arrange, Given

    const prefixMark = Math.random().toString();
    const messageMark = Math.random().toString();
    const separatorBetweenPrefixAndMessage = ': ';

    const errorWithPrefixAndMessage = new GenericError(
      `  ${messageMark}  `,
      undefined,
      `  ${prefixMark}  `
    );
    const errorWithSpacedMessageAndPrefix = new GenericError(
      `  `,
      undefined,
      `  ${prefixMark}  `
    );
    const errorWithUndefinedMessageAndPrefix = new GenericError(
      undefined,
      undefined,
      `  ${prefixMark}  `
    );
    const errorWithOnlySpacedMessage = new GenericError(`  `, undefined, `  `);
    const errorWithOnlyUndefinedMessage = new GenericError(
      undefined,
      undefined,
      `  `
    );
    const errorWithOnlyMessage = new GenericError(
      `  ${messageMark}  `,
      undefined,
      `  `
    );
    const errorWithEmptyPrefixAndMessage = new GenericError('', undefined, '');

    // Act, When

    const messageOfErrorWithPrefixAndMessage =
      errorWithPrefixAndMessage.message;
    const messageOfErrorWithSpacedMessageAndPrefix =
      errorWithSpacedMessageAndPrefix.message;
    const messageOfErrorWithUndefinedMessageAndPrefix =
      errorWithUndefinedMessageAndPrefix.message;
    const messageOfErrorWithOnlySpacedMessage =
      errorWithOnlySpacedMessage.message;
    const messageOfErrorWithOnlyUndefinedMessage =
      errorWithOnlyUndefinedMessage.message;
    const messageOfErrorWithOnlyMessage = errorWithOnlyMessage.message;
    const messageOfErrorWithEmptyPrefixAndMessage =
      errorWithEmptyPrefixAndMessage.message;

    // Assert, Then

    expect(messageOfErrorWithPrefixAndMessage).toBe(
      prefixMark + separatorBetweenPrefixAndMessage + messageMark
    );
    expect(messageOfErrorWithSpacedMessageAndPrefix).toBe(prefixMark);
    expect(messageOfErrorWithUndefinedMessageAndPrefix).toBe(prefixMark);
    expect(messageOfErrorWithOnlySpacedMessage).toBe('');
    expect(messageOfErrorWithOnlyUndefinedMessage).toBe('');
    expect(messageOfErrorWithOnlyMessage).toBe(messageMark);
    expect(messageOfErrorWithEmptyPrefixAndMessage).toBe('');
  });
});
