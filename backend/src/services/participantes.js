import { conflito, naoEncontrado } from '../errors.js';

export function listar(db) {
  return db.prepare('SELECT * FROM participante ORDER BY nome').all();
}

export function obter(db, id) {
  const participante = db.prepare('SELECT * FROM participante WHERE id = ?').get(id);
  if (!participante) throw naoEncontrado('Participante não encontrado');
  return participante;
}

function garantirEmailUnico(db, email, idAtual = 0) {
  const outro = db.prepare('SELECT id FROM participante WHERE email = ? AND id <> ?').get(email, idAtual);
  if (outro) throw conflito('Já existe um participante com este e-mail');
}

export function criar(db, dados) {
  garantirEmailUnico(db, dados.email);
  const { lastInsertRowid } = db
    .prepare('INSERT INTO participante (nome, email, setor) VALUES (?, ?, ?)')
    .run(dados.nome, dados.email, dados.setor);
  return obter(db, Number(lastInsertRowid));
}

export function atualizar(db, id, dados) {
  obter(db, id);
  garantirEmailUnico(db, dados.email, id);
  db.prepare('UPDATE participante SET nome = ?, email = ?, setor = ? WHERE id = ?').run(
    dados.nome,
    dados.email,
    dados.setor,
    id,
  );
  return obter(db, id);
}

export function excluir(db, id) {
  obter(db, id);
  const { total } = db.prepare('SELECT COUNT(*) AS total FROM inscricao WHERE participante_id = ?').get(id);
  if (total > 0) throw conflito('Não é possível excluir um participante que possui inscrições');
  db.prepare('DELETE FROM participante WHERE id = ?').run(id);
}
