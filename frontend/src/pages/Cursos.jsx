import { BookOpen, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api.js';
import {
  AvisoErro, Card, CabecalhoPagina, Carregando, Confirmar, EmptyState, PillButton,
} from '../components/base.jsx';
import { CursoModal } from '../components/formularios.jsx';
import { avisarMudanca, useCarga } from '../hooks.js';
import { corDoCurso, plural } from '../util.js';

const carregar = async () => {
  const [cursos, turmas] = await Promise.all([api.cursos.listar(), api.turmas.listar()]);
  return { cursos, turmas };
};

export default function Cursos() {
  const { dados, erro, carregando, recarregar } = useCarga(carregar);
  const [params, setParams] = useSearchParams();
  const [modal, setModal] = useState(params.get('novo') ? { tipo: 'form' } : null);
  const [erroExclusao, setErroExclusao] = useState('');

  const fechar = () => { setModal(null); setErroExclusao(''); if (params.get('novo')) setParams({}); };
  const feito = () => { fechar(); recarregar(); };
  const excluir = async () => {
    try { await api.cursos.excluir(modal.curso.id); avisarMudanca(); feito(); }
    catch (e) { setErroExclusao(e.message); }
  };

  const cursos = dados?.cursos ?? [];
  return (
    <>
      <CabecalhoPagina menor titulo="Cursos" subtitulo="Catálogo de cursos que originam as turmas."
        acoes={<PillButton variante="primaria" icone={Plus} onClick={() => setModal({ tipo: 'form' })}>Novo curso</PillButton>} />
      <AvisoErro mensagem={erro} />
      {carregando && <Carregando />}

      {dados && cursos.length === 0 && (
        <Card className="espaco">
          <EmptyState icone={BookOpen} texto="Nenhum curso cadastrado ainda."
            acao={<PillButton variante="primaria" onClick={() => setModal({ tipo: 'form' })}>Criar primeiro curso</PillButton>} />
        </Card>
      )}

      <div className="grade-cartoes espaco">
        {cursos.map((c) => (
          <Card key={c.id}>
            <div className="curso-cartao" style={{ padding: 0 }}>
              <span className="curso-icone" style={{ background: corDoCurso(c.id) }}><BookOpen size={22} /></span>
              <div>
                <strong>{c.nome}</strong>
                <small className="subtitulo" style={{ display: 'block' }}>
                  {plural(dados.turmas.filter((t) => t.curso_id === c.id).length, 'turma', 'turmas')} · {c.carga_horaria} h
                </small>
              </div>
            </div>
            {c.descricao && <p className="subtitulo espaco">{c.descricao}</p>}
            <div className="modal-rodape espaco">
              <button type="button" className="icone-botao" aria-label={`Editar curso ${c.nome}`}
                onClick={() => setModal({ tipo: 'form', curso: c })}><Pencil size={18} /></button>
              <button type="button" className="icone-botao perigo" aria-label={`Excluir curso ${c.nome}`}
                onClick={() => setModal({ tipo: 'excluir', curso: c })}><Trash2 size={18} /></button>
            </div>
          </Card>
        ))}
      </div>

      {modal?.tipo === 'form' && <CursoModal curso={modal.curso} onClose={fechar} onFeito={feito} />}
      {modal?.tipo === 'excluir' && (
        <Confirmar titulo="Excluir curso" erro={erroExclusao} onClose={fechar} onConfirmar={excluir}
          texto={`Excluir o curso "${modal.curso.nome}"? Esta ação não pode ser desfeita.`} />
      )}
    </>
  );
}
