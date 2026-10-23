import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';
import { abrirBanco } from './db.js';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const naVercel = Boolean(process.env.VERCEL);
// Na Vercel só /tmp é gravável (e efêmero); localmente o banco fica em backend/data.
const caminhoPadrao = naVercel ? '/tmp/capacitacoes.db' : path.join(aqui, '..', 'data', 'capacitacoes.db');
const caminhoBanco = process.env.DB_PATH ?? caminhoPadrao;
const porta = Number(process.env.PORT ?? 8000);

const app = createApp(abrirBanco(caminhoBanco));

if (!naVercel) {
  app.listen(porta, () => {
    console.log(`API em http://localhost:${porta} (banco: ${caminhoBanco})`);
  });
}

export default app;
