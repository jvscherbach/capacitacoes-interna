import { conflito, naoEncontrado } from '../errors.js';

const SELECIONAR = `
  SELECT i.id, i.turma_id, i.participante_id, p.nome AS participante_nome, p.email AS participante_email,
         i.status, i.data_inscricao, i.data_conclusao
  FROM inscricao i
  JOIN participante p ON p.id = i.participante_id`;

const hoje = () => new Date().toISOString().slice(0, 10);

export function listar(db, turmaId) {
  if (turmaId === undefined) {
    return db.prepare(`${SELECIONAR} ORDER BY i.id`).all();
  }
  return db.prepare(`${SELECIONAR} WHERE i.turma_id = ? ORDER BY i.id`).all(turmaId);
}

export function obter(db, id) {
  const inscricao = db.prepare(`${SELECIONAR} WHERE i.id = ?`).get(id);
  if (!inscricao) throw naoEncontrado('Inscrição não encontrada');
  return inscricao;
}

// RN03 e RN04 dentro de uma transação, para que a checagem de vagas e o INSERT sejam atômicos.
export function criar(db, dados) {
  const inscrever = db.transaction(() => {
    const turma = db.prepare('SELECT id, vagas FROM turma WHERE id = ?').get(dados.turma_id);
    if (!turma) throw naoEncontrado('Turma não encontrada');
    const participante = db.prepare('SELECT id FROM participante WHERE id = ?').get(dados.participante_id);
    if (!participante) throw naoEncontrado('Participante não encontrado');

    const duplicada = db
      .prepare('SELECT id FROM inscricao WHERE turma_id = ? AND participante_id = ?')
      .get(dados.turma_id, dados.participante_id);
    if (duplicada) throw conflito('Participante já inscrito nesta turma');

    const { total } = db.prepare('SELECT COUNT(*) AS total FROM inscricao WHERE turma_id = ?').get(turma.id);
    if (total >= turma.vagas) throw conflito('Turma sem vagas disponíveis');

    const { lastInsertRowid } = db
      .prepare('INSERT INTO inscricao (turma_id, participante_id, status, data_inscricao) VALUES (?, ?, ?, ?)')
      .run(dados.turma_id, dados.participante_id, 'inscrito', hoje());
    return Number(lastInsertRowid);
  });
  return obter(db, inscrever());
}

export function concluir(db, id) {
  const inscricao = obter(db, id);
  if (inscricao.status === 'concluido') return inscricao; // RN05: idempotente
  db.prepare("UPDATE inscricao SET status = 'concluido', data_conclusao = ? WHERE id = ?").run(hoje(), id);
  return obter(db, id);
}

export function excluir(db, id) {
  obter(db, id);
  db.prepare('DELETE FROM inscricao WHERE id = ?').run(id);
}
