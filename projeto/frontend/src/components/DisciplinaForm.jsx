import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Grid, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
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
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [cursosResponse, professoresResponse] = await Promise.all([
          cursoService.getAll(),
          professorService.getAll()
        ]);
        
        // Garantir que os dados sejam arrays válidos
        const cursosData = Array.isArray(cursosResponse.data) ? cursosResponse.data : [];
        const professoresData = Array.isArray(professoresResponse.data) ? professoresResponse.data : [];
        
        setCursos(cursosData);
        setProfessores(professoresData);
        
        console.log('Cursos carregados:', cursosData);
        console.log('Professores carregados:', professoresData);
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
      // Garantir que os IDs sejam strings, não objetos populados
      const processedData = {
        ...data,
        cursoId: typeof data.cursoId === 'object' ? data.cursoId._id : data.cursoId,
        professorId: typeof data.professorId === 'object' ? data.professorId._id : data.professorId
      };
      setFormData(processedData);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Campo alterado: ${name} = ${value}`);
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const submitData = {
        ...formData,
        cargaHoraria: Number(formData.cargaHoraria),
        // Remover professorId se estiver vazio
        professorId: formData.professorId || undefined
      };
      // Remover campos undefined
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === undefined) {
          delete submitData[key];
        }
      });
      await onSubmit(submitData);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar disciplina');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
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
              {loading ? [
                <MenuItem key="loading" disabled>Carregando...</MenuItem>
              ] : [
                <MenuItem key="empty" value="">
                  <em>Nenhum</em>
                </MenuItem>,
                ...(professores && professores.length > 0 
                  ? professores.map((professor) => (
                      <MenuItem key={professor._id} value={professor._id}>
                        {professor.nome}
                      </MenuItem>
                    ))
                  : [<MenuItem key="no-professors" disabled>Nenhum professor cadastrado</MenuItem>]
                )
              ]}
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