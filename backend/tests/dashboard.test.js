import { describe, expect, it } from 'vitest';
import { criarCurso, criarParticipante, novoApp, turmaValida } from './helpers.js';

describe('Dashboard', () => {
  it('T12 - banco vazio retorna {0,0,0}', async () => {
    const { api } = novoApp();
    const resposta = await api.get('/api/dashboard');
    expect(resposta.status).toBe(200);
    expect(resposta.body).toEqual({ turmas: 0, participantes: 0, concluintes: 0 });
  });

  it('T13 - indicadores acompanham turmas, inscrições e conclusões (CA-03)', async () => {
    const { api } = novoApp();
    const dashboard = async () => (await api.get('/api/dashboard')).body;

    const curso = await criarCurso(api);
    const turma1 = (await api.post('/api/turmas').send(turmaValida(curso.id))).body;
    expect(await dashboard()).toEqual({ turmas: 1, participantes: 0, concluintes: 0 });
    const turma2 = (await api.post('/api/turmas').send(turmaValida(curso.id, { codigo: 'T-2026-02' }))).body;
    expect(await dashboard()).toEqual({ turmas: 2, participantes: 0, concluintes: 0 });

    const a = await criarParticipante(api, 1);
    const b = await criarParticipante(api, 2);
    // participantes sem inscrição não contam
    expect(await dashboard()).toEqual({ turmas: 2, participantes: 0, concluintes: 0 });

    const insA1 = (await api.post('/api/inscricoes').send({ turma_id: turma1.id, participante_id: a.id })).body;
    await api.post('/api/inscricoes').send({ turma_id: turma2.id, participante_id: a.id });
    await api.post('/api/inscricoes').send({ turma_id: turma1.id, participante_id: b.id });
    // COUNT DISTINCT: a está em duas turmas mas conta uma vez
    expect(await dashboard()).toEqual({ turmas: 2, participantes: 2, concluintes: 0 });

    await api.patch(`/api/inscricoes/${insA1.id}/concluir`);
    await api.patch(`/api/inscricoes/${insA1.id}/concluir`); // idempotente: não conta duas vezes
    expect(await dashboard()).toEqual({ turmas: 2, participantes: 2, concluintes: 1 });

    await api.delete(`/api/inscricoes/${insA1.id}`);
    expect(await dashboard()).toEqual({ turmas: 2, participantes: 2, concluintes: 0 });
  });
});
