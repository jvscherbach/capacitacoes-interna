import { conflito, naoEncontrado } from '../errors.js';

const SELECIONAR = `
  SELECT t.id, t.curso_id, c.nome AS curso_nome, t.codigo, t.periodo_inicio, t.periodo_fim, t.vagas,
         (SELECT COUNT(*) FROM inscricao i WHERE i.turma_id = t.id) AS vagas_ocupadas
  FROM turma t
  JOIN curso c ON c.id = t.curso_id`;

export function listar(db) {
  return db.prepare(`${SELECIONAR} ORDER BY t.periodo_inicio, t.codigo`).all();
}

export function obter(db, id) {
  const turma = db.prepare(`${SELECIONAR} WHERE t.id = ?`).get(id);
  if (!turma) throw naoEncontrado('Turma não encontrada');
  return turma;
}

function garantirRegras(db, dados, idAtual = 0) {
  const curso = db.prepare('SELECT id FROM curso WHERE id = ?').get(dados.curso_id);
  if (!curso) throw naoEncontrado('Curso não encontrado');
  const outra = db.prepare('SELECT id FROM turma WHERE codigo = ? AND id <> ?').get(dados.codigo, idAtual);
  if (outra) throw conflito('Já existe uma turma com este código');
}

export function criar(db, dados) {
  garantirRegras(db, dados);
  const { lastInsertRowid } = db
    .prepare(
      'INSERT INTO turma (curso_id, codigo, periodo_inicio, periodo_fim, vagas) VALUES (?, ?, ?, ?, ?)',
    )
    .run(dados.curso_id, dados.codigo, dados.periodo_inicio, dados.periodo_fim, dados.vagas);
  return obter(db, Number(lastInsertRowid));
}

export function atualizar(db, id, dados) {
  obter(db, id);
  garantirRegras(db, dados, id);
  db.prepare(
    'UPDATE turma SET curso_id = ?, codigo = ?, periodo_inicio = ?, periodo_fim = ?, vagas = ? WHERE id = ?',
  ).run(dados.curso_id, dados.codigo, dados.periodo_inicio, dados.periodo_fim, dados.vagas, id);
  return obter(db, id);
}

export function excluir(db, id) {
  obter(db, id);
  const { total } = db.prepare('SELECT COUNT(*) AS total FROM inscricao WHERE turma_id = ?').get(id);
  if (total > 0) throw conflito('Não é possível excluir uma turma que possui inscrições');
  db.prepare('DELETE FROM turma WHERE id = ?').run(id);
}
