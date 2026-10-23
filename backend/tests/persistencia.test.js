import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { abrirBanco } from '../src/db.js';
import { cursoValido } from './helpers.js';

let pasta;
afterEach(() => {
  if (pasta) fs.rmSync(pasta, { recursive: true, force: true });
});

describe('Persistência', () => {
  it('T14 - dados permanecem após fechar e reabrir o mesmo arquivo SQLite', async () => {
    pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'capacitacoes-'));
    const arquivo = path.join(pasta, 'dados', 'teste.db');

    const db1 = abrirBanco(arquivo);
    const criado = await request(createApp(db1)).post('/api/cursos').send(cursoValido);
    expect(criado.status).toBe(201);
    db1.close();

    const db2 = abrirBanco(arquivo);
    const lista = await request(createApp(db2)).get('/api/cursos');
    expect(lista.body).toHaveLength(1);
    expect(lista.body[0].nome).toBe(cursoValido.nome);
    db2.close();
  });
});
