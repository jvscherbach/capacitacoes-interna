import { describe, expect, it } from 'vitest';
import { criarCurso, criarParticipante, criarTurma, novoApp, turmaValida } from './helpers.js';

describe('Turmas', () => {
  it('cria turma com vagas_ocupadas = 0, lista, edita e exclui', async () => {
    const { api } = novoApp();
    const curso = await criarCurso(api);
    const criada = await api.post('/api/turmas').send(turmaValida(curso.id));
    expect(criada.status).toBe(201);
    expect(criada.body).toMatchObject({ codigo: 'T-2026-01', vagas: 2, vagas_ocupadas: 0, curso_nome: curso.nome });

    expect((await api.get('/api/turmas')).body).toHaveLength(1);

    const editada = await api.put(`/api/turmas/${criada.body.id}`).send(turmaValida(curso.id, { vagas: 5 }));
    expect(editada.status).toBe(200);
    expect(editada.body.vagas).toBe(5);

    expect((await api.delete(`/api/turmas/${criada.body.id}`)).status).toBe(204);
  });

  it('T02 - vagas=0 retorna 422 (RN01)', async () => {
    const { api } = novoApp();
    const curso = await criarCurso(api);
    const resposta = await api.post('/api/turmas').send(turmaValida(curso.id, { vagas: 0 }));
    expect(resposta.status).toBe(422);
    expect(resposta.body.detail).toBeTruthy();
    expect((await api.post('/api/turmas').send(turmaValida(curso.id, { vagas: 1.5 }))).status).toBe(422);
  });

  it('T03 - periodo_fim < periodo_inicio retorna 422 (RN02); fim igual ao início é aceito', async () => {
    const { api } = novoApp();
    const curso = await criarCurso(api);
    const invalida = await api
      .post('/api/turmas')
      .send(turmaValida(curso.id, { periodo_inicio: '2026-11-10', periodo_fim: '2026-11-09' }));
    expect(invalida.status).toBe(422);
    const igual = await api
      .post('/api/turmas')
      .send(turmaValida(curso.id, { periodo_inicio: '2026-11-10', periodo_fim: '2026-11-10' }));
    expect(igual.status).toBe(201);
  });

  it('curso ausente retorna 422 com mensagem legível e período vazio cita o campo', async () => {
    const { api } = novoApp();
    const semCurso = await api.post('/api/turmas').send({ ...turmaValida(1), curso_id: undefined });
    expect(semCurso.status).toBe(422);
    expect(semCurso.body.detail).toBe('Curso é obrigatório');
    const semPeriodo = await api.post('/api/turmas').send({ ...turmaValida(1), periodo_inicio: '' });
    expect(semPeriodo.status).toBe(422);
    expect(semPeriodo.body.detail).toMatch(/Início do período/);
  });

  it('datas fora do formato ISO retornam 422', async () => {
    const { api } = novoApp();
    const curso = await criarCurso(api);
    const formato = await api.post('/api/turmas').send(turmaValida(curso.id, { periodo_inicio: '10/11/2026' }));
    expect(formato.status).toBe(422);
    const inexistente = await api.post('/api/turmas').send(turmaValida(curso.id, { periodo_fim: '2026-02-30' }));
    expect(inexistente.status).toBe(422);
  });

  it('curso inexistente retorna 404 e código duplicado retorna 409', async () => {
    const { api } = novoApp();
    expect((await api.post('/api/turmas').send(turmaValida(999))).status).toBe(404);
    const turma = await criarTurma(api);
    const repetida = await api.post('/api/turmas').send(turmaValida(turma.curso_id));
    expect(repetida.status).toBe(409);
  });

  it('T04 - excluir turma com inscrições retorna 409 (RN06)', async () => {
    const { api } = novoApp();
    const turma = await criarTurma(api);
    const participante = await criarParticipante(api);
    await api.post('/api/inscricoes').send({ turma_id: turma.id, participante_id: participante.id });
    const resposta = await api.delete(`/api/turmas/${turma.id}`);
    expect(resposta.status).toBe(409);
    expect(resposta.body.detail).toBeTruthy();
  });
});
