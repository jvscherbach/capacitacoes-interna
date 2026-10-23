import { AlertTriangle, Inbox, X } from 'lucide-react';
import { useEffect } from 'react';

export function Card({ titulo, icone: Icone, acoes, children, className = '' }) {
  return (
    <section className={`cartao ${className}`}>
      {(titulo || acoes) && (
        <div className="cartao-cab">
          {Icone && (
            <span className="icone" aria-hidden="true">
              <Icone size={20} />
            </span>
          )}
          {titulo && <h2>{titulo}</h2>}
          {acoes && <div className="acoes">{acoes}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function KpiCard({ rotulo, valor, icone: Icone, cor, fundo }) {
  return (
    <section className="cartao kpi" aria-label={rotulo}>
      <span className="kpi-icone" style={{ background: fundo, color: cor }} aria-hidden="true">
        <Icone size={26} />
      </span>
      <div>
        <div className="kpi-valor">{valor ?? '—'}</div>
        <div className="kpi-rotulo">{rotulo}</div>
      </div>
    </section>
  );
}

export function Chip({ tipo = 'neutral', children }) {
  return <span className={`chip ${tipo}`}>{children}</span>;
}

export function ProgressBar({ percentual, tipo = 'neutral', rotulo }) {
  const valor = Math.min(100, Math.max(0, percentual));
  return (
    <div className={`barra ${tipo === 'warn' || tipo === 'danger' ? 'warn' : ''}`}>
      <div
        className="barra-trilho"
        role="progressbar"
        aria-valuenow={valor}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={rotulo}
      >
        <div className="barra-preenchida" style={{ width: `${valor}%` }} />
      </div>
      <span className="barra-valor">{valor}%</span>
    </div>
  );
}

export function PillButton({ variante = '', icone: Icone, children, ...props }) {
  return (
    <button type="button" className={`pilula ${variante}`} {...props}>
      {Icone && <Icone size={18} aria-hidden="true" />}
      {children}
    </button>
  );
}

export function EmptyState({ icone: Icone = Inbox, texto, acao }) {
  return (
    <div className="estado-vazio">
      <span className="icone-grande" aria-hidden="true">
        <Icone size={30} />
      </span>
      <p>{texto}</p>
      {acao}
    </div>
  );
}

export function Carregando() {
  return (
    <div className="carregando" role="status">
      Carregando…
    </div>
  );
}

export function AvisoErro({ mensagem }) {
  if (!mensagem) return null;
  return (
    <div className="aviso-erro" role="alert">
      <AlertTriangle size={18} aria-hidden="true" />
      <span>{mensagem}</span>
    </div>
  );
}

export function Modal({ titulo, onClose, children }) {
  useEffect(() => {
    const aoTeclar = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', aoTeclar);
    return () => document.removeEventListener('keydown', aoTeclar);
  }, [onClose]);

  return (
    <div className="modal-fundo" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={titulo}>
        <div className="modal-cab">
          <h2>{titulo}</h2>
          <button type="button" className="icone-botao" onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Confirmar({ titulo, texto, rotuloConfirmar = 'Excluir', erro, ocupado, onConfirmar, onClose }) {
  return (
    <Modal titulo={titulo} onClose={onClose}>
      <AvisoErro mensagem={erro} />
      <p>{texto}</p>
      <div className="modal-rodape espaco">
        <PillButton onClick={onClose}>Cancelar</PillButton>
        <PillButton variante="perigo" onClick={onConfirmar} disabled={ocupado}>
          {rotuloConfirmar}
        </PillButton>
      </div>
    </Modal>
  );
}

export function Campo({ rotulo, id, children }) {
  return (
    <div className="campo">
      <label htmlFor={id}>{rotulo}</label>
      {children}
    </div>
  );
}

export function CabecalhoPagina({ titulo, destaque, subtitulo, acoes, menor }) {
  return (
    <header className="cabecalho">
      <div>
        <h1 className={`titulo ${menor ? 'menor' : ''}`}>
          {titulo}
          {destaque && <span className="destaque">{destaque}</span>}
        </h1>
        {subtitulo && <p className="subtitulo">{subtitulo}</p>}
      </div>
      {acoes && <div className="acoes-pagina">{acoes}</div>}
    </header>
  );
}
