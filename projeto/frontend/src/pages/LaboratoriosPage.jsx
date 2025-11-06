import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, Modal, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete, Add } from '@mui/icons-material';
import { laboratorioService } from '../services/laboratorioService.jsx';
import LaboratorioForm from '../components/LaboratorioForm.jsx';

const LaboratoriosPage = () => {
  const [laboratorios, setLaboratorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const loadLaboratorios = async () => {
    setLoading(true);
    try {
      const response = await laboratorioService.getAll();
      setLaboratorios(response.data);
    } catch (error) {
      console.error('Erro ao carregar laboratórios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLaboratorios();
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
    if (window.confirm('Tem certeza que deseja excluir este laboratório?')) {
      try {
        await laboratorioService.remove(id);
        loadLaboratorios();
      } catch (error) {
        console.error('Erro ao excluir laboratório:', error);
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editingItem) {
        await laboratorioService.update(editingItem._id, data);
      } else {
        await laboratorioService.create(data);
      }
      setModalOpen(false);
      loadLaboratorios();
    } catch (error) {
      console.error('Erro ao salvar laboratório:', error);
    }
  };

  const columns = [
    { field: 'nome', headerName: 'Nome', width: 200 },
    { field: 'capacidade', headerName: 'Capacidade', width: 120 },
    { field: 'local', headerName: 'Local', width: 200 },
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
        <Typography variant="h4">Laboratórios</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Novo Laboratório
        </Button>
      </Box>
      
      <DataGrid
        rows={laboratorios}
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
            {editingItem ? 'Editar Laboratório' : 'Novo Laboratório'}
          </Typography>
          <LaboratorioForm
            data={editingItem}
            onSubmit={handleSubmit}
            onCancel={() => setModalOpen(false)}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default LaboratoriosPage;