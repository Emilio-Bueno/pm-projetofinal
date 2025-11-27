import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Grid, Alert } from '@mui/material';

const ProfessorForm = ({ data, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    status: ''
  });
  const [error, setError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar professor');
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
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="telefone"
            label="Telefone"
            value={formData.telefone}
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

export default ProfessorForm;