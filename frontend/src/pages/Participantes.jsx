import { Pencil, Plus, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { api } from '../api.js';
import {
  AvisoErro, Card, CabecalhoPagina, Carregando, Confirmar, EmptyState, PillButton,
} from '../components/base.jsx';
import { ParticipanteModal } from '../components/formularios.jsx';
import { avisarMudanca, useCarga } from '../hooks.js';

const carregar = () => api.participantes.listar();

export default function Participantes() {
  const { dados, erro, carregando, recarregar } = useCarga(carregar);
  const [modal, setModal] = useState(null);
  const [erroExclusao, setErroExclusao] = useState('');

  const fechar = () => { setModal(null); setErroExclusao(''); };
  const feito = () => { fechar(); recarregar(); };
  const excluir = async () => {
    try { await api.participantes.excluir(modal.participante.id); avisarMudanca(); feito(); }
    catch (e) { setErroExclusao(e.message); }
  };

  return (
    <>
      <CabecalhoPagina menor titulo="Participantes" subtitulo="Pessoas que podem ser inscritas nas turmas (dados fictícios)."
        acoes={<PillButton variante="primaria" icone={Plus} onClick={() => setModal({ tipo: 'form' })}>Novo participante</PillButton>} />
      <AvisoErro mensagem={erro} />
      {carregando && <Carregando />}

      {dados && (
        <Card className="espaco">
          {dados.length === 0 ? (
            <EmptyState icone={Users} texto="Nenhum participante cadastrado ainda."
              acao={<PillButton variante="primaria" onClick={() => setModal({ tipo: 'form' })}>Cadastrar primeiro participante</PillButton>} />
          ) : (
            <div className="tabela-wrap">
              <table>
                <thead><tr><th>Nome</th><th>E-mail</th><th>Setor</th><th><span className="sr-only">Ações</span></th></tr></thead>
                <tbody>
                  {dados.map((p) => (
                    <tr key={p.id}>
                      <td data-label="Nome"><strong>{p.nome}</strong></td>
                      <td data-label="E-mail">{p.email}</td>
                      <td data-label="Setor">{p.setor ?? '—'}</td>
                      <td className="acoes-celula">
                        <button type="button" className="icone-botao" aria-label={`Editar ${p.nome}`}
                          onClick={() => setModal({ tipo: 'form', participante: p })}><Pencil size={18} /></button>
                        <button type="button" className="icone-botao perigo" aria-label={`Excluir ${p.nome}`}
                          onClick={() => setModal({ tipo: 'excluir', participante: p })}><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {modal?.tipo === 'form' && <ParticipanteModal participante={modal.participante} onClose={fechar} onFeito={feito} />}
      {modal?.tipo === 'excluir' && (
        <Confirmar titulo="Excluir participante" erro={erroExclusao} onClose={fechar} onConfirmar={excluir}
          texto={`Excluir ${modal.participante.nome}? Esta ação não pode ser desfeita.`} />
      )}
    </>
  );
}
