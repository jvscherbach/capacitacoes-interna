# TESTES — Capacitações Internas

## Estratégia
- **Automatizado (Vitest + supertest):** API e regras de negócio em `backend/tests/`; `createApp(db)` com SQLite em memória (`:memory:`) a cada teste. O teste T14 usa um arquivo temporário.
- **Manual (S2):** fluxo na interface + persistência ao reiniciar.
- **Build:** `npm run build` sem erros.
- Resultado de cada item: `APROVADO` · `FALHOU` · `NÃO TESTADO` (nunca simular).

## Casos automatizados (S1)
| ID | Caso | Esperado |
|---|---|---|
| T01 | Criar/listar/editar/excluir curso | 201/200/200/204 |
| T02 | Criar turma com `vagas=0` | 422 |
| T03 | Criar turma com fim < início | 422 |
| T04 | Excluir turma com inscrições | 409 |
| T05 | Criar participante com e-mail duplicado | 409 |
| T06 | Inscrever participante em turma com vaga | 201, `status=inscrito` |
| T07 | Inscrever acima das vagas | 409 |
| T08 | Inscrever o mesmo participante duas vezes na mesma turma | 409 |
| T09 | Marcar conclusão (e repetir) | 200, `status=concluido`, idempotente |
| T10 | Recurso inexistente | 404 |
| T11 | Lista vazia | 200 com `[]` |
| T12 | Dashboard em banco vazio | `{0,0,0}` |
| T13 | Dashboard após criar turma, inscrever e concluir | valores atualizam conforme os registros |
| T14 | Persistência: dados presentes após nova sessão/engine no mesmo arquivo | dados mantidos |

## Roteiro manual (S2)
1. Iniciar backend e frontend.
2. Criar curso → criar turma (2 vagas) → criar 3 participantes.
3. Inscrever 2 participantes; tentar o 3º (deve exibir erro de vaga).
4. Marcar uma conclusão; conferir dashboard (turmas 1 · participantes 2 · concluintes 1).
5. Editar a turma; tentar excluir turma com inscrições (erro 409 exibido).
6. Cancelar uma inscrição; conferir dashboard.
7. Reiniciar backend; confirmar que os dados persistem.
8. Conferir telas vazias e tela em largura de celular.
9. Buscar segredos no repositório (padrões `password`, `secret`, `token`, `.env`) e confirmar ausência.

## Comandos (PowerShell)
```powershell
# na raiz do projeto
node --version; npm --version
npm run install:all               # instala raiz, backend e frontend
npm run dev:backend               # API em http://localhost:8000 (/health, /api/...)
npm run dev:frontend              # http://localhost:5173
npm run dev                       # ambos (concurrently)
npm test                          # Vitest + supertest
npm run build                     # build do frontend
```
Se o PowerShell bloquear `npm` (política de execução), use `npm.cmd` ou:
```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```
