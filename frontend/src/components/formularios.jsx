import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { avisarMudanca } from '../hooks.js';
import { numeroOuNulo } from '../util.js';
import { AvisoErro, Campo, Modal, PillButton } from './base.jsx';

// Executa `acao`, mostra o erro da API (detail) no modal e só fecha em caso de sucesso.
function useEnvio(onFeito) {
  const [erro, setErro] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const enviar = (acao) => async (evento) => {
    evento?.preventDefault();
    setErro('');
    setOcupado(true);
    try {
      await acao();
      avisarMudanca();
      onFeito();
    } catch (e) {
      setErro(e.message);
    } finally {
      setOcupado(false);
    }
  };
  return { erro, ocupado, enviar };
}

function Rodape({ ocupado, onClose, rotulo = 'Salvar' }) {
  return (
    <div className="modal-rodape">
      <PillButton onClick={onClose}>Cancelar</PillButton>
      <button type="submit" className="pilula primaria" disabled={ocupado}>
        {ocupado ? 'Salvando…' : rotulo}
      </button>
    </div>
  );
}

export function CursoModal({ curso, onClose, onFeito }) {
  const [form, setForm] = useState({
    nome: curso?.nome ?? '',
    carga_horaria: curso?.carga_horaria ?? '',
    descricao: curso?.descricao ?? '',
  });
  const { erro, ocupado, enviar } = useEnvio(onFeito);
  const mudar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });
  const salvar = enviar(() => {
    const dados = { ...form, carga_horaria: numeroOuNulo(form.carga_horaria) };
    return curso ? api.cursos.atualizar(curso.id, dados) : api.cursos.criar(dados);
  });

  return (
    <Modal titulo={curso ? 'Editar curso' : 'Novo curso'} onClose={onClose}>
      <form onSubmit={salvar} noValidate>
        <AvisoErro mensagem={erro} />
        <Campo rotulo="Nome" id="curso-nome">
          <input id="curso-nome" value={form.nome} onChange={mudar('nome')} autoFocus />
        </Campo>
        <Campo rotulo="Carga horária (horas)" id="curso-carga">
          <input id="curso-carga" type="number" min="1" value={form.carga_horaria} onChange={mudar('carga_horaria')} />
        </Campo>
        <Campo rotulo="Descrição (opcional)" id="curso-desc">
          <textarea id="curso-desc" value={form.descricao} onChange={mudar('descricao')} />
        </Campo>
        <Rodape ocupado={ocupado} onClose={onClose} />
      </form>
    </Modal>
  );
}

export function ParticipanteModal({ participante, onClose, onFeito }) {
  const [form, setForm] = useState({
    nome: participante?.nome ?? '',
    email: participante?.email ?? '',
    setor: participante?.setor ?? '',
  });
  const { erro, ocupado, enviar } = useEnvio(onFeito);
  const mudar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });
  const salvar = enviar(() =>
    participante ? api.participantes.atualizar(participante.id, form) : api.participantes.criar(form),
  );

  return (
    <Modal titulo={participante ? 'Editar participante' : 'Novo participante'} onClose={onClose}>
      <form onSubmit={salvar} noValidate>
        <AvisoErro mensagem={erro} />
        <Campo rotulo="Nome" id="part-nome">
          <input id="part-nome" value={form.nome} onChange={mudar('nome')} autoFocus />
        </Campo>
        <Campo rotulo="E-mail" id="part-email">
          <input id="part-email" type="email" value={form.email} onChange={mudar('email')} placeholder="nome@exemplo.test" />
        </Campo>
        <Campo rotulo="Setor (opcional)" id="part-setor">
          <input id="part-setor" value={form.setor} onChange={mudar('setor')} />
        </Campo>
        <Rodape ocupado={ocupado} onClose={onClose} />
      </form>
    </Modal>
  );
}

export function TurmaModal({ turma, cursos, onClose, onFeito }) {
  const [form, setForm] = useState({
    curso_id: turma?.curso_id ?? cursos[0]?.id ?? '',
    codigo: turma?.codigo ?? '',
    periodo_inicio: turma?.periodo_inicio ?? '',
    periodo_fim: turma?.periodo_fim ?? '',
    vagas: turma?.vagas ?? '',
  });
  const { erro, ocupado, enviar } = useEnvio(onFeito);
  const mudar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });
  const salvar = enviar(() => {
    const dados = {
      ...form,
      curso_id: numeroOuNulo(form.curso_id),
      vagas: numeroOuNulo(form.vagas),
    };
    return turma ? api.turmas.atualizar(turma.id, dados) : api.turmas.criar(dados);
  });

  if (cursos.length === 0) {
    return (
      <Modal titulo="Nova turma" onClose={onClose}>
        <p>Cadastre um curso antes de criar uma turma.</p>
        <div className="modal-rodape espaco">
          <Link className="pilula primaria" to="/cursos?novo=1" onClick={onClose}>
            Criar curso
          </Link>
        </div>
      </Modal>
    );
  }

  return (
    <Modal titulo={turma ? 'Editar turma' : 'Nova turma'} onClose={onClose}>
      <form onSubmit={salvar} noValidate>
        <AvisoErro mensagem={erro} />
        <Campo rotulo="Curso" id="turma-curso">
          <select id="turma-curso" value={form.curso_id} onChange={mudar('curso_id')}>
            {cursos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </Campo>
        <div className="linha-campos">
          <Campo rotulo="Código" id="turma-codigo">
            <input id="turma-codigo" value={form.codigo} onChange={mudar('codigo')} autoFocus />
          </Campo>
          <Campo rotulo="Vagas" id="turma-vagas">
            <input id="turma-vagas" type="number" min="1" value={form.vagas} onChange={mudar('vagas')} />
          </Campo>
        </div>
        <div className="linha-campos">
          <Campo rotulo="Início" id="turma-inicio">
            <input id="turma-inicio" type="date" value={form.periodo_inicio} onChange={mudar('periodo_inicio')} />
          </Campo>
          <Campo rotulo="Fim" id="turma-fim">
            <input id="turma-fim" type="date" value={form.periodo_fim} onChange={mudar('periodo_fim')} />
          </Campo>
        </div>
        <Rodape ocupado={ocupado} onClose={onClose} />
      </form>
    </Modal>
  );
}

// `turmaFixa` (opcional): usada no detalhe da turma. Sem ela, o usuário escolhe a turma.
export function InscreverModal({ turmas, participantes, turmaFixa, onClose, onFeito }) {
  const [turmaId, setTurmaId] = useState(turmaFixa ?? turmas[0]?.id ?? '');
  const [participanteId, setParticipanteId] = useState(participantes[0]?.id ?? '');
  const { erro, ocupado, enviar } = useEnvio(onFeito);
  const salvar = enviar(() => api.inscricoes.criar(Number(turmaId), Number(participanteId)));

  if (turmas.length === 0 || participantes.length === 0) {
    return (
      <Modal titulo="Inscrever participante" onClose={onClose}>
        <p>É preciso ter ao menos uma turma e um participante cadastrados.</p>
        <div className="modal-rodape espaco">
          <PillButton onClick={onClose}>Fechar</PillButton>
        </div>
      </Modal>
    );
  }

  return (
    <Modal titulo="Inscrever participante" onClose={onClose}>
      <form onSubmit={salvar} noValidate>
        <AvisoErro mensagem={erro} />
        {!turmaFixa && (
          <Campo rotulo="Turma" id="insc-turma">
            <select id="insc-turma" value={turmaId} onChange={(e) => setTurmaId(e.target.value)}>
              {turmas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.codigo} — {t.curso_nome} ({t.vagas_ocupadas}/{t.vagas})
                </option>
              ))}
            </select>
          </Campo>
        )}
        <Campo rotulo="Participante" id="insc-part">
          <select id="insc-part" value={participanteId} onChange={(e) => setParticipanteId(e.target.value)} autoFocus>
            {participantes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} ({p.email})
              </option>
            ))}
          </select>
        </Campo>
        <Rodape ocupado={ocupado} onClose={onClose} rotulo="Inscrever" />
      </form>
    </Modal>
  );
}
