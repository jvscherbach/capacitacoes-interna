import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Cursos from './pages/Cursos.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Participantes from './pages/Participantes.jsx';
import TurmaDetalhe from './pages/TurmaDetalhe.jsx';
import Turmas from './pages/Turmas.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="turmas" element={<Turmas />} />
        <Route path="turmas/:id" element={<TurmaDetalhe />} />
        <Route path="cursos" element={<Cursos />} />
        <Route path="participantes" element={<Participantes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
