# Capacitações Internas

MVP web fictício para gestão de capacitações internas (curso + turma, inscrições, conclusão e dashboard). Laboratório individual — Desafio 07 · SEMA/MT. Funciona localmente, com **dados exclusivamente fictícios**.

> Esqueleto. O conteúdo completo (funcionalidades, exemplos, limitações) é preenchido na Sprint 2. Stack: Node.js + Express + SQLite (better-sqlite3) + React/Vite (ADR-003).

## Pré-requisitos (Windows / PowerShell)
- Node.js LTS ≥ 20 (recomendado ≥ 22) e npm: `node --version`, `npm --version`
- Git (`git --version`) — operado manualmente pelo autor

## Instalação e execução
```powershell
npm run install:all     # instala raiz, backend e frontend
npm run dev             # API em http://localhost:8000 e frontend em http://localhost:5173
```
Separadamente: `npm run dev:backend` · `npm run dev:frontend`.
(Os scripts passam a existir após a S0; API a partir da S1; frontend a partir da S2.)

Se o PowerShell bloquear o `npm` (política de execução), use `npm.cmd` no lugar de `npm` ou rode:
```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

## Testes e build
```powershell
npm test                # Vitest + supertest (backend)
npm run build           # build do frontend
```

## Funcionalidades, limitações e exemplos de uso
_A preencher na Sprint 2._

## Evidências (capturas de tela)
_Espaço reservado: João insere as capturas aqui após a S2._

## Reflexão (3 a 5 linhas)
_Espaço reservado: texto escrito por João._

## Links
- Repositório GitHub: _a preencher por João_
- URL online (opcional): _a preencher por João_
