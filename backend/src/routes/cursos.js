import { cursoSchema } from '../schemas.js';
import * as servico from '../services/cursos.js';
import { rotasCrud } from './crud.js';

export const rotasCursos = (db) => rotasCrud(db, servico, cursoSchema);
