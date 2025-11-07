import React, { useState } from 'react';
import { Typography, Box, Alert } from '@mui/material';
import { aulaService } from '../services/aulaService.jsx';
import AulaForm from '../components/AulaForm.jsx';

const FormularioAulaPage = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetForm, setResetForm] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    setMessage('');

    try {
      await aulaService.create(data);
      setMessage('Aula criada com sucesso!');
      setResetForm(true);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      setMessage('Erro ao criar aula: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Formulário de Nova Aula
      </Typography>

      {message && (
        <Alert severity={message.includes('sucesso') ? 'success' : 'error'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <AulaForm
        onSubmit={handleSubmit}
        onCancel={() => setMessage('')}
        resetForm={resetForm}
        onResetComplete={() => setResetForm(false)}
      />
    </Box>
  );
};

export default FormularioAulaPage;