import { Layers, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api.js';
import {
  AvisoErro, Card, CabecalhoPagina, Carregando, Chip, Confirmar, EmptyState, PillButton, ProgressBar,
} from '../components/base.jsx';
import { TurmaModal } from '../components/formularios.jsx';
import { avisarMudanca, useCarga } from '../hooks.js';
import { formatarPeriodo, situacaoTurma } from '../util.js';

const carregar = async () => {
  const [turmas, cursos] = await Promise.all([api.turmas.listar(), api.cursos.listar()]);
  return { turmas, cursos };
};

export default function Turmas() {
  const { dados, erro, carregando, recarregar } = useCarga(carregar);
  const [params, setParams] = useSearchParams();
  const [modal, setModal] = useState(params.get('novo') ? { tipo: 'form' } : null);
  const [erroExclusao, setErroExclusao] = useState('');

  const fechar = () => { setModal(null); setErroExclusao(''); if (params.get('novo')) setParams({}); };
  const feito = () => { fechar(); recarregar(); };

  const excluir = async () => {
    try {
      await api.turmas.excluir(modal.turma.id);
      avisarMudanca();
      feito();
    } catch (e) {
      setErroExclusao(e.message);
    }
  };

  const turmas = dados?.turmas ?? [];
  return (
    <>
      <CabecalhoPagina menor titulo="Turmas" subtitulo="Capacitações = curso + turma, com período e vagas."
        acoes={<PillButton variante="primaria" icone={Plus} onClick={() => setModal({ tipo: 'form' })}>Nova turma</PillButton>} />
      <AvisoErro mensagem={erro} />
      {carregando && <Carregando />}

      {dados && (
        <Card className="espaco">
          {turmas.length === 0 ? (
            <EmptyState icone={Layers} texto="Nenhuma turma cadastrada ainda."
              acao={<PillButton variante="primaria" onClick={() => setModal({ tipo: 'form' })}>Criar primeira turma</PillButton>} />
          ) : (
            <div className="tabela-wrap">
              <table>
                <thead>
                  <tr><th>Código / Curso</th><th>Período</th><th>Vagas</th><th>Situação</th><th><span className="sr-only">Ações</span></th></tr>
                </thead>
                <tbody>
                  {turmas.map((t) => {
                    const s = situacaoTurma(t.vagas_ocupadas, t.vagas);
                    return (
                      <tr key={t.id}>
                        <td data-label="Turma">
                          <Link to={`/turmas/${t.id}`}><strong>{t.codigo}</strong></Link>
                          <span className="sub">{t.curso_nome}</span>
                        </td>
                        <td data-label="Período">{formatarPeriodo(t.periodo_inicio, t.periodo_fim)}</td>
                        <td data-label="Vagas">
                          <ProgressBar percentual={s.pct} tipo={s.tipo} rotulo={`Ocupação da turma ${t.codigo}`} />
                          <span className="sub">{t.vagas_ocupadas} de {t.vagas}</span>
                        </td>
                        <td data-label="Situação"><Chip tipo={s.tipo}>{s.rotulo}</Chip></td>
                        <td className="acoes-celula">
                          <button type="button" className="icone-botao" aria-label={`Editar turma ${t.codigo}`}
                            onClick={() => setModal({ tipo: 'form', turma: t })}><Pencil size={18} /></button>
                          <button type="button" className="icone-botao perigo" aria-label={`Excluir turma ${t.codigo}`}
                            onClick={() => setModal({ tipo: 'excluir', turma: t })}><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {modal?.tipo === 'form' && <TurmaModal turma={modal.turma} cursos={dados?.cursos ?? []} onClose={fechar} onFeito={feito} />}
      {modal?.tipo === 'excluir' && (
        <Confirmar titulo="Excluir turma" erro={erroExclusao} onClose={fechar} onConfirmar={excluir}
          texto={`Excluir a turma ${modal.turma.codigo}? Esta ação não pode ser desfeita.`} />
      )}
    </>
  );
}
