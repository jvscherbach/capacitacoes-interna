// Dados fictícios. Execução manual: npm run seed --prefix backend
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { abrirBanco } from './db.js';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const caminhoBanco = process.env.DB_PATH ?? path.join(aqui, '..', 'data', 'capacitacoes.db');
const db = abrirBanco(caminhoBanco);

const semear = db.transaction(() => {
  const curso = db.prepare('INSERT OR IGNORE INTO curso (nome, carga_horaria, descricao) VALUES (?, ?, ?)');
  curso.run('Introdução à Análise de Dados', 20, 'Curso fictício de exemplo');
  curso.run('Boas Práticas de Documentação', 8, 'Curso fictício de exemplo');

  const idCurso = (nome) => db.prepare('SELECT id FROM curso WHERE nome = ?').get(nome).id;
  const turma = db.prepare(
    'INSERT OR IGNORE INTO turma (curso_id, codigo, periodo_inicio, periodo_fim, vagas) VALUES (?, ?, ?, ?, ?)',
  );
  turma.run(idCurso('Introdução à Análise de Dados'), 'AD-2026-01', '2026-11-03', '2026-11-07', 3);
  turma.run(idCurso('Boas Práticas de Documentação'), 'BPD-2026-01', '2026-11-10', '2026-11-11', 2);

  const participante = db.prepare('INSERT OR IGNORE INTO participante (nome, email, setor) VALUES (?, ?, ?)');
  participante.run('Ana Exemplo', 'ana@exemplo.test', 'Setor Fictício');
  participante.run('Bruno Teste', 'bruno@exemplo.test', 'Setor Fictício');
  participante.run('Carla Demo', 'carla@exemplo.test', 'Setor Fictício');
});

semear();
console.log(`Seed aplicado em ${caminhoBanco}`);
