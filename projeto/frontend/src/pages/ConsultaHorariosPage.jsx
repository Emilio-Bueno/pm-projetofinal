// Imports necessários para o componente
import React, { useState, useEffect } from 'react';
import { Typography, Box, FormControl, InputLabel, Select, MenuItem, Paper, Alert } from '@mui/material';
import { aulaService } from '../services/aulaService.jsx';
import { laboratorioService } from '../services/laboratorioService.jsx';
import { professorService } from '../services/professorService.jsx';
import { cursoService } from '../services/cursoService.jsx';
import { blocoService } from '../services/blocoService.jsx';
import { disciplinaService } from '../services/disciplinaService.jsx';

// Componente para consulta de horários por laboratório
const ConsultaHorariosPage = () => {
  // Estados principais
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Estado dos filtros
  const [filters, setFilters] = useState({
    laboratorioId: ''
  });

  // Estado para armazenar dados das entidades
  const [options, setOptions] = useState({
    laboratorios: [],
    professores: [],
    cursos: [],
    blocos: [],
    disciplinas: []
  });

  // Configurações da tabela de horários
  const diasSemana = ['SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO'];

  // Horários fixos para exibição na tabela
  const todosHorarios = [
    { inicio: '07:40', fim: '08:30' },
    { inicio: '08:30', fim: '09:20' },
    { inicio: '09:30', fim: '10:20' },
    { inicio: '10:20', fim: '11:10' },
    { inicio: '11:20', fim: '12:10' },
    { inicio: '12:10', fim: '13:00' },
    { inicio: '12:30', fim: '13:20' }, 
    { inicio: '13:20', fim: '14:10' },
    { inicio: '14:10', fim: '15:00' },
    { inicio: '15:10', fim: '16:00' },
    { inicio: '16:00', fim: '16:50' },
    { inicio: '17:00', fim: '17:50' },
    { inicio: '17:50', fim: '18:40' },
    { inicio: '19:00', fim: '19:50' },
    { inicio: '19:50', fim: '20:40' },
    { inicio: '20:50', fim: '21:40' },
    { inicio: '21:40', fim: '22:30' }
  ];

  // Carrega dados na inicialização
  useEffect(() => {
    loadData();
  }, []);

  // Carrega todos os dados necessários
  const loadData = async () => {
    setLoading(true);
    try {
      // Executa todas as requisições em paralelo
      const [aulasRes, laboratoriosRes, professoresRes, cursosRes, blocosRes, disciplinasRes] = await Promise.all([
        aulaService.getAll(),
        laboratorioService.getAll(),
        professorService.getAll(),
        cursoService.getAll(),
        blocoService.getAll(),
        disciplinaService.getAll()
      ]);

      // Atualiza estados com os dados recebidos
      setAulas(aulasRes.data || []);
      setOptions({
        laboratorios: laboratoriosRes.data || [],
        professores: professoresRes.data || [],
        cursos: cursosRes.data || [],
        blocos: blocosRes.data || [],
        disciplinas: disciplinasRes.data || []
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Manipula mudanças no filtro
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Limpa filtros aplicados
  const clearFilters = () => {
    setFilters({ laboratorioId: '' });
  };

  // Obtém nome seguro de entidades (trata objetos populados e IDs)
  const getSafeName = (val, list) => {
    if (!val) return '---';
    // Se já for objeto populado
    if (typeof val === 'object' && val.nome) return val.nome;
    // Se for ID, busca na lista
    const found = list.find(item => item._id === val);
    return found ? found.nome : '---';
  };

  // Normaliza formato de horário (remove zeros à esquerda)
  const normalizeTime = (t) => {
    if (!t) return '';
    return t.toString().trim().replace(/^0/, '');
  };

  // Gera classe CSS de cor baseada no ID da disciplina
  const getCorPorDisciplina = (disciplinaId) => {
    if (!disciplinaId) return '';
    const id = typeof disciplinaId === 'object' ? disciplinaId._id : disciplinaId;
    if (!id || typeof id !== 'string') return '';
    const index = (id.charCodeAt(id.length - 1) % 8) + 1;
    return `cor-${index}`;
  };

  // Renderiza a grade de horários
  const renderGradeHorarios = () => {
    // Busca dados do laboratório selecionado
    const laboratorioSelecionado = options.laboratorios.find(lab => lab._id === filters.laboratorioId);
    
    // Filtra aulas apenas do laboratório selecionado
    const aulasDoLaboratorio = aulas.filter(aula => {
        const aulaLabId = typeof aula.laboratorioId === 'object' ? aula.laboratorioId._id : aula.laboratorioId;
        return aulaLabId === filters.laboratorioId;
    });

    return (
      <Paper elevation={3} sx={{ p: 2, overflowX: 'auto' }}>
        {/* Cabeçalho com informações do laboratório */}
        {laboratorioSelecionado && (
          <Box sx={{ mb: 2, textAlign: 'center' }}>
             <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                {laboratorioSelecionado.nome}
             </Typography>
             <Typography variant="body2" color="text.secondary">
                Capacidade: {laboratorioSelecionado.capacidade} | Aulas neste lab: {aulasDoLaboratorio.length}
             </Typography>
          </Box>
        )}
        
        {/* Tabela de horários */}
        <table className="horario-grid" style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
          {/* Cabeçalho da tabela */}
          <thead>
            <tr>
              <th style={{ padding: '10px', border: '1px solid #ddd', width: '120px', backgroundColor: '#424242', color: 'white' }}>Horário</th>
              {diasSemana.map(dia => (
                <th key={dia} style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center', backgroundColor: '#424242', color: 'white' }}>
                  {dia}
                </th>
              ))}
            </tr>
          </thead>
          {/* Corpo da tabela */}
          <tbody>
            {todosHorarios.map((horario, index) => (
              <tr key={index}>
                {/* Coluna de horário com cores por turno */}
                <td style={{ 
                  padding: '8px', 
                  border: '1px solid #ddd', 
                  fontWeight: 'bold', 
                  textAlign: 'center',
                  backgroundColor: horario.inicio < '12:00' ? '#E8F5E8' : horario.inicio < '18:00' ? '#FFF3E0' : '#E3F2FD',
                  color: horario.inicio < '12:00' ? '#2E7D32' : horario.inicio < '18:00' ? '#F57C00' : '#1976D2'
                }}>
                   {horario.inicio} - {horario.fim}
                </td>
                {/* Colunas dos dias da semana */}
                {diasSemana.map(diaColuna => {
                  // Busca aula para esta célula (dia + horário)
                  const aulaEncontrada = aulasDoLaboratorio.find(aula => {
                    if (!aula.diaSemana) return false;

                    // Comparação de dia da semana
                    const diaColNorm = diaColuna.toLowerCase(); 
                    const diaAulaNorm = aula.diaSemana.toLowerCase();
                    
                    const diaBate = diaAulaNorm.includes(diaColNorm);
                    if (!diaBate) return false;

                    // Obtém dados do bloco de horário
                    let blocoDaAula = null;
                    
                    if (aula.blocos && typeof aula.blocos === 'object') {
                         blocoDaAula = aula.blocos; 
                    } else {
                         blocoDaAula = options.blocos.find(b => b._id === aula.blocos);
                    }

                    if (!blocoDaAula) return false;

                    // Comparação de horários - verifica se o slot da grade está dentro do período da aula
                    const inicioAula = blocoDaAula.inicio;
                    const fimAula = blocoDaAula.fim;
                    const inicioGrade = horario.inicio;
                    const fimGrade = horario.fim;

                    // Converte horários para minutos para comparação
                    const toMinutes = (time) => {
                      const [h, m] = time.split(':').map(Number);
                      return h * 60 + m;
                    };

                    const inicioAulaMin = toMinutes(inicioAula);
                    const fimAulaMin = toMinutes(fimAula);
                    const inicioGradeMin = toMinutes(inicioGrade);
                    const fimGradeMin = toMinutes(fimGrade);

                    // Verifica se o slot da grade está dentro do período da aula
                    const horarioBate = inicioGradeMin >= inicioAulaMin && fimGradeMin <= fimAulaMin;

                    return horarioBate;
                  });

                  // Renderiza célula com aula ou vazia
                  if (aulaEncontrada) {
                    return (
                      <td key={`${index}-${diaColuna}`} style={{ 
                        padding: '8px', 
                        border: '1px solid #ddd', 
                        cursor: 'pointer',
                        backgroundColor: horario.inicio < '12:00' ? '#E8F5E8' : horario.inicio < '18:00' ? '#FFF3E0' : '#E3F2FD',
                        color: horario.inicio < '12:00' ? '#2E7D32' : horario.inicio < '18:00' ? '#F57C00' : '#1976D2'
                      }}>
                        {/* Informações da aula */}
                        <Box sx={{ fontSize: '0.8rem', textAlign: 'center' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '3px', fontSize: '0.85rem' }}>
                            {getSafeName(aulaEncontrada.disciplinaId, options.disciplinas)}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#333', marginBottom: '2px' }}>
                            {getSafeName(aulaEncontrada.professorId, options.professores)}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#666', fontStyle: 'italic' }}>
                            {getSafeName(aulaEncontrada.cursoId, options.cursos)}
                            </div>
                        </Box>
                      </td>
                    );
                  } else {
                    // Célula vazia
                    return <td key={`${index}-${diaColuna}`} style={{ border: '1px solid #ddd' }}></td>;
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Paper>
    );
  };

  // Renderização principal do componente
  return (
    <Box sx={{ maxWidth: '1200px', margin: 'auto', padding: 3 }}>
      {/* Título da página */}
      <Typography variant="h4" gutterBottom>
        Consulta de Horários
      </Typography>

      {/* Painel de filtros */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl fullWidth sx={{ maxWidth: 400 }}>
              <InputLabel>Selecione o Laboratório</InputLabel>
              <Select
                name="laboratorioId"
                value={filters.laboratorioId}
                onChange={handleFilterChange}
                label="Selecione o Laboratório"
              >
                <MenuItem value="">
                  <em>Nenhum selecionado</em>
                </MenuItem>
                {options.laboratorios.map((lab) => (
                  <MenuItem key={lab._id} value={lab._id}>
                    {lab.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {/* Botão para limpar filtro */}
            {filters.laboratorioId && (
                <Typography 
                  variant="body2" 
                  sx={{ cursor: 'pointer', color: 'primary.main', textDecoration: 'underline', ml: 2 }}
                  onClick={clearFilters}
                >
                  Limpar Filtro
                </Typography>
            )}
        </Box>
      </Paper>

      {/* Conteúdo condicional baseado no estado */}
      {loading ? (
        <Typography>Carregando grade...</Typography>
      ) : filters.laboratorioId ? (
        renderGradeHorarios()
      ) : (
        <Alert severity="info" sx={{ mt: 4 }}>
            Por favor, selecione um laboratório acima para visualizar a grade de horários.
        </Alert>
      )}
    </Box>
  );
};

export default ConsultaHorariosPage;