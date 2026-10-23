# HANDOFF — Claude.ai → Claude Code

**Projeto:** Capacitações Internas (Desafio 07 · SEMA/MT · Engenharia de Software Agêntica)
**Estado:** planejamento concluído; **nenhum código de aplicação implementado**. Stack migrada para Node.js (ADR-003).

## Missão
MVP web funcional, local, com dados fictícios: cadastrar capacitação (curso + turma), inscrever participante, marcar conclusão, dashboard com Turmas · Participantes · Concluintes.

## Decisões fechadas (ver `docs/adr/ADR-001.md` e `ADR-003.md`)
- Node.js LTS (ESM, JavaScript) + npm como único runtime
- Backend: Express 5 · better-sqlite3 (`backend/data/capacitacoes.db`) · zod · SQL à mão · Vitest + supertest
- Frontend: React + Vite
- Entidades: curso, turma, participante, inscricao
- Sem login, Docker, Kubernetes ou Vercel
- Indicadores calculados por consulta ao banco
- API sob `/api` na porta 8000, erros `{"detail": ...}` (422 validação, 409 regra, 404 inexistente)
- PostgreSQL apenas documentado (trocar a camada `db.js` por `pg`); plano B `node:sqlite` se o `better-sqlite3` falhar no Windows

## Design (ADR-002)
Frontend segue `docs/DESIGN.md` com a referência `docs/design/referencia-ui.png`: sidebar, saudação grande, KPIs, cartões arredondados, chips pastel e barras de ocupação de vagas. Só estilo/layout; sem copiar marca nem recursos da imagem. CSS puro com variáveis.

## Documentos
`docs/DESIGN.md` · `docs/design/referencia-ui.png` · `docs/PLANO.md` · `docs/REQUISITOS.md` · `docs/ARQUITETURA.md` · `docs/BACKLOG.md` · `docs/TESTES.md` · `docs/EXECUCAO.md` · `CLAUDE.md` · `docs/prompts/S0.md`, `S1.md`, `S2.md`

## Sprints (3, em ordem, uma por vez)
1. **S0** estrutura/ambiente/docs
2. **S1** banco + API CRUD + dashboard + testes
3. **S2** frontend + integração + testes finais + README

## Regras do usuário (João)
- **Git/GitHub são operados por João.** Não execute `git init/add/commit/push`, `gh` nem similares; apenas `git diff` se houver repositório. Proponha mensagens de commit em `docs/EXECUCAO.md`.
- Ambiente Windows/PowerShell.
- Não afirme que testes passaram sem executá-los; use `NÃO TESTADO`.
- A reflexão obrigatória do README (3 a 5 linhas) é escrita por João: deixe apenas o espaço reservado.

## Pendências / dúvidas em aberto
- Node/npm/Git já verificados (Node v22.19.0, npm 10.9.3); confirmar a instalação do `better-sqlite3` na S0/S1.
- S0 precisa ser reexecutada com o prompt atualizado (estrutura Node).
- URL do GitHub e URL online (opcional): preenchidas por João após publicar.
- Capturas de tela: tiradas por João (indicar no README onde inserir).

## Como começar
Leia este arquivo, `CLAUDE.md` e `docs/BACKLOG.md`; execute o conteúdo de `docs/prompts/S0.md`.
