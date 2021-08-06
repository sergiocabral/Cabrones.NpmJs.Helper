import { DispatchedMessage } from './DispatchedMessage';

export interface IMessage {
  /**
   * Nome identificador da mensagem.
   */
  readonly name: string;

  /**
   * Envia a mensagem para o serviço mensageiro notificar os listeners.
   */
  send(): Promise<DispatchedMessage<this>>;
}
