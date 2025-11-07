import React, { useState, useEffect } from 'react';
import { Typography, Box, FormControl, InputLabel, Select, MenuItem, Grid, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Delete } from '@mui/icons-material';
import { aulaService } from '../services/aulaService.jsx';
import { laboratorioService } from '../services/laboratorioService.jsx';
import { professorService } from '../services/professorService.jsx';
import { cursoService } from '../services/cursoService.jsx';
import { disciplinaService } from '../services/disciplinaService.jsx';

const ConsultaHorariosPage = () => {
  const [aulas, setAulas] = useState([]);
  const [filteredAulas, setFilteredAulas] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [filters, setFilters] = useState({
    laboratorioId: '',
    professorId: '',
    cursoId: ''
  });

  const [options, setOptions] = useState({
    laboratorios: [],
    professores: [],
    cursos: [],
    disciplinas: []
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, aulas]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [aulasRes, laboratoriosRes, professoresRes, cursosRes, disciplinasRes] = await Promise.all([
        aulaService.getAll(),
        laboratorioService.getAll(),
        professorService.getAll(),
        cursoService.getAll(),
        disciplinaService.getAll()
      ]);

      setAulas(aulasRes.data);
      setOptions({
        laboratorios: laboratoriosRes.data,
        professores: professoresRes.data,
        cursos: cursosRes.data,
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

    if (filters.professorId) {
      filtered = filtered.filter(aula => aula.professorId === filters.professorId);
    }

    if (filters.cursoId) {
      filtered = filtered.filter(aula => aula.cursoId === filters.cursoId);
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
      laboratorioId: '',
      professorId: '',
      cursoId: ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta aula?')) {
      try {
        await aulaService.remove(id);
        loadData();
      } catch (error) {
        console.error('Erro ao excluir aula:', error);
      }
    }
  };

  const getLaboratorioNome = (laboratorio) => {
    if (typeof laboratorio === 'object' && laboratorio?.nome) {
      return laboratorio.nome;
    }
    const found = options.laboratorios.find(l => l._id === laboratorio);
    return found ? found.nome : laboratorio;
  };

  const getProfessorNome = (professor) => {
    if (typeof professor === 'object' && professor?.nome) {
      return professor.nome;
    }
    const found = options.professores.find(p => p._id === professor);
    return found ? found.nome : professor;
  };

  const getCursoNome = (curso) => {
    if (typeof curso === 'object' && curso?.nome) {
      return curso.nome;
    }
    const found = options.cursos.find(c => c._id === curso);
    return found ? found.nome : curso;
  };

  const getDisciplinaNome = (disciplina) => {
    if (typeof disciplina === 'object' && disciplina?.nome) {
      return disciplina.nome;
    }
    const found = options.disciplinas.find(d => d._id === disciplina);
    return found ? found.nome : disciplina;
  };

  const columns = [
    { field: 'semestre', headerName: 'Semestre', width: 120, sortable: false },
    { 
      field: 'disciplinaId', 
      headerName: 'Disciplina', 
      width: 150,
      sortable: false,
      renderCell: (params) => getDisciplinaNome(params.row.disciplinaId)
    },
    { 
      field: 'professorId', 
      headerName: 'Professor', 
      width: 150,
      sortable: false,
      renderCell: (params) => getProfessorNome(params.row.professorId)
    },
    { 
      field: 'laboratorioId', 
      headerName: 'Laboratório', 
      width: 150,
      sortable: false,
      renderCell: (params) => getLaboratorioNome(params.row.laboratorioId)
    },
    { 
      field: 'cursoId', 
      headerName: 'Curso', 
      width: 150,
      sortable: false,
      renderCell: (params) => getCursoNome(params.row.cursoId)
    },
    { field: 'diaSemana', headerName: 'Dia', width: 120, sortable: false },
    { field: 'dataInicio', headerName: 'Início', width: 120, sortable: false },
    { field: 'dataFim', headerName: 'Fim', width: 120, sortable: false },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleDelete(params.row._id)} size="small">
            <Delete />
          </IconButton>
        </Box>
      ),
    }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Consulta de Horários
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Laboratório</InputLabel>
              <Select
                name="laboratorioId"
                value={filters.laboratorioId}
                onChange={handleFilterChange}
                label="Laboratório"
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="">Todos</MenuItem>
                {options.laboratorios.map((lab) => (
                  <MenuItem key={lab._id} value={lab._id}>
                    {lab.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Professor</InputLabel>
              <Select
                name="professorId"
                value={filters.professorId}
                onChange={handleFilterChange}
                label="Professor"
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="">Todos</MenuItem>
                {options.professores.map((prof) => (
                  <MenuItem key={prof._id} value={prof._id}>
                    {prof.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Curso</InputLabel>
              <Select
                name="cursoId"
                value={filters.cursoId}
                onChange={handleFilterChange}
                label="Curso"
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="">Todos</MenuItem>
                {options.cursos.map((curso) => (
                  <MenuItem key={curso._id} value={curso._id}>
                    {curso.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography 
                variant="body2" 
                sx={{ cursor: 'pointer', color: 'primary.main', textDecoration: 'underline' }}
                onClick={clearFilters}
              >
                Limpar Filtros
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <DataGrid
          rows={filteredAulas}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          autoHeight
          disableSelectionOnClick
          hideFooter
          disableColumnMenu
          sortingOrder={[]}
          sx={{ maxWidth: 'fit-content' }}
        />
      </Box>
    </Box>
  );
};

export default ConsultaHorariosPage;