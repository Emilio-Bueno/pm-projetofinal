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
      const response = await cursoService.getAll();
      setCursos(response.data);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
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
    try {
      if (editingItem) {
        await cursoService.update(editingItem._id, data);
      } else {
        await cursoService.create(data);
      }
      setModalOpen(false);
      loadCursos();
    } catch (error) {
      console.error('Erro ao salvar curso:', error);
    }
  };

  const columns = [
    { field: 'instituicaoId', headerName: 'ID Instituição', width: 150 },
    { field: 'nome', headerName: 'Nome', width: 200 },
    { field: 'turnos', headerName: 'Turnos', width: 150, valueGetter: (params) => Array.isArray(params.row.turnos) ? params.row.turnos.join(', ') : params.row.turnos },
    { field: 'status', headerName: 'Status', width: 100 },
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
        <Typography variant="h4">Cursos</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Novo Curso
        </Button>
      </Box>
      
      <DataGrid
        rows={cursos}
        columns={columns}
        getRowId={(row) => row._id}
        loading={loading}
        autoHeight
        disableSelectionOnClick
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
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