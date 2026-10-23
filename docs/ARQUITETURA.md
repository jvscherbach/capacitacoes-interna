# ARQUITETURA — Capacitações Internas

## Visão geral
```
[React/Vite :5173] --HTTP/JSON--> [Express 5 :8000] --SQL (better-sqlite3)--> [SQLite: backend/data/capacitacoes.db]
```
Monólito simples, 3 camadas no backend: rotas → serviços (regras) → `db.js` (SQL à mão, sem ORM). Decisão de stack: ADR-003.

## Stack
Node.js LTS (≥ 20; recomendado ≥ 22), ESM, JavaScript · Express 5 · better-sqlite3 · zod · Vitest + supertest · React + Vite · `npm` em tudo.
Plano B (não implementado): se `better-sqlite3` falhar no Windows, usar `node:sqlite` (Node 22.5+) trocando apenas `db.js`.
Caminho documentado para PostgreSQL: trocar a camada `db.js` por `pg` — o SQL usa apenas tipos portáveis.

## Mapa de pastas
```
capacitacoes-internas/
├── CLAUDE.md
├── HANDOFF_CLAUDE_CODE.md
├── README.md
├── .gitignore
├── package.json             # scripts: install:all, dev:backend, dev:frontend, dev (concurrently), test, build
├── backend/
│   ├── package.json
│   ├── data/                # SQLite local (ignorado no Git)
│   ├── src/
│   │   ├── server.js        # sobe a API (PORT, padrão 8000)
│   │   ├── app.js           # createApp(db): CORS, rotas, tratamento de erros
│   │   ├── db.js            # abre o banco, cria tabelas, PRAGMA foreign_keys=ON
│   │   ├── schemas.js       # zod
│   │   ├── services/        # regras RN01–RN08
│   │   ├── routes/          # cursos, turmas, participantes, inscricoes, dashboard
│   │   └── seed.js          # dados fictícios, execução manual
│   └── tests/               # vitest + supertest (T01–T14)
├── frontend/                # Vite + React (páginas, componentes, api.js)
└── docs/                    # PLANO, REQUISITOS, ARQUITETURA, BACKLOG, TESTES, EXECUCAO, adr/, prompts/
```

### Tratamento de erros
Validação zod → 422; conflito de regra de negócio → 409; recurso inexistente → 404; sempre `{"detail": "texto legível"}`.

## Endpoints (prefixo `/api`)
| Recurso | Método e rota | Sucesso | Erros |
|---|---|---|---|
| Cursos | `GET/POST /cursos`, `GET/PUT/DELETE /cursos/{id}` | 200/201/204 | 404, 409 (tem turmas), 422 |
| Turmas | `GET/POST /turmas`, `GET/PUT/DELETE /turmas/{id}` | 200/201/204 | 404, 409 (tem inscrições), 422 |
| Participantes | `GET/POST /participantes`, `GET/PUT/DELETE /participantes/{id}` | 200/201/204 | 404, 409 (e-mail duplicado / tem inscrições), 422 |
| Inscrições | `GET /inscricoes?turma_id=`, `POST /inscricoes`, `PATCH /inscricoes/{id}/concluir`, `DELETE /inscricoes/{id}` | 200/201/204 | 404, 409 (sem vaga / duplicada), 422 |
| Dashboard | `GET /dashboard` | 200 | — |
| Saúde | `GET /health` | 200 | — |

### Contratos principais
- `POST /turmas` → `{curso_id, codigo, periodo_inicio, periodo_fim, vagas}`; resposta inclui `vagas_ocupadas`.
- `POST /inscricoes` → `{turma_id, participante_id}`; resposta: inscrição com `status: "inscrito"`.
- `PATCH /inscricoes/{id}/concluir` → inscrição com `status: "concluido"` e `data_conclusao`.
- `GET /dashboard` → `{"turmas": int, "participantes": int, "concluintes": int}`.
- Erro: `{"detail": "texto legível"}`.

## Telas (S2)
1. **Dashboard** — 3 cartões com os indicadores.
2. **Turmas** — tabela (curso, código, período, vagas ocupadas/total) + formulário criar/editar/excluir.
3. **Turma (detalhe)** — lista de inscritos, inscrever participante, marcar conclusão, cancelar inscrição.
4. **Cursos** e **Participantes** — listas simples com formulário.
Layout e estilo visual: **seguir `docs/DESIGN.md`** (sidebar + cartões arredondados, chips pastel, barras de ocupação; ref. `docs/design/referencia-ui.png`). CSS puro com variáveis, sem biblioteca de UI (ADR-002).

Estrutura sugerida do frontend:
```
frontend/src/
├── api.js
├── styles/tokens.css, global.css
├── components/  Sidebar, KpiCard, Card, Chip, ProgressBar, PillButton, EmptyState, Modal
└── pages/       Dashboard, Turmas, TurmaDetalhe, Cursos, Participantes
```

## Consultas dos indicadores (SQL de referência)
```sql
SELECT COUNT(*) FROM turma;
SELECT COUNT(DISTINCT participante_id) FROM inscricao;
SELECT COUNT(*) FROM inscricao WHERE status = 'concluido';
```

## Como validar cada camada
| Camada | Como |
|---|---|
| Banco | Tabelas criadas ao iniciar (`db.js`); reinício preserva dados (teste de persistência em arquivo) |
| API | `npm test` (Vitest + supertest, `createApp(db)` com SQLite `:memory:` por teste); chamadas manuais com `curl.exe`/`Invoke-RestMethod` |
| Frontend | `npm run build` sem erro + fluxo manual: criar turma → inscrever → concluir → conferir dashboard |
| Integração | Backend e frontend rodando juntos (CORS liberado para `http://localhost:5173`) |

## Premissas
- Uso por poucas pessoas, sem concorrência pesada.
- Sem autenticação (ADR-001).
- Datas em formato ISO `YYYY-MM-DD`.
- Node LTS ≥ 20 (recomendado ≥ 22) disponível; `better-sqlite3` instala binário pré-compilado no Windows (senão, plano B em ADR-003).
- Chamadas ao SQLite são síncronas (`better-sqlite3`); a regra de vagas roda em transação, o que a protege de corrida no MVP.
- Frontend em `http://localhost:5173` e API em `http://localhost:8000` (CORS liberado só para a origem do frontend).
