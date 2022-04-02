import { HelperList, InvalidExecutionError } from '../../ts';

describe('Classe HelperList', () => {
  test('Não deve permitir instanciar', () => {
    // Arrange, Given
    // Act, When

    const instantiate = () => new HelperList();

    // Assert, Then

    expect(instantiate).toThrowError(InvalidExecutionError);
  });

  describe('getRandom', () => {
    test('getRandom deve retornar um elemento aleatório da lista', () => {
      // Arrange, Given

      const sampleLength = 1000;
      const sample = [];

      const item1 = 'qualquer coisa';
      const item2 = 'outra coisa';
      const list = [item1, item2];

      // Act, When

      for (let i = 0; i < sampleLength; i++) {
        sample.push(HelperList.getRandom(list));
      }

      // Assert, Then

      const sampleOfItem1 =
        sample.filter(item => item === item1).length / sampleLength;
      const sampleOfItem2 =
        sample.filter(item => item === item2).length / sampleLength;
      const reason = Math.round(sampleOfItem1 / sampleOfItem2);

      expect(reason).toBe(1);
    });
    test('getRandom deve retornar undefined para lista vazia', () => {
      // Arrange, Given

      const emptyList = Array<string>();

      // Act, When

      const value = HelperList.getRandom(emptyList);

      // Assert, Then

      expect(value).not.toBeDefined();
    });
  });

  test('unique() deve retorna uma lista com elementos únicos', () => {
    // Arrange, Given

    const list = ['a', 'b', 'c', 'a'];
    const expectedList = ['a', 'b', 'c'];

    // Act, When

    const filteredList = HelperList.unique(list);

    // Assert, Then

    expect(filteredList).toEqual(expectedList);
  });
});
