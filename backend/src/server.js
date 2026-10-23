import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';
import { abrirBanco } from './db.js';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const caminhoBanco = process.env.DB_PATH ?? path.join(aqui, '..', 'data', 'capacitacoes.db');
const porta = Number(process.env.PORT ?? 8000);

const db = abrirBanco(caminhoBanco);
createApp(db).listen(porta, () => {
  console.log(`API em http://localhost:${porta} (banco: ${caminhoBanco})`);
});
