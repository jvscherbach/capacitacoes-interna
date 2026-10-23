import request from 'supertest';
import { createApp } from '../src/app.js';
import { abrirBanco } from '../src/db.js';

export function novoApp() {
  const db = abrirBanco(':memory:');
  return { db, api: request(createApp(db)) };
}

export const cursoValido = { nome: 'Curso Fictício', carga_horaria: 20, descricao: 'Exemplo' };

export const turmaValida = (curso_id, extra = {}) => ({
  curso_id,
  codigo: 'T-2026-01',
  periodo_inicio: '2026-11-03',
  periodo_fim: '2026-11-07',
  vagas: 2,
  ...extra,
});

export const participanteValido = (n = 1) => ({
  nome: `Pessoa ${n}`,
  email: `pessoa${n}@exemplo.test`,
  setor: 'Setor Fictício',
});

export async function criarCurso(api, extra = {}) {
  return (await api.post('/api/cursos').send({ ...cursoValido, ...extra })).body;
}

export async function criarTurma(api, extra = {}) {
  const curso = await criarCurso(api);
  return (await api.post('/api/turmas').send(turmaValida(curso.id, extra))).body;
}

export async function criarParticipante(api, n = 1) {
  return (await api.post('/api/participantes').send(participanteValido(n))).body;
}
