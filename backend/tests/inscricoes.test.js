import { describe, expect, it } from 'vitest';
import { criarParticipante, criarTurma, novoApp } from './helpers.js';

const inscrever = (api, turma, participante) =>
  api.post('/api/inscricoes').send({ turma_id: turma.id, participante_id: participante.id });

describe('Inscrições', () => {
  it('T06 - inscreve participante em turma com vaga (201, status=inscrito)', async () => {
    const { api } = novoApp();
    const turma = await criarTurma(api);
    const participante = await criarParticipante(api);
    const resposta = await inscrever(api, turma, participante);
    expect(resposta.status).toBe(201);
    expect(resposta.body).toMatchObject({
      turma_id: turma.id,
      participante_id: participante.id,
      status: 'inscrito',
      data_conclusao: null,
    });
    expect(resposta.body.data_inscricao).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect((await api.get(`/api/turmas/${turma.id}`)).body.vagas_ocupadas).toBe(1);
  });

  it('T07 - inscrição acima das vagas retorna 409 (RN03) e não grava', async () => {
    const { api } = novoApp();
    const turma = await criarTurma(api, { vagas: 2 });
    const a = await criarParticipante(api, 1);
    const b = await criarParticipante(api, 2);
    const c = await criarParticipante(api, 3);
    expect((await inscrever(api, turma, a)).status).toBe(201);
    expect((await inscrever(api, turma, b)).status).toBe(201);
    const recusada = await inscrever(api, turma, c);
    expect(recusada.status).toBe(409);
    expect(recusada.body.detail).toMatch(/vagas/i);
    expect((await api.get(`/api/inscricoes?turma_id=${turma.id}`)).body).toHaveLength(2);
    expect((await api.get(`/api/turmas/${turma.id}`)).body.vagas_ocupadas).toBe(2);
  });

  it('T08 - mesma inscrição duas vezes retorna 409 (RN04)', async () => {
    const { api } = novoApp();
    const turma = await criarTurma(api);
    const participante = await criarParticipante(api);
    expect((await inscrever(api, turma, participante)).status).toBe(201);
    const duplicada = await inscrever(api, turma, participante);
    expect(duplicada.status).toBe(409);
    expect(duplicada.body.detail).toMatch(/já inscrito/i);
  });

  it('T09 - marcar conclusão é idempotente (RN05)', async () => {
    const { api } = novoApp();
    const turma = await criarTurma(api);
    const participante = await criarParticipante(api);
    const inscricao = (await inscrever(api, turma, participante)).body;

    const primeira = await api.patch(`/api/inscricoes/${inscricao.id}/concluir`);
    expect(primeira.status).toBe(200);
    expect(primeira.body.status).toBe('concluido');
    expect(primeira.body.data_conclusao).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    const segunda = await api.patch(`/api/inscricoes/${inscricao.id}/concluir`);
    expect(segunda.status).toBe(200);
    expect(segunda.body).toEqual(primeira.body);
  });

  it('cancelar inscrição libera a vaga (204)', async () => {
    const { api } = novoApp();
    const turma = await criarTurma(api, { vagas: 1 });
    const a = await criarParticipante(api, 1);
    const b = await criarParticipante(api, 2);
    const inscricao = (await inscrever(api, turma, a)).body;
    expect((await inscrever(api, turma, b)).status).toBe(409);
    expect((await api.delete(`/api/inscricoes/${inscricao.id}`)).status).toBe(204);
    expect((await inscrever(api, turma, b)).status).toBe(201);
  });

  it('turma ou participante inexistentes retornam 404; ids ausentes ou inválidos, 422', async () => {
    const { api } = novoApp();
    const turma = await criarTurma(api);
    const participante = await criarParticipante(api);
    const semTurma = await api.post('/api/inscricoes').send({ turma_id: 999, participante_id: participante.id });
    expect(semTurma.status).toBe(404);
    const semParticipante = await api.post('/api/inscricoes').send({ turma_id: turma.id, participante_id: 999 });
    expect(semParticipante.status).toBe(404);
    expect((await api.post('/api/inscricoes').send({})).status).toBe(422);
    expect((await api.post('/api/inscricoes').send({ turma_id: '1', participante_id: 1 })).status).toBe(422);
    expect((await api.get('/api/inscricoes?turma_id=abc')).status).toBe(422);
  });

  it('lista filtrada por turma_id traz dados do participante', async () => {
    const { api } = novoApp();
    const turma = await criarTurma(api);
    const participante = await criarParticipante(api);
    await inscrever(api, turma, participante);
    const lista = await api.get(`/api/inscricoes?turma_id=${turma.id}`);
    expect(lista.body[0]).toMatchObject({
      participante_nome: participante.nome,
      participante_email: participante.email,
    });
    expect((await api.get('/api/inscricoes?turma_id=12345')).body).toEqual([]);
  });
});
