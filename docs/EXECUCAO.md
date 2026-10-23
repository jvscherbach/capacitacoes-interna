# EXECUÇÃO — Registro de evidências

Preenchido pelo Claude Code ao fim de cada sprint, **somente com saídas reais**. Itens sem execução: `NÃO TESTADO`.

## Contexto de planejamento
- Planejamento (Claude.ai): concluído em 2026-10-23.
- Implementação: **não iniciada** (stack migrada para Node.js, ADR-003).

## Sprint 0 — Estrutura e ambiente
- Status: CONCLUÍDA (2026-10-23) — stack Node.js (ADR-003)
- Decisões/dúvidas: sem mudança de escopo (nenhum ADR novo). `install:all` instala só raiz e backend, pois o `frontend/package.json` nasce na S2 (`dev:frontend` e `build` só funcionam a partir da S2). RN03 ("inscrições ativas") segue anotada para a S1.
- Ajustes nos docs: nenhuma inconsistência nova encontrada.
- Comandos e resultados reais:
| Comando | Resultado |
|---|---|
| `node --version` | v22.19.0 (LTS ≥ 22) |
| `npm --version` | 10.9.3 |
| `git --version` | git version 2.45.1.windows.1 |
| `npm run install:all` | exit 0; raiz: 25 pacotes (concurrently), backend: 171 pacotes; aviso de depreciação do `prebuild-install` (dependência do better-sqlite3) |
| teste de carga do `better-sqlite3` (banco `:memory:`, create/insert/select) | OK: `{ c: 1 }`, SQLite 3.53.2 — **plano B (`node:sqlite`) não necessário** |
| `npm ls --depth=0` (backend) | better-sqlite3 12.11.1, express 5.3.0, supertest 7.3.1, vitest 3.2.7, zod 3.25.76 |
| `npm audit` (backend) | 3 vulnerabilidades (1 moderada, 2 críticas) em `@vitest/mocker`/`tinypool`, dependências de **desenvolvimento** do Vitest; nenhuma correção forçada aplicada (`npm audit fix --force` traria breaking change). Avaliar na S1 |
| `git status` | não é repositório git (João versiona) |
- Estrutura criada: `package.json` (raiz, scripts install:all/dev:backend/dev:frontend/dev/test/build), `backend/package.json` (ESM), `backend/src/{services,routes}/`, `backend/data/`, `backend/tests/`, `frontend/`, `.gitignore` (Node), `README.md` (esqueleto Windows/PowerShell). Restos da stack anterior já removidos na migração. Sem código de negócio e sem segredos.
- NÃO TESTADO: `npm test` (sem testes ainda), `npm run dev`, `npm run build` (dependem de S1/S2).
- Mensagem de commit sugerida: `chore: estrutura Node (raiz + backend), .gitignore, README e verificação do ambiente (S0)`

## Sprint 1 — Banco + API CRUD
- Status: CONCLUÍDA (2026-10-23)
- Implementado (`backend/src/`): `db.js` (4 tabelas, SQL à mão, `PRAGMA foreign_keys=ON`, CHECKs), `errors.js`, `schemas.js` (zod), `services/` (cursos, turmas, participantes, inscricoes, dashboard), `routes/`, `app.js` (`createApp(db)`, CORS só para `http://localhost:5173`, `/health`, 404 e tratamento de erros), `server.js` (`PORT` padrão 8000, `DB_PATH` opcional), `seed.js` (manual: `npm run seed --prefix backend`). Testes em `backend/tests/`.
- Decisões de implementação (sem mudar regra de negócio): erro de validação zod → 422 com a 1ª mensagem; id não inteiro → 422; JSON malformado → 400; e-mail normalizado para minúsculas e único sem diferenciar caixa; nome de curso e código de turma únicos (409, conforme REQUISITOS); curso/participante inexistente ao criar turma/inscrição → 404; a checagem de vagas (RN03/RN04) e o INSERT rodam numa transação; respostas de turma incluem `curso_nome` e `vagas_ocupadas`, e as de inscrição incluem `participante_nome`/`participante_email` (campos extras, contrato mantido).

### Comandos e saídas reais
`npm test` (raiz → Vitest 3.2.7):
```
 ✓ tests/persistencia.test.js (1 test)
 ✓ tests/dashboard.test.js (2 tests)
 ✓ tests/participantes.test.js (4 tests)
 ✓ tests/turmas.test.js (6 tests)
 ✓ tests/cursos.test.js (9 tests)
 ✓ tests/inscricoes.test.js (7 tests)
 Test Files  6 passed (6)
      Tests  29 passed (29)
```
Servidor real (`node backend/src/server.js` com banco temporário e seed, porta 8000), chamadas HTTP:
```
GET  /health                      -> 200 {"status":"ok"}
GET  /api/dashboard (após seed)   -> 200 {"turmas":2,"participantes":0,"concluintes":0}
POST /api/inscricoes (turma 1, part. 1)   -> 201 status=inscrito
POST /api/inscricoes (repetida)           -> 409
POST /api/inscricoes (turma 2: 2 vagas; 1º e 2º) -> 201, 201
POST /api/inscricoes (3º, turma lotada)   -> 409
PATCH /api/inscricoes/1/concluir          -> 200 status=concluido
GET  /api/dashboard               -> 200 {"turmas":2,"participantes":2,"concluintes":1}
GET  /api/turmas/2                -> 200 vagas=2 vagas_ocupadas=2
DELETE /api/turmas/2 (com inscrições)     -> 409
(reinício do servidor) GET /api/dashboard -> 200 {"turmas":2,"participantes":2,"concluintes":1}
```
Mensagens de erro conferidas com `curl.exe`:
```
POST /api/turmas vagas=0      -> {"detail":"Vagas deve ser maior ou igual a 1"} [422]
POST /api/turmas fim<início   -> {"detail":"periodo_fim deve ser maior ou igual a periodo_inicio"} [422]
DELETE /api/cursos/1          -> {"detail":"Não é possível excluir um curso que possui turmas"} [409]
GET  /api/cursos/99           -> {"detail":"Curso não encontrado"} [404]
```

### Resultado dos testes
| Caso | Resultado |
|---|---|
| T01–T14 | APROVADO (29 testes; além de T01–T14: 409 de nome/código duplicado, RN06 curso/participante, RN07, JSON inválido, CORS, 404 de rota, exclusão libera vaga) |
| CA-01 (via API) | APROVADO (CRUD + persistência após reinício demonstrados) |
| CA-02 | APROVADO (inscrição, vaga esgotada e duplicidade recusadas com mensagem; conclusão) |
| CA-03 | APROVADO (T13 e chamadas reais: indicadores mudam conforme os registros) |
- Falhas: nenhuma nos testes automatizados. Um problema de processo: o 1º comando que gravava os testes via shell falhou por erro de aspas e nada foi gravado; os arquivos foram recriados e os testes passaram na primeira execução. Para o registro de falha do desafio, ver a seção própria.
- Limitações/observações: reduzir `vagas` de uma turma abaixo dos inscritos não é bloqueado (regra não prevista nos docs); `npm audit` ainda aponta vulnerabilidades em dependências de desenvolvimento do Vitest (não corrigidas).
- `npm run dev` no backend (`node --watch src/server.js`) iniciou e imprimiu "API em http://localhost:8000 ..." (verificado só a inicialização; as chamadas HTTP acima usaram `node backend/src/server.js`).
- NÃO TESTADO: `npm run dev:backend` pela raiz; concorrência real de requisições simultâneas.
- Mensagem de commit sugerida: `feat(backend): API Express + SQLite com cursos, turmas, participantes, inscrições, dashboard e testes (S1)`

## Sprint 2 — Frontend, integração e README
- Status: PENDENTE
- Comandos e saídas: _a registrar_
- Roteiro manual: _a registrar_
- Mensagem de commit sugerida: _a registrar_

## Migração de stack (ADR-003, 2026-10-23)
**Motivo:** o ambiente do usuário não executa o interpretador da stack anterior; nova stack 100% Node.js. Nenhum código de aplicação escrito; nenhum `npm install` executado.

**Alterado:**
- Criado `docs/adr/ADR-003.md`; `ADR-001` marcada como parcialmente substituída (itens 1, 3 e 4).
- Atualizados: `CLAUDE.md`, `HANDOFF_CLAUDE_CODE.md`, `README.md` (esqueleto), `.gitignore` (Node), `docs/PLANO.md`, `docs/REQUISITOS.md` (RNF05), `docs/ARQUITETURA.md` (diagrama, stack, pastas, erros, premissas, validação), `docs/BACKLOG.md`, `docs/TESTES.md`, `docs/prompts/S0.md`, `S1.md`, `S2.md`, esta seção e a Sprint 0.
- Removidos arquivos criados na primeira tentativa da S0: `backend/requirements.txt`, `tests/` (raiz). `backend/` e `frontend/` mantidos.
- S0 voltou a PENDENTE no BACKLOG (reexecutar com o prompt novo).
- `docs/PLANEJAMENTO.html` **não existe** no projeto: nada a atualizar. NÃO TESTADO/ausente; informe se estiver em outro local.

**Varredura final** (`grep -rniE` pelos termos da stack anterior em `*.md`, `*.html`, `*.json`, `.gitignore`, excluindo ADR-001, ADR-003 e esta seção): saída vazia. Após uma primeira passada que ainda achou 3 menções ("Sem …" em CLAUDE/HANDOFF e nota em S0.md), reescrevi essas frases e repeti: ADR-001 = 3 menções históricas, ADR-003 = 2 menções históricas.

**Mensagem de commit sugerida:** `docs: migra stack para Node.js (Express + better-sqlite3 + Vitest) — ADR-003`

## Falha identificada e corrigida
_a registrar_

## Limitações conhecidas
_a registrar_
