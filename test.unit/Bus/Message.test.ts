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
    originals['Message.sendAsync'] = (Message as any).sendAsync;
  });

  afterEach(() => {
    Message.unsubscribe = originals['Message.unsubscribe'];
    (Message as any).send = originals['Message.send'];
    (Message as any).sendAsync = originals['Message.sendAsync'];
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
    test('send() deve repassar a chamada para a função estática da classe', () => {
      // Arrange, Given

      const mockSend = jest.fn();
      (Message as any).send = mockSend;

      const sut = new TestMessage1('', 1);

      // Act, When

      sut.send();

      // Assert, Then

      expect(mockSend).toBeCalledTimes(1);
      expect(mockSend.mock.calls[0][0]).toBe(sut);
    });
    test('sendAsync() deve repassar a chamada para a função estática da classe', () => {
      // Arrange, Given

      const mockSendAsync = jest.fn();
      (Message as any).sendAsync = mockSendAsync;

      const sut = new TestMessage1('', 1);

      // Act, When

      sut.sendAsync();

      // Assert, Then

      expect(mockSendAsync).toBeCalledTimes(1);
      expect(mockSendAsync.mock.calls[0][0]).toBe(sut);
    });
  });
  describe('Testes estáticos da classe', () => {
    test('subscribe() deve inscrever para ouvir mensagens', () => {
      // Arrange, Given

      const mockListener = jest.fn();
      Message.subscribe(TestMessage1, mockListener);
      Message.subscribe(TestMessage2, mockListener);

      const message = new TestMessage1('', 1);

      // Act, When

      message.send();

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
    test('unsubscribe() deve cancelar uma inscrição', () => {
      // Arrange, Given

      const mockListener = jest.fn();
      const subscription = Message.subscribe(TestMessage1, mockListener);

      // Act, When

      Message.unsubscribe(subscription);
      new TestMessage1('', 1).send();

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
    test('unsubscribe() deve cancelar apenas a inscrição solicitada', () => {
      // Arrange, Given

      const mockListener = jest.fn();
      const subscription1 = Message.subscribe(TestMessage1, mockListener);
      Message.subscribe(TestMessage2, mockListener);

      const message = new TestMessage2('', 1);

      // Act, When

      Message.unsubscribe(subscription1);
      message.send();

      // Assert, Then

      expect(mockListener).toBeCalledTimes(1);
      expect(mockListener.mock.calls[0][0]).toBe(message);
    });
    test('unsubscribeAll() deve cancelar todas as inscrições já registradas', () => {
      // Arrange, Given

      const mockListener = jest.fn();
      Message.subscribe(TestMessage1, mockListener);
      Message.subscribe(TestMessage2, mockListener);

      // Act, When

      Message.unsubscribeAll();
      new TestMessage1('', 1).send();
      new TestMessage2('', 1).send();

      // Assert, Then

      expect(mockListener).toBeCalledTimes(0);
    });
    test('send() deve ser possível ouvir a mesma mensagem mais de uma vez', () => {
      // Arrange, Given

      const mockListener1 = jest.fn();
      const mockListener2 = jest.fn();
      Message.subscribe(TestMessage1, mockListener1);
      Message.subscribe(TestMessage1, mockListener2);

      const message = new TestMessage1('', 1);

      // Act, When

      message.send();

      // Assert, Then

      expect(mockListener1).toBeCalledTimes(1);
      expect(mockListener1.mock.calls[0][0]).toBe(message);
      expect(mockListener2).toBeCalledTimes(1);
      expect(mockListener2.mock.calls[0][0]).toBe(message);
    });
    test('send() uma mensagem sem inscrição deve poder ser enviada sem falhar', () => {
      // Arrange, Given

      const message = new TestMessage1('', 1);

      // Act, When

      const send = () => message.send();

      // Assert, Then

      expect(send).not.toThrow();
      expect(send().rounds).toBe(0);
    });
    test('send() deve retornar a própria mensagem enviada', () => {
      // Arrange, Given

      const message = new TestMessage1('', 1);

      // Act, When

      const response = message.send();

      // Assert, Then

      expect(response.message).toBe(message);
    });
    test('send() deve retornar o total de vezes que a mensagem foi ouvida', () => {
      // Arrange, Given

      const randomTimes = HelperNumeric.between(5, 10);
      for (let i = 0; i < randomTimes; i++) {
        Message.subscribe(TestMessage1, () => {});
      }

      // Act, When

      const response = new TestMessage1('', 1).send();

      // Assert, Then

      expect(response.rounds).toBe(randomTimes);
    });
    test('sendAsync() deve ser assíncrono', async () => {
      // Arrange, Given

      let calledCount = 0;
      const asyncFunction = async () => {};
      Message.subscribe(TestMessage1, async () => {
        await asyncFunction();
        await asyncFunction();
        calledCount++;
      });

      // Act, When

      await new TestMessage1('', 1).sendAsync();
      await new TestMessage1('', 1).sendAsync();
      new TestMessage1('', 1).sendAsync();
      new TestMessage1('', 1).sendAsync();

      // Assert, Then

      expect(calledCount).toBe(2);
    });
  });
});
