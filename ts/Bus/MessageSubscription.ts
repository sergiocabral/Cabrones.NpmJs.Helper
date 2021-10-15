import { HelperObject } from '../Helper/HelperObject';
import { IMessage } from './IMessage';
import { MessageListener } from './MessageListener';

/**
 * Conjunto de informações sobre a inscrição referente a uma mensagem.
 */
export class MessageSubscription<TMessage extends IMessage> {
  /**
   * Construtor.
   * @param messageType Mensagem
   * @param listener Função chamada quando uma mensagem é emitida.
   */
  public constructor(
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    public readonly messageType: new (...args: any[]) => TMessage,
    public readonly listener: MessageListener<TMessage>
  ) {
    this.messageName = HelperObject.getName(messageType);
  }

  /**
   * Nome identificador da mensagem.
   */
  public readonly messageName: string;

  /**
   * Notifica o listener com uma mensagem.
   * @param message Mensagem.
   */
  public notifyListener(message: TMessage): void | Promise<void> {
    return this.listener(message);
  }

  /**
   * Compara duas instância para determinar igualdade.
   * @param other
   */
  public equals<TOtherMessage extends IMessage>(
    other: MessageSubscription<TOtherMessage>
  ): boolean {
    return (
      (this.listener as MessageListener<IMessage>) === other.listener &&
      HelperObject.getName(this.messageType) ===
        HelperObject.getName(other.messageType)
    );
  }
}
