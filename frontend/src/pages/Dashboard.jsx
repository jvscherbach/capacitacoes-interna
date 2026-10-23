import { Award, BookOpen, Layers, Plus, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import {
  AvisoErro, Card, CabecalhoPagina, Carregando, Chip, EmptyState, KpiCard, PillButton, ProgressBar,
} from '../components/base.jsx';
import { CursoModal, InscreverModal, ParticipanteModal, TurmaModal } from '../components/formularios.jsx';
import { useCarga } from '../hooks.js';
import { corDoCurso, formatarPeriodo, plural, situacaoTurma } from '../util.js';

const carregarTudo = async () => {
  const [indicadores, turmas, cursos, participantes] = await Promise.all([
    api.dashboard(), api.turmas.listar(), api.cursos.listar(), api.participantes.listar(),
  ]);
  return { indicadores, turmas, cursos, participantes };
};

export default function Dashboard() {
  const { dados, erro, carregando, recarregar } = useCarga(carregarTudo);
  const [modal, setModal] = useState(null);
  const fechar = () => setModal(null);
  const feito = () => { fechar(); recarregar(); };

  const dataExtenso = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  const hoje = dataExtenso.charAt(0).toUpperCase() + dataExtenso.slice(1);
  const { indicadores, turmas = [], cursos = [], participantes = [] } = dados ?? {};

  return (
    <>
      <p className="data-topo">{hoje}</p>
      <CabecalhoPagina
        titulo="Olá, Organizador(a)"
        destaque="Como estão as capacitações hoje?"
        acoes={
          <>
            <PillButton variante="primaria" icone={Plus} onClick={() => setModal('turma')}>Nova turma</PillButton>
            <PillButton icone={UserPlus} onClick={() => setModal('inscrever')}>Inscrever participante</PillButton>
            <PillButton onClick={() => setModal('participante')}>Novo participante</PillButton>
            <PillButton onClick={() => setModal('curso')}>Novo curso</PillButton>
          </>
        }
      />
      <AvisoErro mensagem={erro} />
      {carregando && <Carregando />}

      {dados && (
        <>
          <div className="grade-kpi">
            <KpiCard rotulo="Turmas" valor={indicadores.turmas} icone={Layers} cor="#5b4bdb" fundo="#ece9fd" />
            <KpiCard rotulo="Participantes" valor={indicadores.participantes} icone={Users} cor="#0b6e6e" fundo="#bdf0f0" />
            <KpiCard rotulo="Concluintes" valor={indicadores.concluintes} icone={Award} cor="#0f7a55" fundo="#cff5e7" />
          </div>

          <div className="grade-2">
            <Card titulo="Turmas" icone={Layers}
              acoes={<Link className="pilula pequena" to="/turmas">Ver todas</Link>}>
              {turmas.length === 0 ? (
                <EmptyState icone={Layers} texto="Nenhuma turma cadastrada ainda."
                  acao={<PillButton variante="primaria" onClick={() => setModal('turma')}>Criar primeira turma</PillButton>} />
              ) : (
                <div className="lista">
                  {turmas.map((t) => {
                    const s = situacaoTurma(t.vagas_ocupadas, t.vagas);
                    return (
                      <Link key={t.id} to={`/turmas/${t.id}`} className="item-resumo">
                        <div>
                          <strong>{t.codigo}</strong>
                          <small>{t.curso_nome} · {formatarPeriodo(t.periodo_inicio, t.periodo_fim)}</small>
                        </div>
                        <Chip tipo={s.tipo}>{s.rotulo}</Chip>
                        <ProgressBar percentual={s.pct} tipo={s.tipo} rotulo={`Ocupação da turma ${t.codigo}`} />
                      </Link>
                    );
                  })}
                </div>
              )}
            </Card>

            <Card titulo="Cursos" icone={BookOpen}
              acoes={<Link className="pilula pequena" to="/cursos">Ver todos</Link>}>
              {cursos.length === 0 ? (
                <EmptyState icone={BookOpen} texto="Nenhum curso cadastrado ainda."
                  acao={<PillButton variante="primaria" onClick={() => setModal('curso')}>Criar primeiro curso</PillButton>} />
              ) : (
                <div className="lista">
                  {cursos.map((c) => (
                    <div key={c.id} className="curso-cartao">
                      <span className="curso-icone" style={{ background: corDoCurso(c.id) }}><BookOpen size={22} /></span>
                      <div>
                        <strong>{c.nome}</strong>
                        <small className="subtitulo" style={{ display: 'block' }}>
                          {plural(turmas.filter((t) => t.curso_id === c.id).length, 'turma', 'turmas')} · {c.carga_horaria} h
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </>
      )}

      {modal === 'turma' && <TurmaModal cursos={cursos} onClose={fechar} onFeito={feito} />}
      {modal === 'curso' && <CursoModal onClose={fechar} onFeito={feito} />}
      {modal === 'participante' && <ParticipanteModal onClose={fechar} onFeito={feito} />}
      {modal === 'inscrever' && (
        <InscreverModal turmas={turmas} participantes={participantes} onClose={fechar} onFeito={feito} />
      )}
    </>
  );
}
