import { Router } from 'express';
import { parseId } from '../errors.js';
import { validar } from '../schemas.js';

// Rotas CRUD padrão (GET/POST /, GET/PUT/DELETE /:id) para um serviço e um schema.
export function rotasCrud(db, servico, schema) {
  const router = Router();
  router.get('/', (req, res) => res.json(servico.listar(db)));
  router.post('/', (req, res) => {
    res.status(201).json(servico.criar(db, validar(schema, req.body)));
  });
  router.get('/:id', (req, res) => res.json(servico.obter(db, parseId(req.params.id))));
  router.put('/:id', (req, res) => {
    const id = parseId(req.params.id);
    res.json(servico.atualizar(db, id, validar(schema, req.body)));
  });
  router.delete('/:id', (req, res) => {
    servico.excluir(db, parseId(req.params.id));
    res.status(204).end();
  });
  return router;
}
