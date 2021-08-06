import { InvalidExecutionError } from '../Error/InvalidExecutionError';
import { HelperObject } from '../Helper/HelperObject';
import { DispatchedMessage } from './DispatchedMessage';
import { MessageSubscription } from './MessageSubscription';
import { MessageListener } from './MessageListener';

/**
 * Serviço mensageiro e classe abstrata de mensagem para o bus.
 */
export abstract class Message {
  /**
   * Lista de inscrições.
   */
  private static subscriptions: MessageSubscription<Message>[] = [];

  /**
   * Se registrar para ouvir uma mensagem.
   * @param messageType Tipo da mensagem.
   * @param listener Função a ser chamada quando a mensagem for emitida. Lembrar de usar .bind(this)
   * @returns Instância com dados da inscrição.
   */
  public static subscribe<TMessage extends Message>(
    messageType: new () => TMessage,
    listener: MessageListener<TMessage>
  ): MessageSubscription<TMessage> {
    const subscription = new MessageSubscription<TMessage>(
      messageType,
      listener
    );
    if (this.subscriptions.filter(v => v.equals(subscription)).length) {
      throw new InvalidExecutionError('Duplicate message subscription.');
    }
    this.subscriptions.push(
      subscription as unknown as MessageSubscription<Message>
    );
    return subscription;
  }

  /**
   * Cancela uma inscrição.
   * @param capture Instância com dados da inscrição.
   */
  public static unsubscribe<TMessage extends Message = Message>(
    capture: MessageSubscription<TMessage>
  ): void {
    if (
      this.subscriptions.filter((existentCapture, index, source) => {
        if (existentCapture.equals(capture)) {
          delete source[index];
          return true;
        } else {
          return false;
        }
      }).length === 0
    ) {
      throw new InvalidExecutionError('Message has not yet been captured.');
    }
  }

  /**
   * Cancela todas as inscrições registradas.
   */
  public static unsubscribeAll(): void {
    this.subscriptions.length = 0;
  }

  /**
   * Resolve o nome identificador de um uma mensagem.
   * @param message
   */
  public static getName<TMessage extends Message>(
    message: TMessage | (new () => TMessage)
  ): string {
    return HelperObject.getName(message);
  }

  /**
   * Nome identificador da mensagem.
   */
  public readonly name: string = Message.getName(this);

  /**
   * Envia a mensagem para o serviço mensageiro notificar os listeners.
   */
  public async send(): Promise<DispatchedMessage<this>> {
    return await Message.send<this>(this);
  }

  /**
   * Envia a mensagem para o serviço mensageiro notificar os listeners.
   * @param message Mensagem
   */
  private static async send<TMessage extends Message>(
    message: TMessage
  ): Promise<DispatchedMessage<TMessage>> {
    const captures = this.subscriptions.filter(
      capture => capture.messageName === message.name
    );
    for (const capture of captures) {
      await capture.notifyListener(message);
    }
    return { rounds: captures.length, message: message };
  }
}
