import { WordGenerator } from '../../ts';

describe('Classe WordGenerator', () => {
  const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
  const consonants = Array('z'.charCodeAt(0) - 'a'.charCodeAt(0) + 1)
    .fill(undefined)
    .map((value, index) => String.fromCharCode('a'.charCodeAt(0) + index))
    .filter(letter => !vowels.includes(letter));

  test('getWord deve usar sílabas pronunciáveis', () => {
    // Arrange, Given

    const sut = new WordGenerator();
    const expectedSyllableMinimumLength = 2;
    const expectedSyllableMaximumLength = 4;

    // Act, When

    const OneSyllable = sut.getWord(1, false);

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

    const sut = new WordGenerator();
    const asUppercase = sut.getWord(1, true);
    const asLowercase = sut.getWord(1, false);

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

    const sut = new WordGenerator();

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

    const word = sut.getWord(syllablesCount);

    // Assert, Then

    const wordLengthDeviation = word.length / expectedWordLength;

    expect(wordLengthDeviation).toBeGreaterThanOrEqual(
      1 - acceptablePercentDeviation
    );
    expect(wordLengthDeviation).toBeLessThanOrEqual(
      1 + acceptablePercentDeviation
    );
  });

  test('deve poder mudar o universo de caracteres', () => {
    // Arrange, Given

    const sut = new WordGenerator();
    sut.consonants = ['b'];
    sut.vowels = ['a'];
    const expectedAllWords = sut.consonants[0] + sut.vowels[0];

    // Act, When

    const count = 100;
    const words: Record<string, number> = {};
    for (let i = 0; i < count; i++) {
      const word = sut.getWord(1, false);
      words[word] = words[word] === undefined ? 1 : words[word] + 1;
    }

    // Assert, Then

    expect(Object.keys(words)).toEqual([expectedAllWords]);
    expect(words[expectedAllWords]).toBe(count);
  });
});
