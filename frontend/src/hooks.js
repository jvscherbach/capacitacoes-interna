import { useCallback, useEffect, useState } from 'react';

const EVENTO = 'dados-alterados';

// Avisa componentes que mostram dados globais (ex.: lista de cursos da sidebar) para recarregarem.
export const avisarMudanca = () => window.dispatchEvent(new Event(EVENTO));

export function aoMudarDados(funcao) {
  window.addEventListener(EVENTO, funcao);
  return () => window.removeEventListener(EVENTO, funcao);
}

// `carregar` deve ser estável (função de módulo ou useCallback).
export function useCarga(carregar) {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  const recarregar = useCallback(async () => {
    try {
      setErro('');
      setDados(await carregar());
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [carregar]);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  return { dados, erro, carregando, recarregar };
}
