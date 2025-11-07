import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Grid, Box } from '@mui/material';
import { cursoService } from '../services/cursoService.jsx';
import { disciplinaService } from '../services/disciplinaService.jsx';
import { professorService } from '../services/professorService.jsx';
import { laboratorioService } from '../services/laboratorioService.jsx';
import { blocoService } from '../services/blocoService.jsx';

const AulaForm = ({ data, onSubmit, onCancel, resetForm, onResetComplete }) => {
  const [formData, setFormData] = useState({
    semestre: '',
    dataInicio: '',
    dataFim: '',
    cursoId: '',
    disciplinaId: '',
    professorId: '',
    laboratorioId: '',
    diaSemana: '',
    blocos: ''
  });

  const [options, setOptions] = useState({
    cursos: [],
    disciplinas: [],
    professores: [],
    laboratorios: [],
    blocos: []
  });

  const [loading, setLoading] = useState(false);
  const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  useEffect(() => {
    loadOptions();
  }, []);

  useEffect(() => {
    if (data) {
      // Tratar IDs que podem vir como objetos
      const processedData = {
        ...data,
        cursoId: typeof data.cursoId === 'object' ? data.cursoId._id : data.cursoId,
        disciplinaId: typeof data.disciplinaId === 'object' ? data.disciplinaId._id : data.disciplinaId,
        professorId: typeof data.professorId === 'object' ? data.professorId._id : data.professorId,
        laboratorioId: typeof data.laboratorioId === 'object' ? data.laboratorioId._id : data.laboratorioId,
        blocos: typeof data.blocos === 'object' ? data.blocos._id : data.blocos
      };
      setFormData(processedData);
    }
  }, [data]);

  useEffect(() => {
    if (resetForm) {
      setFormData({
        semestre: '',
        dataInicio: '',
        dataFim: '',
        cursoId: '',
        disciplinaId: '',
        professorId: '',
        laboratorioId: '',
        diaSemana: '',
        blocos: ''
      });
      if (onResetComplete) {
        onResetComplete();
      }
    }
  }, [resetForm, onResetComplete]);

  const loadOptions = async () => {
    try {
      setLoading(true);
      const [cursosRes, disciplinasRes, professoresRes, laboratoriosRes, blocosRes] = await Promise.all([
        cursoService.getAll(),
        disciplinaService.getAll(),
        professorService.getAll(),
        laboratorioService.getAll(),
        blocoService.getAll()
      ]);

      setOptions({
        cursos: cursosRes.data || [],
        disciplinas: disciplinasRes.data || [],
        professores: professoresRes.data || [],
        laboratorios: laboratoriosRes.data || [],
        blocos: blocosRes.data || []
      });
    } catch (error) {
      console.error('Erro ao carregar opções:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let updatedFormData = {
      ...formData,
      [name]: value
    };
    
    // Se mudou a data de início, calcular o dia da semana automaticamente
    if (name === 'dataInicio' && value) {
      const date = new Date(value);
      const diasSemanaMap = {
        0: 'Domingo',
        1: 'Segunda',
        2: 'Terça',
        3: 'Quarta',
        4: 'Quinta',
        5: 'Sexta',
        6: 'Sábado'
      };
      updatedFormData.diaSemana = diasSemanaMap[date.getDay()];
    }
    
    setFormData(updatedFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <TextField
            name="semestre"
            label="Semestre"
            value={formData.semestre}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            name="dataInicio"
            label="Data Início"
            type="date"
            value={formData.dataInicio}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            name="dataFim"
            label="Data Fim"
            type="date"
            value={formData.dataFim}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>Curso</InputLabel>
            <Select
              name="cursoId"
              value={formData.cursoId}
              onChange={handleChange}
              label="Curso"
              disabled={loading}
              sx={{ minWidth: 200 }}
            >
              {options.cursos.map((curso) => (
                <MenuItem key={curso._id} value={curso._id}>
                  {curso.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>Disciplina</InputLabel>
            <Select
              name="disciplinaId"
              value={formData.disciplinaId}
              onChange={handleChange}
              label="Disciplina"
              disabled={loading}
              sx={{ minWidth: 200 }}
            >
              {options.disciplinas.map((disciplina) => (
                <MenuItem key={disciplina._id} value={disciplina._id}>
                  {disciplina.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>Professor</InputLabel>
            <Select
              name="professorId"
              value={formData.professorId}
              onChange={handleChange}
              label="Professor"
              disabled={loading}
              sx={{ minWidth: 200 }}
            >
              {options.professores.map((professor) => (
                <MenuItem key={professor._id} value={professor._id}>
                  {professor.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>Laboratório</InputLabel>
            <Select
              name="laboratorioId"
              value={formData.laboratorioId}
              onChange={handleChange}
              label="Laboratório"
              disabled={loading}
              sx={{ minWidth: 200 }}
            >
              {options.laboratorios.map((laboratorio) => (
                <MenuItem key={laboratorio._id} value={laboratorio._id}>
                  {laboratorio.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Dia da Semana</InputLabel>
            <Select
              name="diaSemana"
              value={formData.diaSemana}
              onChange={handleChange}
              label="Dia da Semana"
              sx={{ minWidth: 200 }}
            >
              {diasSemana.map((dia) => (
                <MenuItem key={dia} value={dia}>
                  {dia}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Bloco de Horário</InputLabel>
            <Select
              name="blocos"
              value={formData.blocos}
              onChange={handleChange}
              label="Bloco de Horário"
              disabled={loading}
              sx={{ minWidth: 200 }}
            >
              {options.blocos.map((bloco) => (
                <MenuItem key={bloco._id} value={bloco._id}>
                  {bloco.turno} - {bloco.inicio} às {bloco.fim}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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

export default AulaForm;