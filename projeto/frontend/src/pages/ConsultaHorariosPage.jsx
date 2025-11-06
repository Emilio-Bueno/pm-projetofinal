import React, { useState, useEffect } from 'react';
import { Typography, Box, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { aulaService } from '../services/aulaService.jsx';
import { laboratorioService } from '../services/laboratorioService.jsx';
import { professorService } from '../services/professorService.jsx';
import { cursoService } from '../services/cursoService.jsx';

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
    cursos: []
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
      const [aulasRes, laboratoriosRes, professoresRes, cursosRes] = await Promise.all([
        aulaService.getAll(),
        laboratorioService.getAll(),
        professorService.getAll(),
        cursoService.getAll()
      ]);

      setAulas(aulasRes.data);
      setOptions({
        laboratorios: laboratoriosRes.data,
        professores: professoresRes.data,
        cursos: cursosRes.data
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

  const getLaboratorioNome = (id) => {
    const lab = options.laboratorios.find(l => l._id === id);
    return lab ? lab.nome : id;
  };

  const getProfessorNome = (id) => {
    const prof = options.professores.find(p => p._id === id);
    return prof ? prof.nome : id;
  };

  const getCursoNome = (id) => {
    const curso = options.cursos.find(c => c._id === id);
    return curso ? curso.nome : id;
  };

  const columns = [
    { field: 'semestre', headerName: 'Semestre', width: 120 },
    { field: 'disciplinaId', headerName: 'Disciplina', width: 150 },
    { 
      field: 'professorId', 
      headerName: 'Professor', 
      width: 150,
      valueGetter: (params) => getProfessorNome(params.row.professorId)
    },
    { 
      field: 'laboratorioId', 
      headerName: 'Laboratório', 
      width: 150,
      valueGetter: (params) => getLaboratorioNome(params.row.laboratorioId)
    },
    { 
      field: 'cursoId', 
      headerName: 'Curso', 
      width: 150,
      valueGetter: (params) => getCursoNome(params.row.cursoId)
    },
    { field: 'diaSemana', headerName: 'Dia', width: 120 },
    { field: 'dataInicio', headerName: 'Início', width: 120 },
    { field: 'dataFim', headerName: 'Fim', width: 120 }
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

      <DataGrid
        rows={filteredAulas}
        columns={columns}
        getRowId={(row) => row._id}
        loading={loading}
        autoHeight
        disableSelectionOnClick
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 }
          }
        }}
        pageSizeOptions={[10, 25, 50]}
      />
    </Box>
  );
};

export default ConsultaHorariosPage;