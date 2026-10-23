export function indicadores(db) {
  const turmas = db.prepare('SELECT COUNT(*) AS total FROM turma').get().total;
  const participantes = db.prepare('SELECT COUNT(DISTINCT participante_id) AS total FROM inscricao').get().total;
  const concluintes = db.prepare("SELECT COUNT(*) AS total FROM inscricao WHERE status = 'concluido'").get().total;
  return { turmas, participantes, concluintes };
}
