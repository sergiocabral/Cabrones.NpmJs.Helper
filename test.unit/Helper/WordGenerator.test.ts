import { InvalidExecutionError, WordGenerator } from '../../ts';

describe('Classe WordGenerator', () => {
  const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
  const consonants = Array('z'.charCodeAt(0) - 'a'.charCodeAt(0) + 1)
    .fill(undefined)
    .map((value, index) => String.fromCharCode('a'.charCodeAt(0) + index))
    .filter(letter => !vowels.includes(letter));

  test('Não deve permitir instanciar', () => {
    // Arrange, Given
    // Act, When

    const instantiate = () => new WordGenerator();

    // Assert, Then

    expect(instantiate).toThrowError(InvalidExecutionError);
  });

  test('getWord deve usar sílabas pronunciáveis', () => {
    // Arrange, Given

    const expectedSyllableMinimumLength = 2;
    const expectedSyllableMaximumLength = 4;

    // Act, When

    const OneSyllable = WordGenerator.getWord(1, false);

    // Assert, Then

    const firstLetter = OneSyllable[0];
    const lastLetter = OneSyllable[OneSyllable.length - 1];

    expect(consonants.includes(firstLetter)).toBe(true);
    expect(vowels.includes(lastLetter)).toBe(true);
    expect(OneSyllable.length).toBeGreaterThanOrEqual(
      expectedSyllableMinimumLength
    );
    expect(OneSyllable.length).toBeLessThanOrEqual(
      expectedSyllableMaximumLength
    );
  });

  test('getWord deve pode especificar inicial maiúscula', () => {
    // Arrange, Given

    // Act, When

    const asUppercase = WordGenerator.getWord(1, true);
    const asLowercase = WordGenerator.getWord(1, false);

    // Assert, Then

    const asUppercaseFirstLetter = asUppercase[0];
    const asLowercaseFirstLetter = asLowercase[0];

    expect(asUppercaseFirstLetter).not.toBe(
      asUppercaseFirstLetter.toLowerCase()
    );
    expect(asLowercaseFirstLetter).toBe(asLowercaseFirstLetter.toLowerCase());
  });

  test('getWord deve poder especificar o total de sílabas', () => {
    // Arrange, Given

    const syllablesCount = Math.floor(Math.random() * 100);

    const acceptablePercentDeviation = 0.5;

    const expectePercentOfThreeLetter = 0.2;
    const expectedSyllablesMinimumLength = 2;
    const expectedSyllablesMaximumLength = 3;
    const expectedWordLength =
      expectedSyllablesMinimumLength *
        (syllablesCount * (1 - expectePercentOfThreeLetter)) +
      expectedSyllablesMaximumLength *
        (syllablesCount * expectePercentOfThreeLetter);

    // Act, When

    const word = WordGenerator.getWord(syllablesCount);

    // Assert, Then

    const wordLengthDeviation = word.length / expectedWordLength;

    expect(wordLengthDeviation).toBeGreaterThanOrEqual(
      1 - acceptablePercentDeviation
    );
    expect(wordLengthDeviation).toBeLessThanOrEqual(
      1 + acceptablePercentDeviation
    );
  });
});
