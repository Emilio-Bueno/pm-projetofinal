import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Grid } from '@mui/material';

const CursoForm = ({ data, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    instituicaoId: '',
    nome: '',
    turnos: '',
    status: ''
  });

  useEffect(() => {
    if (data) {
      setFormData({
        ...data,
        turnos: Array.isArray(data.turnos) ? data.turnos.join(', ') : data.turnos || ''
      });
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
      turnos: formData.turnos.split(',').map(t => t.trim()).filter(t => t)
    };
    onSubmit(submitData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="instituicaoId"
            label="ID da Instituição"
            value={formData.instituicaoId}
            onChange={handleChange}
            fullWidth
            required
          />
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
          <TextField
            name="turnos"
            label="Turnos (separados por vírgula)"
            value={formData.turnos}
            onChange={handleChange}
            fullWidth
          />
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