import { BookOpen, LayoutDashboard, Layers, Menu, Plus, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { aoMudarDados } from '../hooks.js';
import { corDoCurso } from '../util.js';

const ITENS = [
  { para: '/', rotulo: 'Dashboard', icone: LayoutDashboard, fim: true },
  { para: '/turmas', rotulo: 'Turmas', icone: Layers },
  { para: '/cursos', rotulo: 'Cursos', icone: BookOpen },
  { para: '/participantes', rotulo: 'Participantes', icone: Users },
];

function Sidebar({ aberta }) {
  const [cursos, setCursos] = useState([]);
  const navegar = useNavigate();

  useEffect(() => {
    const carregar = () => api.cursos.listar().then(setCursos).catch(() => setCursos([]));
    carregar();
    return aoMudarDados(carregar);
  }, []);

  return (
    <aside className={`sidebar ${aberta ? 'aberta' : ''}`} aria-label="Menu lateral">
      <div className="usuario">
        <span className="avatar" aria-hidden="true">
          O
        </span>
        <div>
          <strong>Organizador(a)</strong>
          <small>Online</small>
        </div>
      </div>

      <nav className="nav" aria-label="Principal">
        {ITENS.map(({ para, rotulo, icone: Icone, fim }) => (
          <NavLink key={para} to={para} end={fim} className={({ isActive }) => (isActive ? 'ativo' : '')}>
            <Icone size={20} aria-hidden="true" />
            {rotulo}
          </NavLink>
        ))}
      </nav>
      <hr />

      <div className="sidebar-cursos-cab">
        <span>Cursos</span>
        <button type="button" className="pilula pequena" onClick={() => navegar('/cursos?novo=1')}>
          <Plus size={14} aria-hidden="true" /> Adicionar
        </button>
      </div>
      <div className="sidebar-cursos">
        {cursos.slice(0, 6).map((curso) => (
          <NavLink key={curso.id} to="/cursos">
            <span className="ponto" style={{ background: corDoCurso(curso.id) }} />
            {curso.nome}
          </NavLink>
        ))}
        {cursos.length === 0 && <span className="subtitulo" style={{ padding: '4px 14px', fontSize: 13 }}>Nenhum curso ainda</span>}
      </div>

      <div className="sidebar-aviso">
        <strong>Ambiente de laboratório</strong>
        dados fictícios
      </div>
    </aside>
  );
}

export default function Layout() {
  const [aberta, setAberta] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setAberta(false), [pathname]);

  return (
    <div className="app">
      <header className="topbar">
        <button type="button" className="icone-botao" aria-label="Abrir menu" onClick={() => setAberta(true)}>
          <Menu size={22} />
        </button>
        <strong>Capacitações Internas</strong>
      </header>
      <Sidebar aberta={aberta} />
      <div className={`scrim ${aberta ? 'visivel' : ''}`} onClick={() => setAberta(false)} />
      <main className="principal">
        <Outlet />
      </main>
    </div>
  );
}
