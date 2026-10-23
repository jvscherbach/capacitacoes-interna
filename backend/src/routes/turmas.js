import { turmaSchema } from '../schemas.js';
import * as servico from '../services/turmas.js';
import { rotasCrud } from './crud.js';

export const rotasTurmas = (db) => rotasCrud(db, servico, turmaSchema);
