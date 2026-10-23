# Capacitações Internas

MVP web para gestão de capacitações internas: cadastro de cursos e turmas (capacitação = curso + turma, com período e vagas), inscrição de participantes respeitando as vagas, marcação de conclusão e um dashboard com três indicadores (Turmas · Participantes · Concluintes).

Laboratório individual — Desafio 07 · SEMA/MT (Engenharia de Software Agêntica). Funciona localmente e usa **dados exclusivamente fictícios** (e-mails `@exemplo.test`).

## Stack
- **Backend:** Node.js (ESM) · Express 5 · better-sqlite3 (SQLite em arquivo local) · zod · SQL escrito à mão
- **Frontend:** React + Vite · CSS puro com variáveis · lucide-react
- **Testes:** Vitest + supertest (API, banco SQLite em memória)
- Decisões em `docs/adr/` (ADR-001, ADR-002 de design e ADR-003 de migração para Node.js)

## Requisitos (Windows / PowerShell)
- Node.js LTS ≥ 20 (recomendado ≥ 22) e npm — `node --version`, `npm --version`
- Git (opcional, apenas para versionar)

## Instalação e execução
Na raiz do projeto:
```powershell
npm run install:all     # instala raiz, backend e frontend
npm run dev             # API em http://localhost:8000 e frontend em http://localhost:5173
```
Separadamente: `npm run dev:backend` · `npm run dev:frontend`. Abra http://localhost:5173.

O banco é criado automaticamente em `backend/data/capacitacoes.db` (não versionado). Para carregar dados fictícios de exemplo (opcional, manual):
```powershell
npm run seed --prefix backend
```
Se o PowerShell bloquear o `npm` (política de execução), use `npm.cmd` no lugar de `npm` ou rode:
```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```
Variáveis opcionais: `PORT` (API, padrão 8000), `DB_PATH` (arquivo do banco), `VITE_API_URL` (URL da API usada pelo frontend).

## Testes e build
```powershell
npm test                # Vitest + supertest: 29 testes do backend (T01–T14 e extras)
npm run build           # build de produção do frontend
```

## Funcionalidades
- **Cursos, turmas e participantes:** cadastrar, listar, editar e excluir (com bloqueio quando há vínculos).
- **Inscrição** de participante em turma com controle de vagas; **cancelamento** libera a vaga.
- **Conclusão** de inscrição (repetir a ação é idempotente).
- **Dashboard** com Turmas, Participantes (inscritos em ao menos uma turma) e Concluintes, calculados por consulta ao banco.
- Situação da turma derivada no frontend: *Vagas abertas*, *Quase lotada* (≥ 80 %) e *Lotada*, com barra de ocupação.
- Mensagens de erro da API exibidas na interface (sem vaga, inscrição duplicada, exclusão bloqueada, validações).
- Layout responsivo (sidebar no desktop, menu recolhível e tabelas empilhadas no celular), estados vazios e de carregamento.

## Exemplos de uso (API)
Contratos completos em `docs/ARQUITETURA.md`. Erros seguem `{"detail": "mensagem"}` (404 inexistente, 409 regra de negócio, 422 validação).
```powershell
curl.exe http://localhost:8000/health
curl.exe -X POST http://localhost:8000/api/cursos -H "Content-Type: application/json" -d '{\"nome\":\"Curso Fictício\",\"carga_horaria\":8}'
curl.exe http://localhost:8000/api/dashboard
```

## Limitações
- Sem login/perfis, sem exportação, sem e-mail, sem lista de espera e sem paginação (MVP para poucas pessoas).
- Reduzir as vagas de uma turma abaixo do número de inscritos não é bloqueado.
- Sem Docker, Kubernetes ou deploy; PostgreSQL é só evolução documentada (trocar a camada `backend/src/db.js` por `pg`).
- O `npm audit` aponta vulnerabilidades em dependências de desenvolvimento (Vitest/Vite); não afetam a execução local.

## Evidências (capturas de tela)
_Espaço reservado: João insere aqui as capturas de tela (Dashboard, Turmas, Detalhe da turma com erro de vaga, versão celular)._

## Reflexão
_Espaço reservado: texto de 3 a 5 linhas escrito por João._

## Links
- Repositório GitHub: _a preencher por João_
- URL online (opcional): _a preencher por João_

## Documentação
`docs/PLANO.md` · `docs/REQUISITOS.md` · `docs/ARQUITETURA.md` · `docs/TESTES.md` · `docs/DESIGN.md` · `docs/EXECUCAO.md` (evidências reais de cada sprint) · `docs/BACKLOG.md`
