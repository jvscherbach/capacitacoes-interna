import { Router } from 'express';
import { parseId } from '../errors.js';
import { inscricaoSchema, validar } from '../schemas.js';
import * as servico from '../services/inscricoes.js';

export function rotasInscricoes(db) {
  const router = Router();
  router.get('/', (req, res) => {
    const turmaId = req.query.turma_id === undefined ? undefined : parseId(req.query.turma_id);
    res.json(servico.listar(db, turmaId));
  });
  router.post('/', (req, res) => {
    res.status(201).json(servico.criar(db, validar(inscricaoSchema, req.body)));
  });
  router.patch('/:id/concluir', (req, res) => {
    res.json(servico.concluir(db, parseId(req.params.id)));
  });
  router.delete('/:id', (req, res) => {
    servico.excluir(db, parseId(req.params.id));
    res.status(204).end();
  });
  return router;
}
