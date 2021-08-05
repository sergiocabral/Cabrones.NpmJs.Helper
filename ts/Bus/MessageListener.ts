import { Message } from './Message';

/**
 * Tipo da função usada para se inscrever em uma mensagem.
 */
export type MessageListener<TMessage = Message> = (
  message: TMessage
) => Promise<void>;
