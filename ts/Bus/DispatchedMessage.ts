import { Message } from './Message';

/**
 * Informações sobre uma mensagem despachada.
 */
export type DispatchedMessage<TMessage extends Message> = {
  /**
   * Mensagem processada.
   */
  message: TMessage;

  /**
   * Contagem de quantos listeners lidaram com a mensagem.
   */
  rounds: number;
};
