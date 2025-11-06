import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, Modal, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete, Add } from '@mui/icons-material';
import { blocoService } from '../services/blocoService.jsx';
import BlocoForm from '../components/BlocoForm.jsx';

const BlocosPage = () => {
  const [blocos, setBlocos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const loadBlocos = async () => {
    setLoading(true);
    try {
      const response = await blocoService.getAll();
      setBlocos(response.data);
    } catch (error) {
      console.error('Erro ao carregar blocos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlocos();
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
    if (window.confirm('Tem certeza que deseja excluir este bloco?')) {
      try {
        await blocoService.remove(id);
        loadBlocos();
      } catch (error) {
        console.error('Erro ao excluir bloco:', error);
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editingItem) {
        await blocoService.update(editingItem._id, data);
      } else {
        await blocoService.create(data);
      }
      setModalOpen(false);
      loadBlocos();
    } catch (error) {
      console.error('Erro ao salvar bloco:', error);
    }
  };

  const columns = [
    { field: 'turno', headerName: 'Turno', width: 120 },
    { field: 'diaSemana', headerName: 'Dia da Semana', width: 150 },
    { field: 'inicio', headerName: 'Início', width: 100 },
    { field: 'fim', headerName: 'Fim', width: 100 },
    { field: 'ordem', headerName: 'Ordem', width: 100 },
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
        <Typography variant="h4">Blocos de Horário</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Novo Bloco
        </Button>
      </Box>
      
      <DataGrid
        rows={blocos}
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
            {editingItem ? 'Editar Bloco' : 'Novo Bloco'}
          </Typography>
          <BlocoForm
            data={editingItem}
            onSubmit={handleSubmit}
            onCancel={() => setModalOpen(false)}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default BlocosPage;