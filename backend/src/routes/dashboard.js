import { Router } from 'express';
import { indicadores } from '../services/dashboard.js';

export function rotasDashboard(db) {
  const router = Router();
  router.get('/', (req, res) => res.json(indicadores(db)));
  return router;
}
