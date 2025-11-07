import React, { useState, useEffect } from 'react';
import { Typography, Box, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import { aulaService } from '../services/aulaService.jsx';
import { laboratorioService } from '../services/laboratorioService.jsx';
import { professorService } from '../services/professorService.jsx';
import { cursoService } from '../services/cursoService.jsx';
import { blocoService } from '../services/blocoService.jsx';
import { disciplinaService } from '../services/disciplinaService.jsx';
import './ConsultaHorariosPage.css';

const ConsultaHorariosPage = () => {
  const [aulas, setAulas] = useState([]);
  const [filteredAulas, setFilteredAulas] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [filters, setFilters] = useState({
    laboratorioId: ''
  });

  const [options, setOptions] = useState({
    laboratorios: [],
    professores: [],
    cursos: [],
    blocos: [],
    disciplinas: []
  });

  const diasSemana = ['SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO'];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, aulas]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [aulasRes, laboratoriosRes, professoresRes, cursosRes, blocosRes, disciplinasRes] = await Promise.all([
        aulaService.getAll(),
        laboratorioService.getAll(),
        professorService.getAll(),
        cursoService.getAll(),
        blocoService.getAll(),
        disciplinaService.getAll()
      ]);

      setAulas(aulasRes.data);
      setOptions({
        laboratorios: laboratoriosRes.data,
        professores: professoresRes.data,
        cursos: cursosRes.data,
        blocos: blocosRes.data,
        disciplinas: disciplinasRes.data
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = aulas;

    if (filters.laboratorioId) {
      filtered = filtered.filter(aula => aula.laboratorioId === filters.laboratorioId);
    }

    setFilteredAulas(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      laboratorioId: ''
    });
  };

  const getLaboratorioNome = (id) => {
    const realId = typeof id === 'object' ? id._id : id;
    const lab = options.laboratorios.find(l => l._id === realId);
    return lab ? lab.nome : 'N/A';
  };

  const getProfessorNome = (id) => {
    const realId = typeof id === 'object' ? id._id : id;
    const prof = options.professores.find(p => p._id === realId);
    return prof ? prof.nome : 'N/A';
  };

  const getCursoNome = (id) => {
    const realId = typeof id === 'object' ? id._id : id;
    const curso = options.cursos.find(c => c._id === realId);
    return curso ? curso.nome : 'N/A';
  };

  const getDisciplinaNome = (id) => {
    const realId = typeof id === 'object' ? id._id : id;
    const disciplina = options.disciplinas.find(d => d._id === realId);
    return disciplina ? disciplina.nome : 'N/A';
  };

  const getBlocoHorario = (id) => {
    const bloco = options.blocos.find(b => b._id === id);
    return bloco ? `${bloco.inicio} - ${bloco.fim}` : '';
  };

  const getCorPorDisciplina = (disciplinaId) => {
    if (!disciplinaId) return '';
    const id = typeof disciplinaId === 'object' ? disciplinaId._id : disciplinaId;
    if (!id || typeof id !== 'string') return '';
    const index = (id.charCodeAt(id.length - 1) % 8) + 1;
    return `cor-${index}`;
  };

  const getAulaPorDiaEBloco = (dia, blocoId) => {
    return filteredAulas.find(aula => 
      aula.diaSemana?.toUpperCase() === dia && aula.blocos === blocoId
    );
  };

  const todosHorarios = [
    { inicio: '7:40', fim: '8:30', turno: 'matutino' },
    { inicio: '8:30', fim: '9:20', turno: 'matutino' },
    { inicio: '9:30', fim: '10:20', turno: 'matutino' },
    { inicio: '10:20', fim: '11:10', turno: 'matutino' },
    { inicio: '11:20', fim: '12:10', turno: 'matutino' },
    { inicio: '12:10', fim: '13:00', turno: 'matutino' },
    { inicio: '13:20', fim: '14:10', turno: 'vespertino' },
    { inicio: '14:10', fim: '15:00', turno: 'vespertino' },
    { inicio: '15:10', fim: '16:00', turno: 'vespertino' },
    { inicio: '16:00', fim: '16:50', turno: 'vespertino' },
    { inicio: '17:00', fim: '17:50', turno: 'vespertino' },
    { inicio: '17:50', fim: '18:40', turno: 'vespertino' },
    { inicio: '19:00', fim: '19:50', turno: 'noturno' },
    { inicio: '19:50', fim: '20:40', turno: 'noturno' },
    { inicio: '20:50', fim: '21:40', turno: 'noturno' },
    { inicio: '21:40', fim: '22:30', turno: 'noturno' }
  ];

  const getAulaPorDiaEHorario = (dia, inicio, fim) => {
    return aulas.find(aula => {
      const diaNormalizado = dia.toLowerCase();
      const aulaDia = aula.diaSemana?.toLowerCase();
      
      if (aulaDia !== diaNormalizado) return false;
      
      // Verificar se a aula é do laboratório selecionado
      if (filters.laboratorioId) {
        const aulaLabId = typeof aula.laboratorioId === 'object' ? aula.laboratorioId._id : aula.laboratorioId;
        if (aulaLabId !== filters.laboratorioId) return false;
      }
      
      const bloco = options.blocos.find(b => b.inicio === inicio && b.fim === fim);
      if (!bloco) return false;
      
      const aulaBloco = typeof aula.blocos === 'object' ? aula.blocos._id : aula.blocos;
      return aulaBloco === bloco._id;
    });
  };

  const renderGradeHorarios = () => {
    const laboratorioSelecionado = options.laboratorios.find(lab => lab._id === filters.laboratorioId);
    
    return (
      <div className="horario-container">
        {laboratorioSelecionado && (
          <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
            {laboratorioSelecionado.nome} - Capacidade: {laboratorioSelecionado.capacidade} lugares
          </Typography>
        )}
        <table className="horario-grid" style={{ width: '100%', minWidth: '1200px' }}>
          <thead>
            <tr>
              <th>Horário</th>
              {diasSemana.map(dia => (
                <th key={dia}>{dia}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {todosHorarios.map((horario, index) => (
              <tr key={index}>
                <td className={`horario-coluna ${horario.turno}`}>
                  {horario.inicio} - {horario.fim}
                </td>
                {diasSemana.map(dia => {
                  const aula = getAulaPorDiaEHorario(dia, horario.inicio, horario.fim);
                  
                  if (aula) {
                    return (
                      <td key={`${index}-${dia}`} className={`celula-aula ${horario.turno}`}>
                        <div className="aula-disciplina">{getDisciplinaNome(aula.disciplinaId)}</div>
                        <div className="aula-professor">Professor: {getProfessorNome(aula.professorId)}</div>
                        <div className="aula-laboratorio">Laboratório: {getLaboratorioNome(aula.laboratorioId)}</div>
                        <div className="aula-curso">Curso: {getCursoNome(aula.cursoId)}</div>
                      </td>
                    );
                  } else {
                    return (
                      <td key={`${index}-${dia}`} className="celula-vazia"></td>
                    );
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Consulta de Horários
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ minWidth: 200 }}>
              <InputLabel>Laboratório</InputLabel>
              <Select
                name="laboratorioId"
                value={filters.laboratorioId}
                onChange={handleFilterChange}
                label="Laboratório"
              >
                <MenuItem value="">Selecione um laboratório</MenuItem>
                {options.laboratorios.map((lab) => (
                  <MenuItem key={lab._id} value={lab._id}>
                    {lab.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography 
                variant="body2" 
                sx={{ cursor: 'pointer', color: 'primary.main', textDecoration: 'underline' }}
                onClick={clearFilters}
              >
                Limpar Seleção
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Typography>Carregando...</Typography>
      ) : filters.laboratorioId ? (
        renderGradeHorarios()
      ) : (
        <Box sx={{ textAlign: 'center', mt: 4, p: 3, bgcolor: 'grey.100', borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary">
            Selecione um laboratório para visualizar os horários
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ConsultaHorariosPage;