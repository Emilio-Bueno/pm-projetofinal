import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Grid, FormControl, InputLabel, Select, MenuItem, Typography, Alert } from '@mui/material';

const BlocoForm = ({ data, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    turno: '',
    diaSemana: '',
    inicio: '',
    fim: '',
    ordem: ''
  });
  const [error, setError] = useState('');

  const horariosMatutino = {
    inicio: ['7:40', '8:30', '9:30', '10:20', '11:20', '12:10'],
    fim: ['8:30', '9:20', '10:20', '11:10', '12:10', '13:00']
  };
  
  const horariosVespertino = {
    inicio: ['13:20', '14:10', '15:10', '16:00', '17:00', '17:50'],
    fim: ['14:10', '15:00', '16:00', '16:50', '17:50', '18:40']
  };
  
  const horariosNoturno = {
    inicio: ['19:00', '19:50', '20:50', '21:40'],
    fim: ['19:50', '20:40', '21:40', '22:30']
  };

  const getHorariosPorTurno = (tipo) => {
    switch (formData.turno) {
      case 'Matutino': return horariosMatutino[tipo] || [];
      case 'Vespertino': return horariosVespertino[tipo] || [];
      case 'Noturno': return horariosNoturno[tipo] || [];
      default: return [];
    }
  };

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'turno') {
      // Limpar inicio e fim quando turno mudar
      setFormData({
        ...formData,
        turno: value,
        inicio: '',
        fim: ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const submitData = {
        ...formData,
        ordem: Number(formData.ordem)
      };
      await onSubmit(submitData);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar bloco');
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
          <FormControl fullWidth required sx={{ minWidth: 200 }}>
            <InputLabel>Turno</InputLabel>
            <Select
              name="turno"
              value={formData.turno}
              onChange={handleChange}
              label="Turno"
            >
              <MenuItem value="Matutino">Matutino</MenuItem>
              <MenuItem value="Vespertino">Vespertino</MenuItem>
              <MenuItem value="Noturno">Noturno</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="diaSemana"
            label="Dia da Semana"
            value={formData.diaSemana}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required sx={{ minWidth: 200 }}>
            <InputLabel>Horário de Início</InputLabel>
            <Select
              name="inicio"
              value={formData.inicio}
              onChange={handleChange}
              label="Horário de Início"
              disabled={!formData.turno}
            >
              {getHorariosPorTurno('inicio').map((horario, index) => (
                <MenuItem key={index} value={horario}>
                  {horario}
                </MenuItem>
              ))}
            </Select>
            {!formData.turno && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                Selecione um turno primeiro
              </Typography>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required sx={{ minWidth: 200 }}>
            <InputLabel>Horário de Fim</InputLabel>
            <Select
              name="fim"
              value={formData.fim}
              onChange={handleChange}
              label="Horário de Fim"
              disabled={!formData.turno}
            >
              {getHorariosPorTurno('fim').map((horario, index) => (
                <MenuItem key={index} value={horario}>
                  {horario}
                </MenuItem>
              ))}
            </Select>
            {!formData.turno && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                Selecione um turno primeiro
              </Typography>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="ordem"
            label="Ordem"
            type="number"
            value={formData.ordem}
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

export default BlocoForm;