import {
  Message,
  HelperNumeric,
  InvalidExecutionError,
  KeyValue
} from '../../ts';

class TestMessage1 extends Message {
  public constructor(_arg1: string, _arg2: number) {
    super();
  }
}
class TestMessage2 extends Message {
  public constructor(_arg1: string, _arg2: number) {
    super();
  }
}

describe('Class Message', () => {
  const originals: KeyValue<any> = {};

  beforeEach(() => {
    Message.unsubscribeAll();
    originals['Message.unsubscribe'] = Message.unsubscribe;
    originals['Message.send'] = (Message as any).send;
  });

  afterEach(() => {
    Message.unsubscribe = originals['Message.unsubscribe'];
    (Message as any).send = originals['Message.send'];
  });

  describe('Testes da instância', () => {
    test('após criado deve ter definido o nome', () => {
      // Arrange, Given

      const sut = new TestMessage1('', 1);

      // Act, When

      const messageName = sut.name;

      // Assert, Then

      expect(messageName).toBe('TestMessage1');
    });
    test('send() deve repassar a chamada para a função estática da classe', async () => {
      // Arrange, Given

      const mockSend = jest.fn();
      (Message as any).send = mockSend;

      const sut = new TestMessage1('', 1);

      // Act, When

      await sut.send();

      // Assert, Then

      expect(mockSend).toBeCalledTimes(1);
      expect(mockSend.mock.calls[0][0]).toBe(sut);
    });
  });
  describe('Testes estáticos da classe', () => {
    test('subscribe() deve inscrever para ouvir mensagens', async () => {
      // Arrange, Given

      const mockListener = jest.fn();
      Message.subscribe(TestMessage1, mockListener);
      Message.subscribe(TestMessage2, mockListener);

      const message = new TestMessage1('', 1);

      // Act, When

      await message.send();

      // Assert, Then

      expect(mockListener).toBeCalledTimes(1);
      expect(mockListener.mock.calls[0][0]).toBe(message);
    });
    test('subscribe() deve falhar ao se inscrever duas vezes', () => {
      // Arrange, Given

      const mockListener = jest.fn();

      // Act, When

      const subscribe = () => Message.subscribe(TestMessage1, mockListener);

      // Assert, Then

      expect(subscribe).not.toThrow();
      expect(subscribe).toThrowError(InvalidExecutionError);
    });
    test('unsubscribe() deve cancelar uma inscrição', async () => {
      // Arrange, Given

      const mockListener = jest.fn();
      const subscription = Message.subscribe(TestMessage1, mockListener);

      // Act, When

      Message.unsubscribe(subscription);
      await new TestMessage1('', 1).send();

      // Assert, Then

      expect(mockListener).toBeCalledTimes(0);
    });
    test('unsubscribe() deve falhar se cancelar uma inscrição não feita', () => {
      // Arrange, Given

      const mockListener = jest.fn();
      const subscription = Message.subscribe(TestMessage1, mockListener);

      // Act, When

      const unsubscribe = () => Message.unsubscribe(subscription);

      // Assert, Then

      expect(unsubscribe).not.toThrow();
      expect(unsubscribe).toThrowError(InvalidExecutionError);
    });
    test('unsubscribe() deve cancelar apenas a inscrição solicitada', async () => {
      // Arrange, Given

      const mockListener = jest.fn();
      const subscription1 = Message.subscribe(TestMessage1, mockListener);
      Message.subscribe(TestMessage2, mockListener);

      const message = new TestMessage2('', 1);

      // Act, When

      Message.unsubscribe(subscription1);
      await message.send();

      // Assert, Then

      expect(mockListener).toBeCalledTimes(1);
      expect(mockListener.mock.calls[0][0]).toBe(message);
    });
    test('unsubscribeAll() deve cancelar todas as inscrições já registradas', async () => {
      // Arrange, Given

      const mockListener = jest.fn();
      Message.subscribe(TestMessage1, mockListener);
      Message.subscribe(TestMessage2, mockListener);

      // Act, When

      Message.unsubscribeAll();
      await new TestMessage1('', 1).send();
      await new TestMessage2('', 1).send();

      // Assert, Then

      expect(mockListener).toBeCalledTimes(0);
    });
    test('send() deve ser possível ouvir a mesma mensagem mais de uma vez', async () => {
      // Arrange, Given

      const mockListener1 = jest.fn();
      const mockListener2 = jest.fn();
      Message.subscribe(TestMessage1, mockListener1);
      Message.subscribe(TestMessage1, mockListener2);

      const message = new TestMessage1('', 1);

      // Act, When

      await message.send();

      // Assert, Then

      expect(mockListener1).toBeCalledTimes(1);
      expect(mockListener1.mock.calls[0][0]).toBe(message);
      expect(mockListener2).toBeCalledTimes(1);
      expect(mockListener2.mock.calls[0][0]).toBe(message);
    });
    test('send() uma mensagem sem inscrição deve poder ser enviada sem falhar', async () => {
      // Arrange, Given

      const message = new TestMessage1('', 1);

      // Act, When

      const send = async () => await message.send();

      // Assert, Then

      expect(send).not.toThrow();
      expect((await send()).rounds).toBe(0);
    });
    test('send() deve retornar a própria mensagem enviada', async () => {
      // Arrange, Given

      const message = new TestMessage1('', 1);

      // Act, When

      const response = await message.send();

      // Assert, Then

      expect(response.message).toBe(message);
    });
    test('send() deve retornar o total de vezes que a mensagem foi ouvida', async () => {
      // Arrange, Given

      const randomTimes = HelperNumeric.between(5, 10);
      for (let i = 0; i < randomTimes; i++) {
        Message.subscribe(TestMessage1, async () => {});
      }

      // Act, When

      const response = await new TestMessage1('', 1).send();

      // Assert, Then

      expect(response.rounds).toBe(randomTimes);
    });
  });
});
