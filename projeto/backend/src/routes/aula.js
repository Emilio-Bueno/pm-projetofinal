const express = require('express');
const router = express.Router();
const Aula = require('../models/Aula');

// GET /aulas - Listar todas as aulas
router.get('/', async (req, res) => {
  try {
    const aulas = await Aula.find().populate('cursoId disciplinaId professorId laboratorioId blocos');
    res.json(aulas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /aulas - Criar nova aula
router.post('/', async (req, res) => {
  try {
    const { laboratorioId, diaSemana, blocos } = req.body;
    
    // Verificar se já existe aula no mesmo laboratório, dia e horário
    const conflito = await Aula.findOne({
      laboratorioId,
      diaSemana,
      blocos
    });
    
    if (conflito) {
      return res.status(400).json({ 
        error: 'Laboratório já possui uma aula agendada para este horário e dia da semana' 
      });
    }
    
    const novaAula = new Aula(req.body);
    await novaAula.save();
    res.status(201).json(novaAula);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /aulas/:id - Atualizar aula
router.put('/:id', async (req, res) => {
  try {
    const aula = await Aula.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!aula) {
      return res.status(404).json({ error: 'Aula não encontrada' });
    }
    res.json(aula);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /aulas/:id - Excluir aula
router.delete('/:id', async (req, res) => {
  try {
    const aula = await Aula.findByIdAndDelete(req.params.id);
    if (!aula) {
      return res.status(404).json({ error: 'Aula não encontrada' });
    }
    res.json({ message: 'Aula excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;