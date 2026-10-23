import { conflito, naoEncontrado } from '../errors.js';

export function listar(db) {
  return db.prepare('SELECT * FROM curso ORDER BY nome').all();
}

export function obter(db, id) {
  const curso = db.prepare('SELECT * FROM curso WHERE id = ?').get(id);
  if (!curso) throw naoEncontrado('Curso não encontrado');
  return curso;
}

function garantirNomeUnico(db, nome, idAtual = 0) {
  const outro = db.prepare('SELECT id FROM curso WHERE nome = ? AND id <> ?').get(nome, idAtual);
  if (outro) throw conflito('Já existe um curso com este nome');
}

export function criar(db, dados) {
  garantirNomeUnico(db, dados.nome);
  const { lastInsertRowid } = db
    .prepare('INSERT INTO curso (nome, carga_horaria, descricao) VALUES (?, ?, ?)')
    .run(dados.nome, dados.carga_horaria, dados.descricao);
  return obter(db, Number(lastInsertRowid));
}

export function atualizar(db, id, dados) {
  obter(db, id);
  garantirNomeUnico(db, dados.nome, id);
  db.prepare('UPDATE curso SET nome = ?, carga_horaria = ?, descricao = ? WHERE id = ?').run(
    dados.nome,
    dados.carga_horaria,
    dados.descricao,
    id,
  );
  return obter(db, id);
}

export function excluir(db, id) {
  obter(db, id);
  const { total } = db.prepare('SELECT COUNT(*) AS total FROM turma WHERE curso_id = ?').get(id);
  if (total > 0) throw conflito('Não é possível excluir um curso que possui turmas');
  db.prepare('DELETE FROM curso WHERE id = ?').run(id);
}
