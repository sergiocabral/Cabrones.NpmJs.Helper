/**
 * Assinatura para função de evento com retorno do resultado.
 */
export type ResultEvent<TData = unknown> = (
  success: boolean,
  data?: TData
) => void;
