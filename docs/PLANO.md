# PLANO — Capacitações Internas (Desafio 07)

## Visão do produto
Sistema web simples para a área organizadora cadastrar capacitações (curso + turma), inscrever participantes respeitando as vagas e marcar a conclusão, com um dashboard de três indicadores. Sistema **fictício**, local, com dados de exemplo.

## Problema
Controle de capacitações internas feito em planilhas soltas: sem controle de vagas, sem visão consolidada de turmas, inscritos e concluintes.

## Usuários (perfis)
| Perfil | Necessidade |
|---|---|
| Organizador(a) de capacitações | Cadastrar cursos/turmas, inscrever participantes, marcar conclusão, ver indicadores |
| Gestor(a) (somente leitura de fato) | Consultar o dashboard |

> MVP sem login: ambos usam a mesma interface (ver ADR-001).

## Escopo do MVP
**Dentro:** CRUD de Curso, Turma e Participante; inscrição de participante em turma com controle de vagas; marcar conclusão; dashboard com 3 indicadores; persistência SQLite; testes automatizados de API; README.
**Fora:** login/perfis, Docker/Kubernetes/Vercel, envio de e-mail, certificados, relatórios exportáveis, lista de espera.

## Critérios de aceite (3 principais)
1. **CA-01 — CRUD:** é possível criar, consultar, editar e excluir turmas (e cursos/participantes) pela interface, e os dados persistem após reiniciar a aplicação.
2. **CA-02 — Inscrição e conclusão:** é possível inscrever participante em turma com vaga disponível e marcar conclusão; inscrição acima das vagas ou duplicada é recusada com mensagem clara.
3. **CA-03 — Dashboard:** os 3 indicadores (turmas, participantes, concluintes) são calculados a partir do banco e mudam após criar turma, inscrever participante ou marcar conclusão.

## Sprints (3, contando a Sprint 0)
| Sprint | Foco | Gate de saída |
|---|---|---|
| S0 | Estrutura, ambiente, documentação real, `.gitignore`, verificações | Ambiente verificado; docs materializados; `docs/EXECUCAO.md` registrado |
| S1 | Banco + API CRUD + inscrição/conclusão + endpoint do dashboard + testes Vitest + supertest | `npm test` verde; CA-01 e CA-02 e CA-03 demonstrados via API |
| S2 | Frontend React/Vite + integração + testes finais + README | Fluxo completo na interface; checklist de homologação; README completo |

Detalhes em `docs/BACKLOG.md`. Prompts de execução em `docs/prompts/`.

## Entregáveis do desafio (rastreio)
- [ ] Repositório GitHub com código e README (publicação feita por João)
- [ ] `docs/PLANO.md` (este arquivo)
- [ ] Evidências de execução (capturas de tela no README)
- [ ] Resultados dos testes (passou / falhou / corrigido) em `docs/EXECUCAO.md`
- [ ] Reflexão obrigatória (3 a 5 linhas) no README — **escrita por João**
- [ ] Falha identificada e corrigida registrada em `docs/EXECUCAO.md`

## Riscos
| Risco | Mitigação |
|---|---|
| Estourar o tempo do encontro | Escopo mínimo; S2 prioriza fluxo principal, estética é secundária |
| Regra de vagas com falha de concorrência | Validar na camada de serviço + teste dedicado |
| Frontend/API desalinhados | Contrato de API fixo em `ARQUITETURA.md`; CORS configurado |
