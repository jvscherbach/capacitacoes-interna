export class ErroHttp extends Error {
  constructor(status, detail) {
    super(detail);
    this.status = status;
    this.detail = detail;
  }
}

export const naoEncontrado = (mensagem) => new ErroHttp(404, mensagem);
export const conflito = (mensagem) => new ErroHttp(409, mensagem);

export function parseId(valor) {
  const id = Number(valor);
  if (!Number.isInteger(id) || id < 1) {
    throw new ErroHttp(422, 'id deve ser um inteiro positivo');
  }
  return id;
}
