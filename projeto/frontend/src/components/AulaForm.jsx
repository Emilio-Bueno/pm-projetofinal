// Imports necessários para o componente
import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Grid, Box, Alert } from '@mui/material';
import { cursoService } from '../services/cursoService.jsx';
import { disciplinaService } from '../services/disciplinaService.jsx';
import { professorService } from '../services/professorService.jsx';
import { laboratorioService } from '../services/laboratorioService.jsx';
import { blocoService } from '../services/blocoService.jsx';

// Componente de formulário para cadastro/edição de aulas
const AulaForm = ({ data, onSubmit, onCancel, resetForm, onResetComplete }) => {
  // Estado do formulário com todos os campos da aula
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

  // Estado para armazenar opções dos selects
  const [options, setOptions] = useState({
    cursos: [],
    disciplinas: [],
    professores: [],
    laboratorios: [],
    blocos: []
  });

  // Estado de carregamento
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Dias da semana disponíveis (excluindo domingo)
  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  // Carrega opções dos selects na inicialização
  useEffect(() => {
    loadOptions();
  }, []);

  // Processa dados recebidos para edição
  useEffect(() => {
    if (data) {
      // Normaliza IDs que podem vir como objetos populados
      const processedData = {
        ...data,
        cursoId: typeof data.cursoId === 'object' ? data.cursoId._id : data.cursoId,
        disciplinaId: typeof data.disciplinaId === 'object' ? data.disciplinaId._id : data.disciplinaId,
        professorId: typeof data.professorId === 'object' ? data.professorId._id : data.professorId,
        laboratorioId: typeof data.laboratorioId === 'object' ? data.laboratorioId._id : data.laboratorioId,
        blocos: typeof data.blocos === 'object' ? data.blocos._id : data.blocos,
        // Converte datas para formato do input date
        dataInicio: data.dataInicio ? new Date(data.dataInicio).toISOString().split('T')[0] : '',
        dataFim: data.dataFim ? new Date(data.dataFim).toISOString().split('T')[0] : ''
      };
      setFormData(processedData);
    }
  }, [data]);

  // Reseta formulário quando solicitado
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

  // Carrega todas as opções dos selects em paralelo
  const loadOptions = async () => {
    try {
      setLoading(true);
      // Executa todas as requisições simultaneamente
      const [cursosRes, disciplinasRes, professoresRes, laboratoriosRes, blocosRes] = await Promise.all([
        cursoService.getAll(),
        disciplinaService.getAll(),
        professorService.getAll(),
        laboratorioService.getAll(),
        blocoService.getAll()
      ]);

      // Atualiza estado com os dados recebidos
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

  // Manipula mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let updatedFormData = {
      ...formData,
      [name]: value
    };
    
    // Auto-calcula dia da semana quando data de início é alterada
    if (name === 'dataInicio' && value) {
      const date = new Date(value);
      const diasSemanaMap = {
        1: 'Segunda',
        2: 'Terça',
        3: 'Quarta',
        4: 'Quinta',
        5: 'Sexta',
        6: 'Sábado'
      };
      const dayOfWeek = date.getDay();
      // Validação: não permite domingo
      if (dayOfWeek === 0) {
        alert('Não é possível cadastrar aulas no domingo!');
        updatedFormData.dataInicio = '';
        updatedFormData.diaSemana = '';
      } else {
        updatedFormData.diaSemana = diasSemanaMap[dayOfWeek];
      }
    }
    
    setFormData(updatedFormData);
  };

  // Submete o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar aula');
    }
  };

  // Renderização do formulário
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {/* Grid container para organizar campos */}
      <Grid container spacing={3}>
        {/* Campos de informações básicas */}
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

        {/* Selects para entidades relacionadas */}
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
              {options.disciplinas.map((disciplina, index) => (
                <MenuItem key={disciplina._id || `disciplina-${index}`} value={disciplina._id}>
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

        {/* Campos de horário */}
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

        {/* Botões de ação */}
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