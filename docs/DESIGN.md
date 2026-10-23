# DESIGN — Guia visual do frontend

Referência visual: `docs/design/referencia-ui.png` (painel de produtividade com sidebar, saudação grande, cartões brancos arredondados, chips coloridos e barras de progresso). **Usar apenas o estilo e a estrutura de layout.** Não copiar nome, logotipo, ícones de marca, avatares, textos ou recursos de IA/calendário/caixa de entrada da imagem; o MVP não os possui.

## Princípios
- Visual limpo e leve: fundo claro, cartões brancos com cantos bem arredondados e sombra suave.
- Cor de destaque roxa/violeta; acento turquesa; chips em tons pastel.
- Tipografia grande e em negrito nos títulos; texto secundário em cinza.
- Responsivo: sidebar vira menu recolhível/barra superior em telas estreitas.
- Sem biblioteca de UI pesada: **CSS puro com variáveis** (`src/styles/tokens.css`). Ícones com `lucide-react` (ou SVG inline). Fonte Inter via `@fontsource/inter` (fallback: `system-ui`).

## Tokens (valores iniciais; ajustar à vista)
```css
:root {
  --bg-app: #F7F7FB;        /* fundo da área principal (pode ter grade sutil) */
  --surface: #FFFFFF;       /* cartões */
  --border: #ECEBF3;
  --text: #14142B;
  --muted: #8A8FA3;

  --primary: #6C5CE7;       /* botões, item ativo, dia/seleção */
  --primary-grad: linear-gradient(135deg, #8B7CF6, #5B4BDB);
  --primary-soft: #F0EFFA;  /* item ativo da sidebar, fundos suaves */
  --accent: #2CCFC0;        /* turquesa: barras, linha de destaque do título */

  --chip-info-bg: #BDF0F0;    --chip-info-fg: #0B6E6E;    /* Inscrito */
  --chip-ok-bg: #CFF5E7;      --chip-ok-fg: #0F7A55;      /* Concluído */
  --chip-neutral-bg: #F0F0F4; --chip-neutral-fg: #4A4F63; /* Vagas abertas */
  --chip-warn-bg: #FFD9B8;    --chip-warn-fg: #8A4B0F;    /* Quase lotada */
  --chip-danger-bg: #FFDDE0;  --chip-danger-fg: #D6293A;  /* Lotada / erro */

  --radius-card: 20px;
  --radius-pill: 999px;
  --radius-chip: 10px;
  --shadow-card: 0 4px 20px rgba(60, 50, 120, 0.06);
}
```
Texto de título: 32–40 px, peso 700. Segunda linha da saudação em turquesa (`--accent`, com gradiente opcional). Corpo: 14–16 px.

## Layout
```
┌────────────┬──────────────────────────────────────────────┐
│ Sidebar    │  data (pequena)                              │
│ - Usuário  │  Olá, Organizador(a)           [ações pílula]│
│ - Dashboard│  Como estão as capacitações hoje?            │
│ - Turmas   │  ┌────────┐ ┌────────┐ ┌────────┐            │
│ - Cursos   │  │Turmas  │ │Particip│ │Conclui │  (3 KPIs)  │
│ - Particip.│  └────────┘ └────────┘ └────────┘            │
│            │  ┌── Turmas (lista) ──┐ ┌── Cursos ────────┐ │
│ - Cursos   │  │ chips + barra de   │ │ cartões com ícone│ │
│   (dots)   │  │ vagas ocupadas     │ │ colorido         │ │
│ [cartão]   │  └────────────────────┘ └──────────────────┘ │
└────────────┴──────────────────────────────────────────────┘
```
- **Sidebar** (largura ~260 px, fundo branco, borda): cartão do usuário fictício no topo ("Organizador(a) · Online"); itens com ícone, item ativo em pílula `--primary-soft`; seção "Cursos" com ponto colorido por curso e botão pílula "+ Adicionar"; cartão inferior em gradiente roxo com texto “Ambiente de laboratório · dados fictícios”.
- **Área principal**: fundo `--bg-app`, grade sutil opcional, conteúdo em grid de 2 colunas (1 coluna no celular).
- **Cartões**: fundo `--surface`, borda `--border`, `--radius-card`, `--shadow-card`; cabeçalho com ícone roxo + título; ações (+, expandir, menu) no canto direito quando fizer sentido.

## Componentes e mapeamento ao domínio
| Componente do estilo | Uso no sistema |
|---|---|
| Saudação + botões pílula (um preenchido em gradiente, outros com contorno turquesa) | Dashboard: “Nova turma” (primário), “Inscrever participante”, “Novo participante”, “Novo curso” |
| Cartões de KPI | Os 3 indicadores: **Turmas**, **Participantes**, **Concluintes** (número grande + rótulo + ícone) |
| Lista de tarefas agrupada com chips e cabeçalho de colunas | **Turmas**: colunas Código/Curso · Período · Vagas; grupos opcionais por situação |
| Chips de prioridade (High/Low) | Situação da turma: “Vagas abertas” (neutro), “Quase lotada” (aviso, ≥ 80 %), “Lotada” (perigo) — derivada de `vagas_ocupadas / vagas`, sem campo novo |
| Chips de status (IN PROGRESS / TO DO) | Status da inscrição: “INSCRITO” (info), “CONCLUÍDO” (ok) |
| “My Goals” com barras de progresso e % | Ocupação de vagas por turma (barra turquesa; laranja se alta) com % ao lado |
| “Projects” com ícone colorido e metadados | **Cursos**: ícone/forma colorida, nome, “N turmas · carga horária” |
| Faixa de dias do calendário | Opcional/fora do MVP; usar apenas se sobrar tempo, para mostrar o período da turma selecionada |
| Estado vazio | Ícone suave + texto + botão pílula de ação (“Criar primeira turma”) |
| Formulários | Em modal ou painel lateral com cantos arredondados; botão primário em gradiente; erros da API em chip/aviso vermelho pastel |

## Telas (ver `docs/ARQUITETURA.md`)
1. **Dashboard** — saudação, ações rápidas, 3 KPIs, lista de turmas com barra de ocupação, cartões de cursos.
2. **Turmas** — lista no estilo “tarefas” + criar/editar/excluir.
3. **Detalhe da turma** — cabeçalho com chips e barra de vagas; tabela de inscritos com chip de status, botão “Concluir” e “Cancelar inscrição”; ação “Inscrever participante”.
4. **Cursos** e **Participantes** — grade de cartões / tabela limpa com formulário.

## Responsividade e acessibilidade
- Pontos de quebra: ≥ 1024 px (sidebar fixa + 2 colunas), 640–1023 px (sidebar recolhível, 1–2 colunas), < 640 px (menu superior/hambúrguer, 1 coluna, tabelas viram cartões empilhados).
- Contraste mínimo AA em texto e chips; não depender só de cor para indicar situação (o chip sempre tem texto).
- Foco visível em botões e campos; alvos de toque ≥ 40 px.
- Usar elementos semânticos (`nav`, `main`, `button`, `table`) e `aria-label` nos ícones-botão.

## Critérios de aceite visual (para a S2)
- [ ] Sidebar, saudação, cartões brancos arredondados e chips pastel presentes conforme a referência
- [ ] Botão primário em gradiente roxo; secundários em pílula com contorno
- [ ] Barras de ocupação de vagas com percentual
- [ ] Layout utilizável em largura de celular (~375 px) e desktop
- [ ] Nenhum nome, logotipo ou recurso de marca da imagem de referência reproduzido
