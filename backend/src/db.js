import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

const ESQUEMA = `
CREATE TABLE IF NOT EXISTS curso (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL UNIQUE COLLATE NOCASE,
  carga_horaria INTEGER NOT NULL CHECK (carga_horaria > 0),
  descricao TEXT
);

CREATE TABLE IF NOT EXISTS turma (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  curso_id INTEGER NOT NULL REFERENCES curso(id),
  codigo TEXT NOT NULL UNIQUE COLLATE NOCASE,
  periodo_inicio TEXT NOT NULL,
  periodo_fim TEXT NOT NULL,
  vagas INTEGER NOT NULL CHECK (vagas >= 1),
  CHECK (periodo_fim >= periodo_inicio)
);

CREATE TABLE IF NOT EXISTS participante (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  setor TEXT
);

CREATE TABLE IF NOT EXISTS inscricao (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  turma_id INTEGER NOT NULL REFERENCES turma(id),
  participante_id INTEGER NOT NULL REFERENCES participante(id),
  status TEXT NOT NULL DEFAULT 'inscrito' CHECK (status IN ('inscrito', 'concluido')),
  data_inscricao TEXT NOT NULL,
  data_conclusao TEXT,
  UNIQUE (turma_id, participante_id)
);
`;

export function abrirBanco(caminho = ':memory:') {
  if (caminho !== ':memory:') {
    fs.mkdirSync(path.dirname(caminho), { recursive: true });
  }
  const db = new Database(caminho);
  db.pragma('foreign_keys = ON');
  db.exec(ESQUEMA);
  return db;
}
