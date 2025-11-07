import React, { useState, useEffect } from 'react';
import { Typography, Box, Alert, Button, Modal, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete, Add } from '@mui/icons-material';
import { aulaService } from '../services/aulaService.jsx';
import { cursoService } from '../services/cursoService.jsx';
import { disciplinaService } from '../services/disciplinaService.jsx';
import { professorService } from '../services/professorService.jsx';
import { laboratorioService } from '../services/laboratorioService.jsx';
import { blocoService } from '../services/blocoService.jsx';
import AulaForm from '../components/AulaForm.jsx';

const FormularioAulaPage = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [aulasLista, setAulasLista] = useState([]);
  const [options, setOptions] = useState({
    cursos: [],
    disciplinas: [],
    professores: [],
    laboratorios: [],
    blocos: []
  });

  useEffect(() => {
    loadOptions();
    loadAulas();
  }, []);

  const loadOptions = async () => {
    setOptionsLoading(true);
    try {
      const [cursosRes, disciplinasRes, professoresRes, laboratoriosRes, blocosRes] = await Promise.all([
        cursoService.getAll(),
        disciplinaService.getAll(),
        professorService.getAll(),
        laboratorioService.getAll(),
        blocoService.getAll()
      ]);

      setOptions({
        cursos: cursosRes.data,
        disciplinas: disciplinasRes.data,
        professores: professoresRes.data,
        laboratorios: laboratoriosRes.data,
        blocos: blocosRes.data
      });
    } catch (error) {
      console.error('Erro ao carregar opções:', error);
    } finally {
      setOptionsLoading(false);
    }
  };

  const loadAulas = async () => {
    try {
      const response = await aulaService.getAll();
      setAulasLista(response.data);
    } catch (error) {
      console.error('Erro ao carregar aulas:', error);
    }
  };

  const handleSubmit = async (data) => {
    setLoading(true);
    setMessage('');

    try {
      if (editingItem) {
        await aulaService.update(editingItem._id, data);
        setMessage('Aula atualizada com sucesso!');
      } else {
        await aulaService.create(data);
        setMessage('Aula criada com sucesso!');
      }
      
      setModalOpen(false);
      setEditingItem(null);
      loadAulas();
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      setMessage('Erro ao salvar aula: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta aula?')) {
      try {
        await aulaService.remove(id);
        loadAulas();
        setMessage('Aula excluída com sucesso!');
      } catch (error) {
        setMessage('Erro ao excluir aula: ' + error.message);
      }
    }
  };

  const getProfessorNome = (id) => {
    const prof = options.professores.find(p => p._id === id);
    return prof ? prof.nome : 'N/A';
  };

  const getLaboratorioNome = (id) => {
    const lab = options.laboratorios.find(l => l._id === id);
    return lab ? lab.nome : 'N/A';
  };

  const getCursoNome = (id) => {
    const curso = options.cursos.find(c => c._id === id);
    return curso ? curso.nome : 'N/A';
  };

  const getBlocoHorario = (id) => {
    const bloco = options.blocos.find(b => b._id === id);
    return bloco ? `${bloco.inicio} - ${bloco.fim}` : 'N/A';
  };

  const columns = [
    { field: 'semestre', headerName: 'Semestre', width: 120 },
    { field: 'disciplinaId', headerName: 'Disciplina', width: 150 },
    { 
      field: 'professorId', 
      headerName: 'Professor', 
      width: 150,
      renderCell: (params) => {
        const id = typeof params.row.professorId === 'object' ? params.row.professorId._id : params.row.professorId;
        return getProfessorNome(id);
      }
    },
    { 
      field: 'laboratorioId', 
      headerName: 'Laboratório', 
      width: 150,
      renderCell: (params) => {
        const id = typeof params.row.laboratorioId === 'object' ? params.row.laboratorioId._id : params.row.laboratorioId;
        return getLaboratorioNome(id);
      }
    },
    { 
      field: 'cursoId', 
      headerName: 'Curso', 
      width: 150,
      renderCell: (params) => {
        const id = typeof params.row.cursoId === 'object' ? params.row.cursoId._id : params.row.cursoId;
        return getCursoNome(id);
      }
    },
    { 
      field: 'disciplinaId', 
      headerName: 'Disciplina', 
      width: 150,
      renderCell: (params) => {
        const id = typeof params.row.disciplinaId === 'object' ? params.row.disciplinaId._id : params.row.disciplinaId;
        const disciplina = options.disciplinas.find(d => d._id === id);
        return disciplina ? disciplina.nome : id;
      }
    },
    { field: 'diaSemana', headerName: 'Dia', width: 120 },
    { 
      field: 'blocos', 
      headerName: 'Horário', 
      width: 120,
      renderCell: (params) => {
        const id = typeof params.row.blocos === 'object' ? params.row.blocos._id : params.row.blocos;
        return getBlocoHorario(id);
      }
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleEdit(params.row)} size="small">
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row._id)} size="small">
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Gerenciar Aulas</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Nova Aula
        </Button>
      </Box>

      {message && (
        <Alert severity={message.includes('sucesso') ? 'success' : 'error'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <DataGrid
        rows={aulasLista}
        columns={columns}
        getRowId={(row) => row._id}
        autoHeight
        disableSelectionOnClick
        loading={optionsLoading}
        hideFooter
        sx={{ mb: 3 }}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <Typography variant="h6" gutterBottom>
            {editingItem ? 'Editar Aula' : 'Nova Aula'}
          </Typography>
          
          <AulaForm
            data={editingItem}
            onSubmit={handleSubmit}
            onCancel={() => setModalOpen(false)}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default FormularioAulaPage;