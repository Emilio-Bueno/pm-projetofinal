const express = require('express');
const { Disciplina } = require('../models');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Disciplina:
 *       type: object
 *       required:
 *         - cursoId
 *         - nome
 *         - cargaHoraria
 *         - status
 *       properties:
 *         cursoId:
 *           type: string
 *         nome:
 *           type: string
 *         cargaHoraria:
 *           type: number
 *         professorId:
 *           type: string
 *         status:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/disciplinas:
 *   post:
 *     summary: Criar nova disciplina
 *     tags: [Disciplina]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Disciplina'
 *     responses:
 *       201:
 *         description: Disciplina criada com sucesso
 */
router.post('/', async (req, res) => {
  try {
    const disciplina = new Disciplina(req.body);
    await disciplina.save();
    res.status(201).json(disciplina);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/disciplinas:
 *   get:
 *     summary: Listar todas as disciplinas
 *     tags: [Disciplina]
 *     responses:
 *       200:
 *         description: Lista de disciplinas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Disciplina'
 */
router.get('/', async (req, res) => {
  try {
    const disciplinas = await Disciplina.find().populate('cursoId').populate('professorId');
    res.json(disciplinas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/disciplinas/{id}:
 *   put:
 *     summary: Atualizar disciplina
 *     tags: [Disciplina]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Disciplina'
 *     responses:
 *       200:
 *         description: Disciplina atualizada
 */
router.put('/:id', async (req, res) => {
  try {
    const disciplina = await Disciplina.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!disciplina) return res.status(404).json({ error: 'Disciplina não encontrada' });
    res.json(disciplina);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/disciplinas/{id}:
 *   delete:
 *     summary: Remover disciplina
 *     tags: [Disciplina]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Disciplina removida
 */
router.delete('/:id', async (req, res) => {
  try {
    const disciplina = await Disciplina.findByIdAndDelete(req.params.id);
    if (!disciplina) return res.status(404).json({ error: 'Disciplina não encontrada' });
    res.json({ message: 'Disciplina removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;