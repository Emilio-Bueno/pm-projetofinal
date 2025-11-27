import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Grid, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';

const CursoForm = ({ data, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    instituicaoId: '',
    nome: '',
    turnos: '',
    status: ''
  });
  const [instituicoes, setInstituicoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInstituicoes = async () => {
      try {
        setLoading(true);
        const { instituicaoService } = await import('../services/instituicaoService');
        const response = await instituicaoService.getAll();
        setInstituicoes(response.data || []);
      } catch (error) {
        console.error('Erro ao carregar instituições:', error);
        setInstituicoes([]);
      } finally {
        setLoading(false);
      }
    };
    loadInstituicoes();
  }, []);

  useEffect(() => {
    if (data) {
      setFormData({
        ...data,
        turnos: Array.isArray(data.turnos) ? data.turnos : (data.turnos ? data.turnos.split(', ') : [])
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const submitData = {
        ...formData,
        turnos: Array.isArray(formData.turnos) ? formData.turnos : []
      };
      await onSubmit(submitData);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar curso');
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
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>Instituição</InputLabel>
            <Select
              name="instituicaoId"
              value={formData.instituicaoId || ''}
              onChange={handleChange}
              label="Instituição"
              disabled={loading}
              sx={{ minWidth: 200 }}
            >
              {loading ? (
                <MenuItem disabled>Carregando...</MenuItem>
              ) : instituicoes.length > 0 ? (
                instituicoes.map((instituicao) => (
                  <MenuItem key={instituicao._id} value={instituicao._id}>
                    {instituicao.nome} - {instituicao.sigla}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Nenhuma instituição encontrada</MenuItem>
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
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Turnos</InputLabel>
            <Select
              name="turnos"
              multiple
              value={Array.isArray(formData.turnos) ? formData.turnos : (formData.turnos ? formData.turnos.split(', ') : [])}
              onChange={(e) => setFormData({ ...formData, turnos: e.target.value })}
              label="Turnos"
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="Manhã">Manhã</MenuItem>
              <MenuItem value="Tarde">Tarde</MenuItem>
              <MenuItem value="Noite">Noite</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
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

export default CursoForm;