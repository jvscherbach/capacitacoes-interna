import { describe, expect, it } from 'vitest';
import { criarCurso, criarTurma, cursoValido, novoApp } from './helpers.js';

describe('Cursos', () => {
  it('T01 - cria, lista, edita e exclui curso (201/200/200/204)', async () => {
    const { api } = novoApp();
    const criado = await api.post('/api/cursos').send(cursoValido);
    expect(criado.status).toBe(201);
    expect(criado.body).toMatchObject({ nome: 'Curso Fictício', carga_horaria: 20 });

    const lista = await api.get('/api/cursos');
    expect(lista.status).toBe(200);
    expect(lista.body).toHaveLength(1);

    const editado = await api.put(`/api/cursos/${criado.body.id}`).send({ ...cursoValido, carga_horaria: 30 });
    expect(editado.status).toBe(200);
    expect(editado.body.carga_horaria).toBe(30);

    const excluido = await api.delete(`/api/cursos/${criado.body.id}`);
    expect(excluido.status).toBe(204);
    expect((await api.get(`/api/cursos/${criado.body.id}`)).status).toBe(404);
  });

  it('T10 - recurso inexistente retorna 404 com detail', async () => {
    const { api } = novoApp();
    for (const [metodo, url] of [
      ['get', '/api/cursos/999'],
      ['delete', '/api/turmas/999'],
      ['get', '/api/participantes/999'],
      ['patch', '/api/inscricoes/999/concluir'],
      ['delete', '/api/inscricoes/999'],
    ]) {
      const resposta = await api[metodo](url);
      expect(resposta.status, `${metodo} ${url}`).toBe(404);
      expect(typeof resposta.body.detail).toBe('string');
    }
    expect((await api.put('/api/cursos/999').send(cursoValido)).status).toBe(404);
  });

  it('T11 - listas vazias retornam 200 com []', async () => {
    const { api } = novoApp();
    for (const url of ['/api/cursos', '/api/turmas', '/api/participantes', '/api/inscricoes']) {
      const resposta = await api.get(url);
      expect(resposta.status, url).toBe(200);
      expect(resposta.body).toEqual([]);
    }
  });

  it('RN08 - campos obrigatórios vazios retornam 422', async () => {
    const { api } = novoApp();
    expect((await api.post('/api/cursos').send({ ...cursoValido, nome: '   ' })).status).toBe(422);
    expect((await api.post('/api/cursos').send({})).status).toBe(422);
    const cargaZero = await api.post('/api/cursos').send({ ...cursoValido, carga_horaria: 0 });
    expect(cargaZero.status).toBe(422);
    expect(cargaZero.body.detail).toBeTruthy();
  });

  it('nome de curso duplicado retorna 409', async () => {
    const { api } = novoApp();
    await criarCurso(api);
    const repetido = await api.post('/api/cursos').send(cursoValido);
    expect(repetido.status).toBe(409);
  });

  it('RN06 - não exclui curso com turmas (409)', async () => {
    const { api } = novoApp();
    const turma = await criarTurma(api);
    const resposta = await api.delete(`/api/cursos/${turma.curso_id}`);
    expect(resposta.status).toBe(409);
  });

  it('JSON inválido retorna 400 e id inválido retorna 422', async () => {
    const { api } = novoApp();
    const invalido = await api.post('/api/cursos').set('Content-Type', 'application/json').send('{quebrado');
    expect(invalido.status).toBe(400);
    expect(invalido.body.detail).toBeTruthy();
    expect((await api.get('/api/cursos/abc')).status).toBe(422);
  });
});

describe('Infra', () => {
  it('GET /health responde ok e CORS libera apenas http://localhost:5173', async () => {
    const { api } = novoApp();
    const saude = await api.get('/health').set('Origin', 'http://localhost:5173');
    expect(saude.status).toBe(200);
    expect(saude.body).toEqual({ status: 'ok' });
    expect(saude.headers['access-control-allow-origin']).toBe('http://localhost:5173');

    const outra = await api.get('/health').set('Origin', 'http://outro.test');
    expect(outra.headers['access-control-allow-origin']).toBeUndefined();

    const preflight = await api.options('/api/cursos').set('Origin', 'http://localhost:5173');
    expect(preflight.status).toBe(204);
  });

  it('rota desconhecida retorna 404 com detail', async () => {
    const { api } = novoApp();
    const resposta = await api.get('/api/nada');
    expect(resposta.status).toBe(404);
    expect(resposta.body.detail).toBeTruthy();
  });
});
