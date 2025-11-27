import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, Modal, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete, Add } from '@mui/icons-material';
import { cursoService } from '../services/cursoService.jsx';
import CursoForm from '../components/CursoForm.jsx';

const CursosPage = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const loadCursos = async () => {
    setLoading(true);
    try {
      console.log('Carregando cursos...');
      const response = await cursoService.getAll();
      console.log('Cursos carregados:', response.data);
      setCursos(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
      setCursos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCursos();
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
    if (window.confirm('Tem certeza que deseja excluir este curso?')) {
      try {
        await cursoService.remove(id);
        loadCursos();
      } catch (error) {
        console.error('Erro ao excluir curso:', error);
      }
    }
  };

  const handleSubmit = async (data) => {
    if (editingItem) {
      await cursoService.update(editingItem._id, data);
    } else {
      await cursoService.create(data);
    }
    setModalOpen(false);
    loadCursos();
  };

  const columns = [
    { 
      field: 'instituicaoId', 
      headerName: 'Instituição', 
      width: 200,
      sortable: false,
      renderCell: (params) => {
        const instituicao = params.row.instituicaoId;
        if (typeof instituicao === 'object' && instituicao?.nome) {
          return `${instituicao.nome} - ${instituicao.sigla}`;
        }
        return instituicao || '';
      }
    },
    { field: 'nome', headerName: 'Nome', width: 200, sortable: false },
    { 
      field: 'turnos', 
      headerName: 'Turnos', 
      width: 150,
      sortable: false,
      renderCell: (params) => {
        const turnos = params.row.turnos;
        if (Array.isArray(turnos)) {
          return turnos.join(', ');
        }
        return turnos || '';
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
        <Typography variant="h4">Cursos</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Novo Curso
        </Button>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <DataGrid
          rows={cursos}
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
            {editingItem ? 'Editar Curso' : 'Novo Curso'}
          </Typography>
          <CursoForm
            data={editingItem}
            onSubmit={handleSubmit}
            onCancel={() => setModalOpen(false)}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default CursosPage;