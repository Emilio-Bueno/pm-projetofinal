import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import InstituicoesPage from './pages/InstituicoesPage.jsx';
import CursosPage from './pages/CursosPage.jsx';
import ProfessoresPage from './pages/ProfessoresPage.jsx';
import DisciplinasPage from './pages/DisciplinasPage.jsx';
import LaboratoriosPage from './pages/LaboratoriosPage.jsx';
import BlocosPage from './pages/BlocosPage.jsx';
import FormularioAulaPage from './pages/FormularioAulaPage.jsx';
import ConsultaHorariosPage from './pages/ConsultaHorariosPage.jsx';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/instituicoes" element={<InstituicoesPage />} />
            <Route path="/cursos" element={<CursosPage />} />
            <Route path="/professores" element={<ProfessoresPage />} />
            <Route path="/disciplinas" element={<DisciplinasPage />} />
            <Route path="/laboratorios" element={<LaboratoriosPage />} />
            <Route path="/blocos" element={<BlocosPage />} />
            <Route path="/formulario-aula" element={<FormularioAulaPage />} />
            <Route path="/consulta-horarios" element={<ConsultaHorariosPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
