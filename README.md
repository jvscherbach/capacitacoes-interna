# Capacitações Internas

MVP web para gestão de capacitações internas: cadastro de cursos e turmas (capacitação = curso + turma, com período e vagas), inscrição de participantes respeitando as vagas, marcação de conclusão e um dashboard com três indicadores (**Turmas · Participantes · Concluintes**).

Laboratório individual — Desafio 07 · SEMA/MT (Engenharia de Software Agêntica). Funciona localmente e usa **dados exclusivamente fictícios** (e-mails `@exemplo.test`).

## Stack
- **Backend:** Node.js (ESM) · Express 5 · better-sqlite3 (SQLite em arquivo local) · zod · SQL escrito à mão
- **Frontend:** React + Vite · CSS puro com variáveis · lucide-react
- **Testes:** Vitest + supertest (API, banco SQLite em memória)
- Decisões registradas em `docs/adr/` (ADR-001 escopo, ADR-002 design, ADR-003 migração para Node.js)

## Requisitos
- Node.js LTS ≥ 20 (recomendado ≥ 22; validado com v22.19.0) e npm (validado com 10.9.3) — `node --version`, `npm --version`
- Windows / PowerShell (Git é opcional, só para versionar)

## Instalação e execução local (Windows / PowerShell)
Na raiz do projeto, um comando por vez:
```powershell
npm run install:all     # instala raiz, backend e frontend
npm run dev             # sobe API (http://localhost:8000) e interface (http://localhost:5173)
```
Abra **http://localhost:5173** no navegador. Para parar, `Ctrl+C` no terminal.

Separadamente: `npm run dev:backend` · `npm run dev:frontend`.

**Dica:** se o PowerShell bloquear o `npm` (política de execução), use `npm.cmd` no lugar de `npm` (por exemplo `npm.cmd run dev`) ou rode uma vez:
```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```
O banco é criado sozinho em `backend/data/capacitacoes.db` (não versionado). Para carregar dados fictícios de exemplo (opcional, manual):
```powershell
npm run seed --prefix backend
```
Variáveis opcionais: `PORT` (API, padrão 8000), `DB_PATH` (arquivo do banco) e `VITE_API_URL` (URL da API usada pelo frontend).

## Como rodar os testes
```powershell
npm test                # 30 testes do backend (Vitest + supertest), casos T01–T14 e extras
npm run build           # build de produção do frontend
```

## Funcionalidades
- **Cursos, turmas e participantes:** cadastrar, listar, editar e excluir (exclusão bloqueada quando há vínculos).
- **Inscrição** de participante em turma com controle de vagas; **cancelamento** libera a vaga.
- **Conclusão** da inscrição (repetir a ação não tem efeito colateral).
- **Dashboard** com Turmas, Participantes (inscritos em ao menos uma turma) e Concluintes, calculados por consulta ao banco.
- Situação da turma derivada no frontend: *Vagas abertas*, *Quase lotada* (≥ 80 %) e *Lotada*, com barra de ocupação.
- Mensagens de erro da API exibidas na interface (sem vaga, inscrição duplicada, exclusão bloqueada, validações).
- Layout responsivo (sidebar no desktop; menu recolhível e tabelas empilhadas no celular), estados vazios e de carregamento.

## Exemplos de uso
### Fluxo na interface
1. **Cursos → Novo curso:** nome e carga horária (ex.: "Introdução à Análise de Dados", 20 h).
2. **Turmas → Nova turma:** escolha o curso, informe código, vagas e período.
3. **Participantes → Novo participante:** nome e e-mail (ex.: `ana@exemplo.test`).
4. Abra a turma (clique no código) e use **Inscrever participante** até lotar; a tentativa seguinte mostra "Turma sem vagas disponíveis".
5. Em **Concluir**, marque a conclusão; **Cancelar inscrição** libera a vaga.
6. Volte ao **Dashboard** e confira os três indicadores.

### Chamadas à API
Contratos completos em `docs/ARQUITETURA.md`. Erros seguem `{"detail": "mensagem"}` (404 inexistente, 409 regra de negócio, 422 validação).
```powershell
curl.exe http://localhost:8000/health
curl.exe http://localhost:8000/api/dashboard
curl.exe -X POST http://localhost:8000/api/cursos -H "Content-Type: application/json" -d '{\"nome\":\"Curso Fictício\",\"carga_horaria\":8}'
curl.exe -X POST http://localhost:8000/api/inscricoes -H "Content-Type: application/json" -d '{\"turma_id\":1,\"participante_id\":1}'
curl.exe -X PATCH http://localhost:8000/api/inscricoes/1/concluir
```

## Estrutura de pastas
```
capacitacoes-internas/
├── package.json            # scripts da raiz (install:all, dev, test, build, ...)
├── backend/
│   ├── package.json
│   ├── data/               # SQLite local (ignorado no Git)
│   ├── src/                # server.js, app.js, db.js, schemas.js, services/, routes/, seed.js
│   └── tests/              # Vitest + supertest
├── frontend/
│   ├── public/             # logo e favicon
│   └── src/                # api.js, components/, pages/, styles/
└── docs/                   # PLANO, REQUISITOS, ARQUITETURA, TESTES, DESIGN, EXECUCAO, BACKLOG, adr/, prompts/
```

## Resultados dos testes (execução real, Sprint 3)
- **Automatizados:** `npm test` → 6 arquivos, **30 testes aprovados** (T01–T14 e extras); `npm run build` → 1596 módulos, sem erro.
- **Roteiro manual de homologação** (11 itens, backend e frontend rodando): 11 aprovados, com 1 defeito encontrado e corrigido no item 2.
- **Falha encontrada e corrigida:** ao abrir "Nova turma" antes de os cursos carregarem, o formulário guardava o curso vazio e a API respondia "curso_id deve ser um número inteiro". Correção: o formulário só é montado depois que os dados carregam, e as mensagens de validação de turma passaram a usar rótulos legíveis ("Curso é obrigatório", "Início do período…"). Há um teste de regressão para a mensagem.
- Detalhes, comandos e saídas: `docs/EXECUCAO.md` e `docs/TESTES.md`.

## Limitações do MVP
- Sem login/perfis, exportação, e-mail, lista de espera ou paginação (pensado para poucas pessoas).
- Reduzir as vagas de uma turma abaixo do número de inscritos não é bloqueado.
- No detalhe da turma, a lista de participantes para inscrição já exclui quem está inscrito; a recusa de inscrição duplicada vem da API e aparece no modal "Inscrever participante" do Dashboard.
- O `npm audit` aponta vulnerabilidades em dependências de desenvolvimento (Vitest/Vite); não afetam a execução local.
- Contraste AA e concorrência real de requisições simultâneas não foram medidos.

## Deploy na Vercel (configuração, ADR-004)
O `vercel.json` da raiz define dois serviços: `backend` (Express) e `frontend` (Vite), com `/api/*` → backend e o restante → frontend, no mesmo domínio. O frontend chama a API em `/api` (mesma origem); localmente continua em `http://localhost:8000/api`.

**Atenção:** na Vercel o SQLite fica em `/tmp`, que é efêmero e por instância; os dados **não persistem** de forma confiável. Para persistência real é preciso um banco externo (ex.: PostgreSQL), o que exige trocar `backend/src/db.js` e registrar novo ADR. O deploy em si **não foi testado** (sem acesso à conta/CLI da Vercel nesta sessão).

## Evoluções possíveis
Login e perfis · Docker · Kubernetes · deploy (por exemplo Vercel para o frontend) · PostgreSQL (trocar a camada `backend/src/db.js` por `pg`) · lista de espera · exportação de relatórios.

## Evidências (capturas de tela)
_Espaço reservado para o João inserir as capturas. Telas sugeridas:_
- _Dashboard com os três indicadores e a lista de turmas_
- _Turmas (lista com chips e barras de ocupação)_
- _Detalhe da turma com inscritos e status_
- _Erro de vaga ("Turma sem vagas disponíveis")_
- _Cursos_
- _Participantes_
- _Saída de `npm test` no terminal (30 testes aprovados)_
- _(Opcional) Dashboard em largura de celular_

## Reflexão
_Espaço reservado para o João escrever 3 a 5 linhas: uma decisão técnica que você tomou (por exemplo, a troca de stack para Node.js) e uma sugestão do Claude Code que precisou ser revisada ou corrigida (por exemplo, o formulário de turma que guardava o curso vazio)._

## Links
- Repositório GitHub: _a preencher pelo João_
- URL online (opcional): _a preencher pelo João_
