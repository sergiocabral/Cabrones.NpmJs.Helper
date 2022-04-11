import { FileSystemMonitoring, InvalidArgumentError } from '../../../ts';

// TODO: lastFields
// TODO: isActive
// TODO: start
// TODO: stop

describe('Classe FileSystemMonitoring', () => {
  describe('Instancia da classe', () => {
    test('Instanciando com valores válidos', () => {
      // Arrange, Given

      const path = Math.random().toString();
      const interval = Math.floor(Math.random() * 100);

      // Act, When

      const sut = new FileSystemMonitoring(path, interval);

      // Assert, Then
      expect(sut.path).toBe(path);
      expect(sut.interval).toBe(interval);
    });
    test('Não aceita path vazio', () => {
      // Arrange, Given

      const emptyPath = '';

      // Act, When

      const action = () =>
        new FileSystemMonitoring(emptyPath, Math.random() * 100);

      // Assert, Then
      expect(action).toThrowError(InvalidArgumentError);
    });
    test('Não aceita path em branco', () => {
      // Arrange, Given

      const emptyPath = '     ';

      // Act, When

      const action = () =>
        new FileSystemMonitoring(emptyPath, Math.random() * 100);

      // Assert, Then
      expect(action).toThrowError(InvalidArgumentError);
    });
    test('Não aceita interval igual a zero', () => {
      // Arrange, Given

      const zero = 0;

      // Act, When

      const action = () =>
        new FileSystemMonitoring(Math.random().toString(), zero);

      // Assert, Then

      expect(zero).toBe(0);
      expect(action).toThrowError(InvalidArgumentError);
    });
    test('Não aceita interval menor que zero', () => {
      // Arrange, Given

      const lessThanZero = Math.random() * 100 * -1;

      // Act, When

      const action = () =>
        new FileSystemMonitoring(Math.random().toString(), lessThanZero);

      // Assert, Then

      expect(lessThanZero).toBeLessThan(0);
      expect(action).toThrowError(InvalidArgumentError);
    });
    test('Por padrão instancia ativo', () => {
      // Arrange, Given
      // Act, When

      const sut = new FileSystemMonitoring(
        Math.random().toString(),
        Math.random() * 100
      );

      // Assert, Then
      expect(sut.isActive).toBe(true);
    });
    test('Pode especificar não instanciar ativo', () => {
      // Arrange, Given

      const active = false;

      // Act, When

      const sut = new FileSystemMonitoring(
        Math.random().toString(),
        Math.random() * 100,
        active
      );

      // Assert, Then

      expect(active).toBe(false);
      expect(sut.isActive).toBe(active);
    });
  });
  describe('Propriedade interval', () => {
    test('não aceita valor zero', () => {
      // Arrange, Given

      const zero = 0;
      const sut = new FileSystemMonitoring(
        Math.random().toString(),
        Math.random() * 100
      );

      // Act, When

      const action = () => (sut.interval = zero);

      // Assert, Then

      expect(zero).toBe(0);
      expect(action).toThrowError(InvalidArgumentError);
    });
    test('não aceita valor menor que zero', () => {
      // Arrange, Given

      const lessThanZero = Math.random() * 100 * -1;
      const sut = new FileSystemMonitoring(
        Math.random().toString(),
        Math.random() * 100
      );

      // Act, When

      const action = () => (sut.interval = lessThanZero);

      // Assert, Then

      expect(lessThanZero).toBeLessThan(0);
      expect(action).toThrowError(InvalidArgumentError);
    });
    test('aceita valores maiores que zero', () => {
      // Arrange, Given

      const greaterThanZero = Math.random() * 100;
      const sut = new FileSystemMonitoring(
        Math.random().toString(),
        Math.random() * 100
      );

      // Act, When

      sut.interval = greaterThanZero;

      // Assert, Then

      expect(greaterThanZero).toBeGreaterThan(0);
      expect(greaterThanZero).toBeGreaterThanOrEqual(sut.interval);
    });
    test('os valores são armazenados como inteiro', () => {
      // Arrange, Given

      const interval = Math.random() * 100;
      const intervalAsInteger = Math.floor(interval);

      const sut = new FileSystemMonitoring(
        Math.random().toString(),
        Math.random() * 100
      );

      // Act, When

      sut.interval = interval;

      // Assert, Then

      expect(sut.interval).not.toBe(interval);
      expect(sut.interval).toBe(intervalAsInteger);
    });
    test('se mudar o valor quando a instância não é ativa não deve iniciar o timer', () => {
      // Arrange, Given

      const active = false;
      const sut = new FileSystemMonitoring(
        Math.random().toString(),
        Math.random() * 100,
        active
      );

      // Act, When

      sut.interval += 1;

      // Assert, Then

      expect(sut.isActive).toBe(false);
    });
    test('se mudar o valor quando a instância é ativa reinicia o timer', () => {
      // Arrange, Given
      // Act, When
      // Assert, Then
      // TODO: Implementar, linhas 58, 62
    });
  });
  test('clearListeners', () => {
    // Arrange, Given

    const sut = new FileSystemMonitoring(
      Math.random().toString(),
      Math.random() * 100
    );

    sut.onCreated.add(jest.fn());
    sut.onDeleted.add(jest.fn());

    // Act, When

    const beforeClear = sut.onCreated.size + sut.onDeleted.size;
    sut.clearListeners();
    const afterClear = sut.onCreated.size + sut.onDeleted.size;

    // Assert, Then

    expect(beforeClear).toBe(2);
    expect(afterClear).toBe(0);
  });
});
