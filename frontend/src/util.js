const CORES_CURSO = ['#6C5CE7', '#2B2BD6', '#2CCFC0', '#F59E0B', '#EC4899', '#10B981'];

export const corDoCurso = (id) => CORES_CURSO[id % CORES_CURSO.length];

// 'AAAA-MM-DD' -> 'DD/MM/AAAA' (sem passar por Date, para evitar deslocamento de fuso)
export function formatarData(iso) {
  if (!iso) return '—';
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

export const formatarPeriodo = (inicio, fim) =>
  inicio === fim ? formatarData(inicio) : `${formatarData(inicio)} a ${formatarData(fim)}`;

export const percentual = (ocupadas, vagas) => (vagas > 0 ? Math.round((ocupadas / vagas) * 100) : 0);

// Situação derivada no frontend (ADR-002): sem campo novo na API.
export function situacaoTurma(ocupadas, vagas) {
  const pct = percentual(ocupadas, vagas);
  if (ocupadas >= vagas) return { rotulo: 'Lotada', tipo: 'danger', pct };
  if (pct >= 80) return { rotulo: 'Quase lotada', tipo: 'warn', pct };
  return { rotulo: 'Vagas abertas', tipo: 'neutral', pct };
}

export const plural = (n, singular, pluralTexto) => `${n} ${n === 1 ? singular : pluralTexto}`;

export const numeroOuNulo = (valor) => (String(valor).trim() === '' ? null : Number(valor));
