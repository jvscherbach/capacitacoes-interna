# CLAUDE.md — Capacitações Internas

MVP web fictício de gestão de capacitações internas (laboratório individual SEMA/MT, Desafio 07). Funciona localmente, com **dados exclusivamente fictícios**.

## Leitura obrigatória antes de qualquer ação
1. `HANDOFF_CLAUDE_CODE.md` (raiz) — decisões e pendências
2. `docs/BACKLOG.md` — sprint pendente
3. `docs/REQUISITOS.md`, `docs/ARQUITETURA.md`, `docs/TESTES.md`
4. `docs/adr/ADR-001.md`, `ADR-002.md` e `ADR-003.md` (stack Node.js)
5. `docs/DESIGN.md` (antes de qualquer trabalho de frontend)

## Design do frontend
- Seguir `docs/DESIGN.md` e a referência `docs/design/referencia-ui.png` (ADR-002): sidebar, cartões brancos arredondados, acento roxo/turquesa, chips pastel, barras de ocupação.
- Somente estilo e layout; **não reproduzir marca, logotipo, textos nem recursos da imagem** (IA, caixa de entrada, calendário).
- CSS puro com variáveis em `src/styles/tokens.css`; sem biblioteca de UI. Texto da interface em português do Brasil.

## Stack (ADR-003)
- Runtime único: Node.js LTS (≥ 20; recomendado ≥ 22), JavaScript ESM, `npm`; nenhum outro runtime.
- Backend: Express 5 · better-sqlite3 (SQLite em `backend/data/capacitacoes.db`) · zod · SQL à mão, sem ORM · Vitest + supertest
- Frontend: React + Vite (JavaScript)
- Ambiente do usuário: Windows / PowerShell (se o PowerShell bloquear `npm`, usar `npm.cmd` ou `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`)

## Estrutura
```
package.json   scripts da raiz (install:all, dev:backend, dev:frontend, dev, test, build)
backend/       API Express (src/, data/, tests/)
frontend/      interface React/Vite
docs/          documentação viva (ver lista acima)
```

## Comandos (PowerShell, a partir da raiz)
```powershell
npm run install:all
npm run dev        # API :8000 + frontend :5173
npm test           # Vitest + supertest
npm run build
```

## Regras de trabalho
- Implemente **somente a sprint pendente** indicada no BACKLOG. Não avance se o gate da sprint falhar.
- Antes de editar: informe objetivo, arquivos afetados e testes previstos.
- Ciclo: planejar → implementar → executar → testar → corrigir → revalidar → documentar.
- Nunca declare "feito" sem saída de comando ou funcionalidade demonstrada. Sem saída real, marque **NÃO TESTADO**.
- Mudança de escopo, stack ou regra de negócio exige novo ADR em `docs/adr/` antes de implementar.
- Registre o que foi realmente validado em `docs/EXECUCAO.md` ao fim de cada sprint.
- Sem login, Docker ou Kubernetes no MVP (evoluções futuras). Deploy: apenas a configuração de Vercel registrada na `docs/adr/ADR-004.md` (banco efêmero na Vercel; ver ADR).

## Segurança e dados
- Nenhuma credencial real, nenhum dado institucional. Apenas dados fictícios (nomes, e-mails `@exemplo.test`).
- Não criar `.env` com segredos; se necessário, apenas `.env.example` sem valores reais.
- O arquivo do banco SQLite (`backend/data/*.db`) não é versionado.

## Git
- **Não execute comandos git de escrita** (init, add, commit, push, gh etc.). O usuário revisa o diff e versiona por conta própria.
- Permitido: `git diff` (leitura), quando houver repositório.
- Ao fim de cada sprint, **proponha** a mensagem de commit em `docs/EXECUCAO.md`.

## Convenções
- Código em JavaScript ESM (`import`/`export`); identificadores em português do domínio (curso, turma, participante) ou inglês técnico, de forma consistente. Nomes de tabelas/colunas em `snake_case` português.
- Erros da API no formato `{"detail": "mensagem"}`: validação zod → 422, regra → 409, inexistente → 404, requisição inválida → 400.
- Documentação em português do Brasil.
