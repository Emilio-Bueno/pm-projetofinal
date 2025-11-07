const express = require('express');
const router = express.Router();

// Simulando dados de aula (você pode implementar com banco de dados depois)
let aulas = [];

// GET /aulas - Listar todas as aulas
router.get('/', (req, res) => {
  res.json(aulas);
});

// POST /aulas - Criar nova aula
router.post('/', (req, res) => {
  const { laboratorioId, diaSemana, blocos } = req.body;
  
  // Verificar se já existe aula no mesmo laboratório, dia e horário
  const conflito = aulas.find(aula => 
    aula.laboratorioId === laboratorioId && 
    aula.diaSemana === diaSemana && 
    aula.blocos === blocos
  );
  
  if (conflito) {
    return res.status(400).json({ 
      error: 'Laboratório já possui uma aula agendada para este horário e dia da semana' 
    });
  }
  
  const novaAula = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date()
  };
  aulas.push(novaAula);
  res.status(201).json(novaAula);
});

module.exports = router;