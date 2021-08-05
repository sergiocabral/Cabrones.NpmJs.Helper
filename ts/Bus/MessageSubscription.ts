import { Message } from './Message';
import { MessageListener } from './MessageListener';

/**
 * Conjunto de informações sobre a inscrição referente a uma mensagem.
 */
export class MessageSubscription {
  /**
   * Construtor.
   * @param messageType Mensagem
   * @param listener Função chamada quando uma mensagem é emitida.
   */
  public constructor(
    public readonly messageType: typeof Message,
    public readonly listener: MessageListener
  ) {
    this.messageName = Message.getName(messageType);
  }

  /**
   * Nome identificador da mensagem.
   */
  public readonly messageName: string;

  /**
   * Notifica o listener com uma mensagem.
   * @param message Mensagem.
   */
  public async notifyListener(message: Message): Promise<void> {
    await this.listener(message);
  }

  /**
   * Compara duas instância para determinar igualdade.
   * @param other
   */
  public equals(other: MessageSubscription): boolean {
    return (
      this.listener === other.listener &&
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
