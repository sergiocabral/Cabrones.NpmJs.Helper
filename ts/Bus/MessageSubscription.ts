import { Message } from './Message';
import { MessageListener } from './MessageListener';

/**
 * Conjunto de informações sobre a inscrição referente a uma mensagem.
 */
export class MessageSubscription<TMessage extends Message> {
  /**
   * Construtor.
   * @param messageType Mensagem
   * @param listener Função chamada quando uma mensagem é emitida.
   */
  public constructor(
    public readonly messageType: new () => TMessage,
    public readonly listener: MessageListener<TMessage>
  ) {
    this.messageName = Message.getName<TMessage>(messageType);
  }

  /**
   * Nome identificador da mensagem.
   */
  public readonly messageName: string;

  /**
   * Notifica o listener com uma mensagem.
   * @param message Mensagem.
   */
  public async notifyListener(message: TMessage): Promise<void> {
    await this.listener(message);
  }

  /**
   * Compara duas instância para determinar igualdade.
   * @param other
   */
  public equals<TOtherMessage extends Message>(
    other: MessageSubscription<TOtherMessage>
  ): boolean {
    return (
      (this.listener as MessageListener<Message>) === other.listener &&
      Message.getName(this.messageType) === Message.getName(other.messageType)
    );
  }

  /**
   * Cancela a inscrição.
   */
  public unsubscribe(): void {
    Message.unsubscribe(this);
  }
}
