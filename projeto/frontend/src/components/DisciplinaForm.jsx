import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { cursoService } from '../services/cursoService';
import { professorService } from '../services/professorService';

const DisciplinaForm = ({ data, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    cursoId: '',
    nome: '',
    cargaHoraria: '',
    professorId: '',
    status: ''
  });
  const [cursos, setCursos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [cursosResponse, professoresResponse] = await Promise.all([
          cursoService.getAll(),
          professorService.getAll()
        ]);
        setCursos(cursosResponse.data || []);
        setProfessores(professoresResponse.data || []);
        console.log('Professores carregados:', professoresResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setCursos([]);
        setProfessores([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      cargaHoraria: Number(formData.cargaHoraria)
    };
    onSubmit(submitData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Curso</InputLabel>
            <Select
              name="cursoId"
              value={formData.cursoId || ''}
              onChange={handleChange}
              label="Curso"
              disabled={loading}
              sx={{ minWidth: 200 }}
            >
              {loading ? (
                <MenuItem disabled>Carregando...</MenuItem>
              ) : (
                cursos.map((curso) => (
                  <MenuItem key={curso._id} value={curso._id}>
                    {curso.nome}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Professor</InputLabel>
            <Select
              name="professorId"
              value={formData.professorId || ''}
              onChange={handleChange}
              label="Professor"
              disabled={loading}
              sx={{ minWidth: 200 }}
            >
              {loading ? (
                <MenuItem disabled>Carregando...</MenuItem>
              ) : (
                <>
                  <MenuItem value="">
                    <em>Nenhum</em>
                  </MenuItem>
                  {professores.map((professor, index) => (
                    <MenuItem key={professor._id || `prof-${index}`} value={professor._id || professor.id}>
                      {professor.nome}
                    </MenuItem>
                  ))}
                </>
              )}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="nome"
            label="Nome"
            value={formData.nome}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="cargaHoraria"
            label="Carga Horária"
            type="number"
            value={formData.cargaHoraria}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="status"
            label="Status"
            value={formData.status}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={onCancel} variant="outlined">
              Cancelar
            </Button>
            <Button type="submit" variant="contained">
              Salvar
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DisciplinaForm;