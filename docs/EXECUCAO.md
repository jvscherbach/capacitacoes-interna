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
- Status: PENDENTE
- Comandos e saídas: _a registrar_
- Testes (passou/falhou/corrigido): _a registrar_
- Mensagem de commit sugerida: _a registrar_

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
