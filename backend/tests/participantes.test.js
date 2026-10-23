import { describe, expect, it } from 'vitest';
import { criarParticipante, criarTurma, novoApp, participanteValido } from './helpers.js';

describe('Participantes', () => {
  it('cria, lista, edita e exclui participante', async () => {
    const { api } = novoApp();
    const criado = await api.post('/api/participantes').send(participanteValido());
    expect(criado.status).toBe(201);
    expect((await api.get('/api/participantes')).body).toHaveLength(1);
    const editado = await api
      .put(`/api/participantes/${criado.body.id}`)
      .send({ ...participanteValido(), nome: 'Outro Nome' });
    expect(editado.status).toBe(200);
    expect(editado.body.nome).toBe('Outro Nome');
    expect((await api.delete(`/api/participantes/${criado.body.id}`)).status).toBe(204);
  });

  it('T05 - e-mail duplicado retorna 409 (também ao editar e ignorando maiúsculas)', async () => {
    const { api } = novoApp();
    await criarParticipante(api, 1);
    const repetido = await api.post('/api/participantes').send(participanteValido(1));
    expect(repetido.status).toBe(409);
    const caixaAlta = await api
      .post('/api/participantes')
      .send({ ...participanteValido(1), email: 'PESSOA1@EXEMPLO.TEST' });
    expect(caixaAlta.status).toBe(409);

    const segundo = await criarParticipante(api, 2);
    const conflito = await api.put(`/api/participantes/${segundo.id}`).send(participanteValido(1));
    expect(conflito.status).toBe(409);
    const proprio = await api.put(`/api/participantes/${segundo.id}`).send(participanteValido(2));
    expect(proprio.status).toBe(200);
  });

  it('RN07/RN08 - e-mail inválido e nome vazio retornam 422', async () => {
    const { api } = novoApp();
    const semArroba = await api.post('/api/participantes').send({ ...participanteValido(), email: 'sem-arroba' });
    expect(semArroba.status).toBe(422);
    const semEmail = await api.post('/api/participantes').send({ ...participanteValido(), email: '' });
    expect(semEmail.status).toBe(422);
    const semNome = await api.post('/api/participantes').send({ ...participanteValido(), nome: '' });
    expect(semNome.status).toBe(422);
  });

  it('RN06 - não exclui participante com inscrições (409)', async () => {
    const { api } = novoApp();
    const turma = await criarTurma(api);
    const participante = await criarParticipante(api);
    await api.post('/api/inscricoes').send({ turma_id: turma.id, participante_id: participante.id });
    expect((await api.delete(`/api/participantes/${participante.id}`)).status).toBe(409);
  });
});
