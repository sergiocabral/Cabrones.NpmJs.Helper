import { Translate, TranslateSet } from '../../ts';

describe('Translate', () => {
  describe('Membros static', () => {
    const originals: Record<string, any> = {};

    beforeEach(() => {
      originals['Translate.default'] = Translate.default;
      originals['Translate.flatten'] = Translate.flatten;
      Translate.default = Object.assign(
        new Translate(),
        JSON.parse(JSON.stringify(Translate.default))
      );
    });

    afterEach(() => {
      Translate.default = originals['Translate.default'];
      Translate.flatten = originals['Translate.flatten'];
    });

    test('Verifica o nome do idioma padrão.', () => {
      // Arrange, Given
      const expectedName = 'default';
      // Act, When
      const returnedName = Translate.defaultLanguageName;
      // Assert, Then
      expect(returnedName).toBe(expectedName);
    });
    test('A instância padrão deve ser criar com construtor sem parâmetros.', () => {
      // Arrange, Given
      const expectedJson = JSON.stringify(new Translate());
      // Act, When
      const returnedJson = JSON.stringify(Translate.default);
      // Assert, Then
      expect(expectedJson).toBe(returnedJson);
    });
    test('Ao criar uma instância não deve substituir o padrão', () => {
      // Arrange, Given
      const initialDefaultInstance = Translate.default;
      // Act, When
      new Translate();
      // Assert, Then
      expect(Translate.default).toBe(initialDefaultInstance);
    });
    test('Ao criar uma instância deve substituir o padrão se for solicitado', () => {
      // Arrange, Given
      const initialDefaultInstance = Translate.default;
      // Act, When
      const newInstance = new Translate('', '', true);
      // Assert, Then
      expect(Translate.default).not.toBe(initialDefaultInstance);
      expect(Translate.default).toBe(newInstance);
    });
    test('Carregar conjunto de idiomas deve usar lógica de Translate.flatten()', () => {
      // Arrange, Given

      const func = jest.fn();
      func.mockReturnValue(new Map<string, string>());
      Translate.flatten = func;

      var sut = new Translate();

      // Act, When

      sut.load({});

      // Assert, Then

      expect(func).toBeCalledTimes(1);
    });
  });

  describe('Membros da instância', () => {
    test('Se não informado o idioma selecionado deve ser o padrão', () => {
      // Arrange, Given

      const defaultLanguage = Translate.defaultLanguageName;

      // Act, When

      var sut = new Translate(defaultLanguage);

      // Assert, Then

      expect(sut.fallbackLanguage).toBe(Translate.defaultLanguageName);
    });
    test('Se não informado o idioma fallback deve ser o selecionado', () => {
      // Arrange, Given

      const selectedLanguage = Math.random().toString();

      // Act, When

      var sut = new Translate(selectedLanguage);

      // Assert, Then

      expect(sut.fallbackLanguage).toBe(selectedLanguage);
    });
    test('Retorna a lista de idiomas', () => {
      // Arrange, Given

      const expectedLanguages = Array(10)
        .fill(2)
        .map(() => Math.random().toString());

      var sut = new Translate();

      // Act, When

      const beforeReturned = sut.availableLanguages;
      for (const expectedLanguage of expectedLanguages) {
        sut.set(
          Math.random().toString(),
          Math.random().toString(),
          expectedLanguage
        );
      }
      const afterReturned = sut.availableLanguages;

      // Assert, Then

      expect(beforeReturned.length).toBe(0);
      expect(afterReturned).toStrictEqual(expectedLanguages);
    });
    test('Carregar conjunto de idiomas', () => {
      // Arrange, Given

      const translationSet: TranslateSet = {
        key1: 'value1',
        section1: {
          key2: 'value2',
          section2: {
            section3: {
              section4: {
                key3: 'value3'
              }
            }
          }
        }
      };

      var sut = new Translate();

      // Act, When

      sut.load(translationSet);

      // Assert, Then

      expect(sut.get('key1')).toBe('value1');
      expect(sut.get('key2')).toBe('value2');
      expect(sut.get('key3')).toBe('value3');
    });
    test('Carregar conjunto de idiomas vazio não deve adicionar idioma na lista', () => {
      // Arrange, Given

      var sut = new Translate();

      // Act, When

      sut.load({});

      // Assert, Then

      expect(sut.availableLanguages.length).toBe(0);
    });
    test('Inclusão de tradução', () => {
      // Arrange, Given

      const language = Math.random().toString();
      const inputKey = Math.random().toString();
      const inputValue = Math.random().toString();

      var sut = new Translate();

      // Act, When

      sut.set(inputKey, inputValue, language);
      const outputValue = sut.get(inputKey, language);
      const outputInOtherLanguage = sut.get(inputKey, Math.random().toString());

      // Assert, Then

      expect(outputValue).toBe(outputValue);
      expect(outputInOtherLanguage).toBe(inputKey);
    });
    test('Inclusão de tradução no idioma esperado', () => {
      // Arrange, Given

      const defaultLanguage = Math.random().toString();
      const otherLanguage = Math.random().toString();
      const inputKey = Math.random().toString();
      const inputValue = Math.random().toString();

      var sut = new Translate(defaultLanguage);

      // Act, When

      sut.set(`${inputKey}#1`, `${inputValue}#1`);
      sut.set(`${inputKey}#2`, `${inputValue}#2`, otherLanguage);

      // Assert, Then

      expect(sut.availableLanguages.length).toBe(2);

      expect(sut.get(`${inputKey}#1`)).toBe(`${inputValue}#1`);
      expect(sut.get(`${inputKey}#1`, defaultLanguage)).toBe(`${inputValue}#1`);
      expect(sut.get(`${inputKey}#1`, otherLanguage)).not.toBe(
        `${inputValue}#1`
      );

      expect(sut.get(`${inputKey}#2`)).not.toBe(`${inputValue}#2`);
      expect(sut.get(`${inputKey}#2`, defaultLanguage)).not.toBe(
        `${inputValue}#2`
      );
      expect(sut.get(`${inputKey}#2`, otherLanguage)).toBe(`${inputValue}#2`);
    });
    test('Leitura de tradução no idioma correspondente', () => {
      // Arrange, Given

      const defaultLanguage = Math.random().toString();
      const otherLanguage = Math.random().toString();

      const inputKeyDefault = Math.random().toString();
      const inputValueDefault = Math.random().toString();

      const inputKeyOther = Math.random().toString();
      const inputValueOther = Math.random().toString();

      var sut = new Translate(defaultLanguage);

      sut.set(inputKeyDefault, inputValueDefault);
      sut.set(inputKeyOther, inputValueOther, otherLanguage);

      // Act, When

      const readFromDefaultWithDefault = sut.get(inputKeyDefault);
      const readFromDefaultWithOther = sut.get(inputKeyDefault, otherLanguage);
      const readFromOtherWithOther = sut.get(inputKeyOther, otherLanguage);
      const readFromOtherWithDefault = sut.get(inputKeyOther);

      // Assert, Then

      expect(readFromDefaultWithDefault).toBe(inputValueDefault);
      expect(readFromDefaultWithOther).toBe(inputKeyDefault);

      expect(readFromOtherWithOther).toBe(inputValueOther);
      expect(readFromOtherWithDefault).toBe(inputKeyOther);
    });
    test('Remover uma tradução', () => {
      // Arrange, Given

      const defaultLanguage = Math.random().toString();
      const otherLanguage = Math.random().toString();

      const inputKeyDefault = Math.random().toString();
      const inputKeyOther = Math.random().toString();

      var sut = new Translate(defaultLanguage);

      sut.set(inputKeyDefault, Math.random().toString());
      sut.set(inputKeyOther, Math.random().toString(), otherLanguage);

      // Act, When

      const returnedForDefault = sut.delete(inputKeyDefault);
      const returnedForOther = sut.delete(inputKeyOther, otherLanguage);
      const returnedForNonexistentLanguage = sut.delete(
        Math.random().toString(),
        otherLanguage
      );
      const returnedForNonexistentKey = sut.delete(Math.random().toString());

      const readFromDefault = sut.get(inputKeyDefault);
      const readFromOther = sut.get(inputKeyOther, otherLanguage);

      // Assert, Then

      expect(readFromDefault).toBe(inputKeyDefault);
      expect(readFromOther).toBe(inputKeyOther);

      expect(returnedForDefault).toBe(true);
      expect(returnedForOther).toBe(true);
      expect(returnedForNonexistentLanguage).toBe(false);
      expect(returnedForNonexistentKey).toBe(false);
    });
    test('Remover a única tradução de um idioma deve remover o idioma', () => {
      // Arrange, Given

      const languageWithOne = Math.random().toString();
      const languageWithTwo = Math.random().toString();

      const inputKey = Math.random().toString();

      var sut = new Translate();

      sut.set(inputKey, Math.random().toString(), languageWithOne);

      sut.set(inputKey, Math.random().toString(), languageWithTwo);
      sut.set(
        Math.random().toString(),
        Math.random().toString(),
        languageWithTwo
      );

      // Act, When

      sut.delete(inputKey, languageWithOne);
      sut.delete(inputKey, languageWithTwo);

      // Assert, Then

      expect(sut.availableLanguages).not.toContain(languageWithOne);
      expect(sut.availableLanguages).toContain(languageWithTwo);
      expect(sut.availableLanguages.length).toBe(1);
    });
    test('Remover um idioma', () => {
      // Arrange, Given

      const language1 = Math.random().toString();
      const language2 = Math.random().toString();

      const inputKey1 = Math.random().toString();
      const inputKey2 = Math.random().toString();

      var sut = new Translate();

      sut.set(inputKey1, Math.random().toString(), language1);
      sut.set(inputKey2, Math.random().toString(), language2);

      // Act, When

      const readKey1Before = sut.get(inputKey1, language1);
      const readKey2Before = sut.get(inputKey2, language2);

      const returnedFromExistent = sut.deleteLanguage(language1);
      const returnedFromNonexistent = sut.deleteLanguage(
        Math.random().toString()
      );

      const readKey1After = sut.get(inputKey1, language1);
      const readKey2After = sut.get(inputKey2, language2);

      // Assert, Then

      expect(readKey1Before).not.toBe(inputKey1);
      expect(readKey2Before).not.toBe(inputKey2);

      expect(readKey1After).toBe(inputKey1);
      expect(readKey2After).not.toBe(inputKey2);

      expect(returnedFromExistent).toBe(true);
      expect(returnedFromNonexistent).toBe(false);
    });
    test('Remover todos os dados', () => {
      // Arrange, Given

      const language1 = Math.random().toString();
      const language2 = Math.random().toString();

      const inputKey1 = Math.random().toString();
      const inputKey2 = Math.random().toString();

      var sut = new Translate();

      sut.set(inputKey1, Math.random().toString(), language1);
      sut.set(inputKey2, Math.random().toString(), language2);

      // Act, When

      const readKey1Before = sut.get(inputKey1, language1);
      const readKey2Before = sut.get(inputKey2, language2);

      sut.deleteAll();

      const readKey1After = sut.get(inputKey1, language1);
      const readKey2After = sut.get(inputKey2, language2);

      // Assert, Then

      expect(readKey1Before).not.toBe(inputKey1);
      expect(readKey2Before).not.toBe(inputKey2);

      expect(readKey1After).toBe(inputKey1);
      expect(readKey2After).toBe(inputKey2);
    });
  });

  describe('Lógica de Translate.flatten', () => {
    test('O json deve ser transformado em lista', () => {
      // Arrange, Given

      const data: TranslateSet = {};

      const count = 10;
      for (let i = 0; i < count; i++) {
        data[Math.random().toString()] = Math.random().toString();
      }

      // Act, When

      const result = Translate.flatten(data);

      // Assert, Then

      expect(result.size).toBe(Object.keys(data).length);

      for (const key in Object.keys(data)) {
        expect(result.get(key)).toBe(data[key]);
      }
    });
    test('Somente valores são incluídos no resultado', () => {
      // Arrange, Given

      const data: TranslateSet = {
        includedString: Math.random().toString(),
        includedNumber: Math.random() as any,
        includedBoolean: true as any,
        includedObject: {},
        includedDate: new Date() as any,
        includedNull: null as any,
        includedUndefined: undefined as any
      };

      // Act, When

      const result = Translate.flatten(data);

      // Assert, Then

      expect(result.get('includedString')).toBeDefined();
      expect(result.get('includedNumber')).toBeDefined();
      expect(result.get('includedBoolean')).toBeDefined();

      expect(result.get('includedObject')).toBeUndefined();
      expect(result.get('includedDate')).toBeUndefined();
      expect(result.get('includedNull')).toBeUndefined();
      expect(result.get('includedUndefined')).toBeUndefined();
    });
    test('Nomes de sub-estruturas não devem ser considerados', () => {
      // Arrange, Given

      const data: TranslateSet = {
        'sub structure': {
          key2: 'value2',
          'sub structure': {
            'sub structure': {
              'sub structure': {
                key3: 'value3'
              }
            }
          }
        },
        key1: 'value1'
      };

      const subStructureName = Object.keys(data)[0];

      // Act, When

      const result = Translate.flatten(data);

      // Assert, Then

      for (const [key, value] of result) {
        expect(key).not.toBe(subStructureName);
        expect(value).not.toBe(subStructureName);
      }
    });
    test('Deve captura valores dentro de sub-estruturas', () => {
      // Arrange, Given

      const data: TranslateSet = {
        'sub structure': {
          keyLevel2: 'valueLevel2',
          'sub structure': {
            'sub structure': {
              'sub structure': {
                keyLevel5: 'valueLevel5'
              }
            }
          }
        },
        keyLevel1: 'valueLevel1'
      };

      // Act, When

      const result = Translate.flatten(data);

      // Assert, Then

      expect(result.get('keyLevel1')).toBe('valueLevel1');
      expect(result.get('keyLevel2')).toBe('valueLevel2');
      expect(result.get('keyLevel5')).toBe('valueLevel5');
      expect(result.size).toBe(3);
    });
  });
});
