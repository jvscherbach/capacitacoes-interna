import { z } from 'zod';

const texto = (nome) =>
  z
    .string({ required_error: `${nome} é obrigatório`, invalid_type_error: `${nome} deve ser texto` })
    .trim()
    .min(1, `${nome} é obrigatório`);

const inteiro = (nome, minimo) =>
  z
    .number({ required_error: `${nome} é obrigatório`, invalid_type_error: `${nome} deve ser um número inteiro` })
    .int(`${nome} deve ser um número inteiro`)
    .min(minimo, `${nome} deve ser maior ou igual a ${minimo}`);

const dataIso = (nome) =>
  z
    .string({ required_error: `${nome} é obrigatório`, invalid_type_error: `${nome} deve ser texto` })
    .refine((valor) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
      const data = new Date(`${valor}T00:00:00Z`);
      return !Number.isNaN(data.getTime()) && data.toISOString().slice(0, 10) === valor;
    }, `${nome} deve ser uma data válida no formato AAAA-MM-DD`);

const opcional = (nome) =>
  z
    .string({ invalid_type_error: `${nome} deve ser texto` })
    .trim()
    .nullish()
    .transform((valor) => valor || null);

export const cursoSchema = z.object({
  nome: texto('Nome'),
  carga_horaria: inteiro('Carga horária', 1),
  descricao: opcional('Descrição'),
});

export const turmaSchema = z
  .object({
    curso_id: inteiro('curso_id', 1),
    codigo: texto('Código'),
    periodo_inicio: dataIso('periodo_inicio'),
    periodo_fim: dataIso('periodo_fim'),
    vagas: inteiro('Vagas', 1),
  })
  .refine((t) => t.periodo_fim >= t.periodo_inicio, {
    message: 'periodo_fim deve ser maior ou igual a periodo_inicio',
    path: ['periodo_fim'],
  });

export const participanteSchema = z.object({
  nome: texto('Nome'),
  email: texto('E-mail')
    .toLowerCase()
    .refine((valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor), 'E-mail com formato inválido'),
  setor: opcional('Setor'),
});

export const inscricaoSchema = z.object({
  turma_id: inteiro('turma_id', 1),
  participante_id: inteiro('participante_id', 1),
});

export function validar(schema, corpo) {
  return schema.parse(corpo ?? {});
}
