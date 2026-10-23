import express from 'express';
import { ZodError } from 'zod';
import { ErroHttp } from './errors.js';
import { rotasCursos } from './routes/cursos.js';
import { rotasDashboard } from './routes/dashboard.js';
import { rotasInscricoes } from './routes/inscricoes.js';
import { rotasParticipantes } from './routes/participantes.js';
import { rotasTurmas } from './routes/turmas.js';

const ORIGEM_PERMITIDA = 'http://localhost:5173';

export function createApp(db) {
  const app = express();

  app.use((req, res, next) => {
    if (req.headers.origin === ORIGEM_PERMITIDA) {
      res.set('Access-Control-Allow-Origin', ORIGEM_PERMITIDA);
      res.set('Vary', 'Origin');
      res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
    }
    if (req.method === 'OPTIONS') return res.status(204).end();
    next();
  });
  app.use(express.json());

  // `/api/health` é o caminho alcançável na Vercel (só `/api/*` vai para o backend).
  app.get(['/health', '/api/health'], (req, res) => res.json({ status: 'ok' }));
  app.use('/api/cursos', rotasCursos(db));
  app.use('/api/turmas', rotasTurmas(db));
  app.use('/api/participantes', rotasParticipantes(db));
  app.use('/api/inscricoes', rotasInscricoes(db));
  app.use('/api/dashboard', rotasDashboard(db));

  app.use((req, res) => res.status(404).json({ detail: 'Rota não encontrada' }));

  // eslint-disable-next-line no-unused-vars
  app.use((erro, req, res, next) => {
    if (erro instanceof ZodError) {
      return res.status(422).json({ detail: erro.issues[0].message });
    }
    if (erro instanceof ErroHttp) {
      return res.status(erro.status).json({ detail: erro.detail });
    }
    if (erro.type === 'entity.parse.failed') {
      return res.status(400).json({ detail: 'JSON inválido no corpo da requisição' });
    }
    console.error(erro);
    return res.status(500).json({ detail: 'Erro interno do servidor' });
  });

  return app;
}
