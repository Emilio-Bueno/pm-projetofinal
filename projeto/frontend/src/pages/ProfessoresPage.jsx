import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, Modal, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete, Add } from '@mui/icons-material';
import { professorService } from '../services/professorService.jsx';
import ProfessorForm from '../components/ProfessorForm.jsx';

const ProfessoresPage = () => {
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const loadProfessores = async () => {
    setLoading(true);
    try {
      const response = await professorService.getAll();
      setProfessores(response.data);
    } catch (error) {
      console.error('Erro ao carregar professores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfessores();
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
    if (window.confirm('Tem certeza que deseja excluir este professor?')) {
      try {
        await professorService.remove(id);
        loadProfessores();
      } catch (error) {
        console.error('Erro ao excluir professor:', error);
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editingItem) {
        await professorService.update(editingItem._id, data);
      } else {
        await professorService.create(data);
      }
      setModalOpen(false);
      loadProfessores();
    } catch (error) {
      console.error('Erro ao salvar professor:', error);
    }
  };

  const columns = [
    { field: 'nome', headerName: 'Nome', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'telefone', headerName: 'Telefone', width: 150 },
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
        <Typography variant="h4">Professores</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Novo Professor
        </Button>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <DataGrid
          rows={professores}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          autoHeight
          disableSelectionOnClick
          hideFooter
          sx={{ maxWidth: 'fit-content' }}
        />
      </Box>

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
            {editingItem ? 'Editar Professor' : 'Novo Professor'}
          </Typography>
          <ProfessorForm
            data={editingItem}
            onSubmit={handleSubmit}
            onCancel={() => setModalOpen(false)}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default ProfessoresPage;