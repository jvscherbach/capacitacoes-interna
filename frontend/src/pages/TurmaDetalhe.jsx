import { ArrowLeft, CheckCircle2, UserPlus, Users, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import {
  AvisoErro, Card, CabecalhoPagina, Carregando, Chip, Confirmar, EmptyState, PillButton, ProgressBar,
} from '../components/base.jsx';
import { InscreverModal } from '../components/formularios.jsx';
import { avisarMudanca, useCarga } from '../hooks.js';
import { formatarData, formatarPeriodo, situacaoTurma } from '../util.js';

export default function TurmaDetalhe() {
  const { id } = useParams();
  const carregar = useCallback(async () => {
    const [turma, inscricoes, participantes] = await Promise.all([
      api.turmas.obter(id), api.inscricoes.listarPorTurma(id), api.participantes.listar(),
    ]);
    return { turma, inscricoes, participantes };
  }, [id]);
  const { dados, erro, carregando, recarregar } = useCarga(carregar);
  const [modal, setModal] = useState(null);
  const [erroAcao, setErroAcao] = useState('');

  const fechar = () => { setModal(null); };
  const feito = () => { fechar(); recarregar(); };

  const concluir = async (inscricao) => {
    setErroAcao('');
    try { await api.inscricoes.concluir(inscricao.id); avisarMudanca(); recarregar(); }
    catch (e) { setErroAcao(e.message); }
  };
  const cancelar = async () => {
    try { await api.inscricoes.cancelar(modal.inscricao.id); avisarMudanca(); feito(); }
    catch (e) { setErroAcao(e.message); }
  };

  if (carregando) return <Carregando />;
  if (erro) return (<><Link to="/turmas" className="voltar"><ArrowLeft size={16} /> Voltar às turmas</Link><AvisoErro mensagem={erro} /></>);

  const { turma, inscricoes, participantes } = dados;
  const s = situacaoTurma(turma.vagas_ocupadas, turma.vagas);
  const inscritosIds = new Set(inscricoes.map((i) => i.participante_id));
  const disponiveis = participantes.filter((p) => !inscritosIds.has(p.id));

  return (
    <>
      <Link to="/turmas" className="voltar"><ArrowLeft size={16} aria-hidden="true" /> Voltar às turmas</Link>
      <CabecalhoPagina menor titulo={turma.codigo} subtitulo={turma.curso_nome}
        acoes={<PillButton variante="primaria" icone={UserPlus} onClick={() => { setErroAcao(''); setModal({ tipo: 'inscrever' }); }}>Inscrever participante</PillButton>} />
      <div className="meta-linha">
        <Chip tipo={s.tipo}>{s.rotulo}</Chip>
        <span>{formatarPeriodo(turma.periodo_inicio, turma.periodo_fim)}</span>
        <span>{turma.vagas_ocupadas} de {turma.vagas} vagas ocupadas</span>
      </div>
      <Card>
        <ProgressBar percentual={s.pct} tipo={s.tipo} rotulo="Ocupação de vagas" />
      </Card>

      <AvisoErro mensagem={modal ? '' : erroAcao} />
      <Card titulo="Inscritos" icone={Users} className="espaco">
        {inscricoes.length === 0 ? (
          <EmptyState icone={Users} texto="Nenhum participante inscrito nesta turma."
            acao={<PillButton variante="primaria" onClick={() => setModal({ tipo: 'inscrever' })}>Inscrever participante</PillButton>} />
        ) : (
          <div className="tabela-wrap">
            <table>
              <thead><tr><th>Participante</th><th>Inscrição</th><th>Status</th><th><span className="sr-only">Ações</span></th></tr></thead>
              <tbody>
                {inscricoes.map((i) => (
                  <tr key={i.id}>
                    <td data-label="Participante"><strong>{i.participante_nome}</strong><span className="sub">{i.participante_email}</span></td>
                    <td data-label="Inscrição">{formatarData(i.data_inscricao)}</td>
                    <td data-label="Status">
                      {i.status === 'concluido'
                        ? <Chip tipo="ok">CONCLUÍDO · {formatarData(i.data_conclusao)}</Chip>
                        : <Chip tipo="info">INSCRITO</Chip>}
                    </td>
                    <td className="acoes-celula">
                      {i.status !== 'concluido' && (
                        <PillButton variante="pequena" icone={CheckCircle2} onClick={() => concluir(i)}>Concluir</PillButton>
                      )}{' '}
                      <PillButton variante="pequena perigo" icone={X}
                        onClick={() => { setErroAcao(''); setModal({ tipo: 'cancelar', inscricao: i }); }}>Cancelar inscrição</PillButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {modal?.tipo === 'inscrever' && (
        <InscreverModal turmas={[turma]} participantes={disponiveis} turmaFixa={turma.id} onClose={fechar} onFeito={feito} />
      )}
      {modal?.tipo === 'cancelar' && (
        <Confirmar titulo="Cancelar inscrição" rotuloConfirmar="Cancelar inscrição" erro={erroAcao} onClose={fechar} onConfirmar={cancelar}
          texto={`Cancelar a inscrição de ${modal.inscricao.participante_nome}? A vaga será liberada.`} />
      )}
    </>
  );
}
