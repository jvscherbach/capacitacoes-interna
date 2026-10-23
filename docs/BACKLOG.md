# BACKLOG — Capacitações Internas

Regra: implementar **uma sprint por vez**, na ordem. Não avançar se o gate falhar. Status: `PENDENTE` · `EM ANDAMENTO` · `CONCLUÍDA`.

## S0 — Estrutura, ambiente e documentação — `CONCLUÍDA`
**Objetivo:** projeto pronto para receber código, com documentação real e ambiente verificado.
**Dependências:** nenhuma.
**Arquivos prováveis:** `.gitignore`, `README.md` (esqueleto), `package.json` (raiz), `backend/package.json`, `backend/src/`, `backend/tests/`, `frontend/` (pastas), `docs/EXECUCAO.md`, ajustes nos docs existentes.
**Tarefas:**
- Ler HANDOFF e docs; listar decisões e dúvidas antes de agir.
- Criar estrutura `backend/` (`src/`, `data/`, `tests/`), `frontend/` e `.gitignore` (`node_modules`, `dist`, `backend/data/*.db`, `.env`).
- Verificar Node (LTS ≥ 20; recomendado ≥ 22), npm e Git; registrar versões. Preparar instruções Windows/PowerShell (npm, `npm.cmd`, política de execução).
- Criar `package.json` da raiz (scripts `install:all`, `dev:backend`, `dev:frontend`, `dev`, `test`, `build`) e `backend/package.json` (express, better-sqlite3, zod; dev: vitest, supertest). Instalar dependências só se necessário para validar o gate; `frontend/package.json` é criado na S2.
- Esqueleto de README.
**Verificação:** `node --version`, `npm --version`, `git --version`; listagem da estrutura.
**Aceite:** estrutura existe; verificações registradas; nenhum segredo; nenhum código de negócio.
**Evidência:** saída dos comandos em `docs/EXECUCAO.md`.
**Parada:** ao concluir S0. Não iniciar S1.
**Prompt:** `docs/prompts/S0.md`

## S1 — Banco + API CRUD + indicadores — `CONCLUÍDA`
**Objetivo:** backend completo e testado: modelos, regras RN01–RN08, CRUD, inscrição/conclusão e `GET /dashboard`.
**Dependências:** S0 concluída.
**Arquivos prováveis:** `backend/src/*` (`app.js`, `db.js`, `schemas.js`, `services/`, `routes/`, `seed.js`, `server.js`), `backend/tests/*`, `docs/EXECUCAO.md`.
**Tarefas:** `db.js` (tabelas e SQL à mão, `PRAGMA foreign_keys=ON`); schemas zod; serviços com regras; rotas; CORS; seed manual com dados fictícios; testes Vitest + supertest com `createApp(db)` e SQLite em memória (CRUD, vaga esgotada, duplicidade, conclusão, dashboard, persistência em arquivo).
**Verificação:** `npm test`; subir `npm run dev:backend` e chamar `/health` e `/api/dashboard` na porta 8000.
**Aceite:** CA-01 (via API), CA-02 e CA-03 demonstrados; todos os testes verdes; falhas encontradas corrigidas e registradas.
**Evidência:** saída do `npm test` e de chamadas reais em `docs/EXECUCAO.md`.
**Parada:** testes falhando = não avançar. Não criar frontend.
**Prompt:** `docs/prompts/S1.md`

## S2 — Frontend, integração, testes finais e README — `CONCLUÍDA`
**Objetivo:** interface responsiva integrada à API, homologação do MVP e README completo.
**Dependências:** S1 concluída com gate aprovado.
**Arquivos prováveis:** `frontend/*`, `README.md`, `backend/tests/*` (ajustes), `docs/EXECUCAO.md`, `docs/TESTES.md`.
**Design:** seguir `docs/DESIGN.md` (ADR-002); criar primeiro `tokens.css`, layout com sidebar e componentes base (Card, KpiCard, Chip, ProgressBar, PillButton), depois as páginas. Critérios de aceite visual no final de `docs/DESIGN.md`.
**Tarefas:** páginas Dashboard, Turmas, Detalhe da turma, Cursos, Participantes; formulários com validação e mensagens de erro da API; estado vazio; integração via `api.js`; teste manual do roteiro de `docs/TESTES.md`; persistência ao reiniciar; verificação de ausência de segredos; README com instalação, execução, funcionalidades, limitações, exemplos de uso e espaço para capturas de tela e para a reflexão.
**Verificação:** `npm test`; `npm run build`; backend + frontend rodando e fluxo completo executado.
**Aceite:** checklist de homologação (abaixo) todo marcado como aprovado/falhou/não testado, com honestidade.
**Evidência:** saídas de comandos e roteiro manual em `docs/EXECUCAO.md`; indicar onde João deve inserir capturas de tela.
**Parada:** ao concluir; não criar login/deploy. Não executar git de escrita.
**Prompt:** `docs/prompts/S2.md`

## S3 — Testes finais, homologação, revisão e entrega — `CONCLUÍDA`
**Objetivo:** validar o MVP de ponta a ponta, corrigir falhas encontradas, revisar o diff e fechar README e registros. Sem funcionalidades novas e sem mudança de escopo.
**Dependências:** S2 CONCLUÍDA.
**Tarefas:** suíte completa (T01–T14) e `npm run build`; roteiro manual de homologação (11 itens) com APROVADO/FALHOU/NÃO TESTADO; revisão do diff; README completo; registros em `docs/EXECUCAO.md` e `docs/TESTES.md`.
**Aceite:** checklist de homologação abaixo completo, cada item com evidência real.
**Parada:** ao concluir; não criar login/Docker/Kubernetes/deploy. Não executar git de escrita.
**Prompt:** (colado pelo usuário; não versionado em `docs/prompts/`)

## Checklist de homologação
- [x] Sistema inicia localmente; API e interface respondem
- [x] CRUD principal funciona com banco persistente
- [x] Três indicadores mudam conforme os registros
- [x] Testes executados e resultado registrado (aprovado/falhou/não testado)
- [x] README e `docs/EXECUCAO.md` atualizados
- [x] Sem credenciais no repositório
- [x] Critérios de aceite visual de `docs/DESIGN.md` atendidos
