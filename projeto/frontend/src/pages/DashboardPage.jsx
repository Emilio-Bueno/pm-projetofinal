import React from 'react';
import { Typography, Grid, Card, CardContent, CardActions, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();

  const dashboardItems = [
    { title: 'Gerenciar Instituições', path: '/instituicoes', description: 'Cadastrar e gerenciar instituições' },
    { title: 'Gerenciar Cursos', path: '/cursos', description: 'Cadastrar e gerenciar cursos' },
    { title: 'Gerenciar Professores', path: '/professores', description: 'Cadastrar e gerenciar professores' },
    { title: 'Gerenciar Disciplinas', path: '/disciplinas', description: 'Cadastrar e gerenciar disciplinas' },
    { title: 'Gerenciar Laboratórios', path: '/laboratorios', description: 'Cadastrar e gerenciar laboratórios' },
    { title: 'Gerenciar Blocos', path: '/blocos', description: 'Cadastrar e gerenciar blocos de horário' },
    { title: 'Cadastrar Nova Aula', path: '/formulario-aula', description: 'Agendar nova aula em laboratório' },
    { title: 'Consultar Horários', path: '/consulta-horarios', description: 'Consultar horários dos laboratórios' }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard - Sistema de Laboratórios
      </Typography>
      <Grid container spacing={3}>
        {dashboardItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(item.path)}>
                  Acessar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardPage;