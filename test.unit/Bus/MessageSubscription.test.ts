import { KeyValue} from "../../ts";
import { Message } from "../../ts/Bus/Message";
import { MessageSubscription } from "../../ts/Bus/MessageSubscription";

class TestMessage1 extends Message { }
class TestMessage2 extends TestMessage1 { }

describe('Class MessageSubscription', () => {
  const originals: KeyValue<any> = {};

  beforeEach(() => {
    originals['Message.unsubscribe'] = Message.unsubscribe;
  });

  afterEach(() => {
    Message.unsubscribe = originals['Message.unsubscribe'];
  });

  test('ao criar deve definir o nome identificador da mensagem', () => {
    // Arrange, Given

    const sut = new MessageSubscription(TestMessage1, async (_: TestMessage1): Promise<void> => { });

    // Act, When

    const messageName = sut.messageName;

    // Assert, Then

    expect(messageName).toBe("TestMessage1");
  });
  test('notifyListener deve repassar a chamada para o listener cadastrado', () => {
    // Arrange, Given

    const listener = jest.fn();
    const message = new TestMessage1();
    const sut = new MessageSubscription(TestMessage1, listener);

    // Act, When

    sut.notifyListener(message);

    // Assert, Then

    expect(listener).toBeCalledTimes(1);
    expect(listener.mock.calls[0][0]).toBe(message);
  });
  test('equals deve avaliar a igualdade de duas instâncias', () => {
    // Arrange, Given

    const listener = async (_: TestMessage1): Promise<void> => { };
    const sut = new MessageSubscription(TestMessage1, listener);
    const sutEquals = new MessageSubscription(TestMessage1, listener);
    const sutDiffListener = new MessageSubscription(TestMessage1, async (_: TestMessage1): Promise<void> => { });
    const sutDiffMessage = new MessageSubscription(TestMessage2, listener);
    const sutDiffMessageAndListener = new MessageSubscription(TestMessage2, async (_: TestMessage1): Promise<void> => { });

    // Act, When

    const checkEquals = sut.equals(sutEquals);
    const checkDiffListener = sut.equals(sutDiffListener);
    const checkDiffMessage = sut.equals(sutDiffMessage);
    const checkDiffMessageAndListener = sut.equals(sutDiffMessageAndListener);

    // Assert, Then

    expect(checkEquals).toBe(true);
    expect(checkDiffListener).toBe(false);
    expect(checkDiffMessage).toBe(false);
    expect(checkDiffMessageAndListener).toBe(false);
  });
  test('unsubscribe deve solicitar ao mensageiro o cancelamento da inscrição', () => {
    // Arrange, Given

    const mockUnsubscribe = jest.fn();
    Message.unsubscribe = mockUnsubscribe;

    const sut = new MessageSubscription(TestMessage1, async (_: TestMessage1): Promise<void> => { });

    // Act, When

    sut.unsubscribe();

    // Assert, Then

    expect(mockUnsubscribe).toBeCalledTimes(1);
    expect(mockUnsubscribe.mock.calls[0][0]).toBe(sut);
  });
})
