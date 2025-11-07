import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, Modal, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete, Add } from '@mui/icons-material';
import { disciplinaService } from '../services/disciplinaService.jsx';
import DisciplinaForm from '../components/DisciplinaForm.jsx';

const DisciplinasPage = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const loadDisciplinas = async () => {
    setLoading(true);
    try {
      const response = await disciplinaService.getAll();
      setDisciplinas(response.data);
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDisciplinas();
  }, []);

  const handleCreate = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta disciplina?')) {
      try {
        await disciplinaService.remove(id);
        loadDisciplinas();
      } catch (error) {
        console.error('Erro ao excluir disciplina:', error);
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editingItem) {
        await disciplinaService.update(editingItem._id, data);
      } else {
        await disciplinaService.create(data);
      }
      setModalOpen(false);
      loadDisciplinas();
    } catch (error) {
      console.error('Erro ao salvar disciplina:', error);
    }
  };

  const columns = [
    { 
      field: 'cursoId', 
      headerName: 'Curso', 
      width: 200,
      sortable: false,
      renderCell: (params) => {
        const curso = params.row.cursoId;
        if (typeof curso === 'object' && curso?.nome) {
          return curso.nome;
        }
        return curso || '';
      }
    },
    { field: 'nome', headerName: 'Nome', width: 200, sortable: false },
    { field: 'cargaHoraria', headerName: 'Carga Horária', width: 120, sortable: false },
    { 
      field: 'professorId', 
      headerName: 'Professor', 
      width: 150,
      sortable: false,
      renderCell: (params) => {
        const professor = params.row.professorId;
        if (typeof professor === 'object' && professor?.nome) {
          return professor.nome;
        }
        return professor ? 'N/A' : 'Nenhum';
      }
    },
    { field: 'status', headerName: 'Status', width: 100, sortable: false },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 120,
      sortable: false,
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
        <Typography variant="h4">Disciplinas</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Nova Disciplina
        </Button>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <DataGrid
          rows={disciplinas}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          autoHeight
          disableSelectionOnClick
          hideFooter
          disableColumnMenu
          sortingOrder={[]}
          sx={{ maxWidth: 'fit-content' }}
        />
      </Box>

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
        }}>
          <Typography variant="h6" gutterBottom>
            {editingItem ? 'Editar Disciplina' : 'Nova Disciplina'}
          </Typography>
          <DisciplinaForm
            data={editingItem}
            onSubmit={handleSubmit}
            onCancel={() => setModalOpen(false)}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default DisciplinasPage;