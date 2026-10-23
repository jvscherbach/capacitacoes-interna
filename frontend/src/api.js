// Em produção (Vercel) a API é servida na mesma origem, em /api; em dev, na porta 8000.
const BASE = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:8000/api' : '/api');

async function requisicao(metodo, caminho, corpo) {
  let resposta;
  try {
    resposta = await fetch(`${BASE}${caminho}`, {
      method: metodo,
      headers: corpo ? { 'Content-Type': 'application/json' } : undefined,
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique se o backend está em execução.');
  }
  if (resposta.status === 204) return null;
  let dados = null;
  try {
    dados = await resposta.json();
  } catch {
    // resposta sem corpo JSON
  }
  if (!resposta.ok) throw new Error(dados?.detail ?? `Erro ${resposta.status} ao falar com a API`);
  return dados;
}

const crud = (recurso) => ({
  listar: () => requisicao('GET', `/${recurso}`),
  obter: (id) => requisicao('GET', `/${recurso}/${id}`),
  criar: (dados) => requisicao('POST', `/${recurso}`, dados),
  atualizar: (id, dados) => requisicao('PUT', `/${recurso}/${id}`, dados),
  excluir: (id) => requisicao('DELETE', `/${recurso}/${id}`),
});

export const api = {
  dashboard: () => requisicao('GET', '/dashboard'),
  cursos: crud('cursos'),
  turmas: crud('turmas'),
  participantes: crud('participantes'),
  inscricoes: {
    listarPorTurma: (turmaId) => requisicao('GET', `/inscricoes?turma_id=${turmaId}`),
    criar: (turmaId, participanteId) =>
      requisicao('POST', '/inscricoes', { turma_id: turmaId, participante_id: participanteId }),
    concluir: (id) => requisicao('PATCH', `/inscricoes/${id}/concluir`),
    cancelar: (id) => requisicao('DELETE', `/inscricoes/${id}`),
  },
};
