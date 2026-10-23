import { participanteSchema } from '../schemas.js';
import * as servico from '../services/participantes.js';
import { rotasCrud } from './crud.js';

export const rotasParticipantes = (db) => rotasCrud(db, servico, participanteSchema);
