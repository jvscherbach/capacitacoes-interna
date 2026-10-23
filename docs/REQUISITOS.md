# REQUISITOS — Capacitações Internas

## Requisitos funcionais
| ID | Requisito |
|---|---|
| RF01 | Cadastrar, listar, editar e excluir **Cursos** |
| RF02 | Cadastrar, listar, editar e excluir **Turmas** (capacitação = curso + turma, com período e vagas) |
| RF03 | Cadastrar, listar, editar e excluir **Participantes** |
| RF04 | **Inscrever** participante em turma (respeitando vagas) e cancelar inscrição |
| RF05 | **Marcar conclusão** de uma inscrição |
| RF06 | **Dashboard** com 3 indicadores: turmas, participantes, concluintes |

## Requisitos não funcionais
- RNF01 Executa localmente (Windows/PowerShell) com poucos comandos.
- RNF02 Dados persistem em SQLite entre reinicializações.
- RNF03 Interface responsiva (celular e desktop).
- RNF04 Apenas dados fictícios; sem credenciais.
- RNF05 API documentada automaticamente (`docs/ARQUITETURA.md` com tabela de endpoints e exemplos; geração automática de OpenAPI não é exigida na stack Node, ADR-003).
- RNF06 Interface segue o padrão visual de `docs/DESIGN.md` (ADR-002).

## Regras de negócio
| ID | Regra |
|---|---|
| RN01 | `vagas` ≥ 1 (inteiro) |
| RN02 | `periodo_fim` ≥ `periodo_inicio` |
| RN03 | Inscrição só é aceita se inscrições ativas da turma < `vagas` (senão 409) |
| RN04 | Participante não pode ter duas inscrições na mesma turma (409) |
| RN05 | Conclusão só se aplica a inscrição existente; marcar novamente é idempotente |
| RN06 | Não excluir turma com inscrições, nem curso com turmas, nem participante com inscrições (409) |
| RN07 | E-mail do participante único e com formato válido |
| RN08 | Campos obrigatórios não podem ser vazios (422) |

## Entidades e relacionamentos
```
Curso 1 ──── N Turma 1 ──── N Inscricao N ──── 1 Participante
```
| Entidade | Campos |
|---|---|
| curso | id, nome (obrig., único), carga_horaria (h, > 0), descricao (opc.) |
| turma | id, curso_id (FK), codigo (obrig., único), periodo_inicio, periodo_fim, vagas |
| participante | id, nome, email (único), setor |
| inscricao | id, turma_id (FK), participante_id (FK), status (`inscrito`/`concluido`), data_inscricao, data_conclusao (nulo até concluir). Único (turma_id, participante_id) |

## Indicadores do dashboard (calculados no banco)
| Indicador | Definição |
|---|---|
| Turmas | `COUNT(turma)` |
| Participantes | `COUNT(DISTINCT participante_id)` em inscricao (participantes inscritos em ao menos uma turma) |
| Concluintes | `COUNT(inscricao WHERE status = 'concluido')` |

## Dados fictícios de exemplo (seed)
- Cursos: "Introdução à Análise de Dados" (20h), "Boas Práticas de Documentação" (8h)
- Turmas: `AD-2026-01` (vagas 3), `BPD-2026-01` (vagas 2)
- Participantes: Ana Exemplo, Bruno Teste, Carla Demo (`@exemplo.test`), setor "Setor Fictício"

## Limites do MVP
Sem login, sem exportação, sem e-mail, sem lista de espera, sem paginação (listas pequenas).
