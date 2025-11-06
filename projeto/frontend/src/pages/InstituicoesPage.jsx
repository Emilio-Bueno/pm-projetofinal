import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, Modal, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete, Add } from '@mui/icons-material';
import { instituicaoService } from '../services/instituicaoService.jsx';
import InstituicaoForm from '../components/InstituicaoForm.jsx';

const InstituicoesPage = () => {
  const [instituicoes, setInstituicoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const loadInstituicoes = async () => {
    setLoading(true);
    try {
      const response = await instituicaoService.getAll();
      setInstituicoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar instituições:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstituicoes();
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
    if (window.confirm('Tem certeza que deseja excluir esta instituição?')) {
      try {
        await instituicaoService.remove(id);
        loadInstituicoes();
      } catch (error) {
        console.error('Erro ao excluir instituição:', error);
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editingItem) {
        await instituicaoService.update(editingItem._id, data);
      } else {
        await instituicaoService.create(data);
      }
      setModalOpen(false);
      loadInstituicoes();
    } catch (error) {
      console.error('Erro ao salvar instituição:', error);
    }
  };

  const columns = [
    { field: 'nome', headerName: 'Nome', width: 200 },
    { field: 'sigla', headerName: 'Sigla', width: 100 },
    { field: 'cnpj', headerName: 'CNPJ', width: 150 },
    { field: 'endereco', headerName: 'Endereço', width: 200 },
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
        <Typography variant="h4">Instituições</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Nova Instituição
        </Button>
      </Box>
      
      <DataGrid
        rows={instituicoes}
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
            {editingItem ? 'Editar Instituição' : 'Nova Instituição'}
          </Typography>
          <InstituicaoForm
            data={editingItem}
            onSubmit={handleSubmit}
            onCancel={() => setModalOpen(false)}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default InstituicoesPage;