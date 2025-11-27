const express = require('express');
const { Curso } = require('../models');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Curso:
 *       type: object
 *       required:
 *         - instituicaoId
 *         - nome
 *         - status
 *       properties:
 *         instituicaoId:
 *           type: string
 *         nome:
 *           type: string
 *         turnos:
 *           type: array
 *           items:
 *             type: string
 *         status:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/cursos:
 *   post:
 *     summary: Criar novo curso
 *     tags: [Curso]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Curso'
 *     responses:
 *       201:
 *         description: Curso criado com sucesso
 */
router.post('/', async (req, res) => {
  try {
    const { nome } = req.body;
    const existingCurso = await Curso.findOne({ nome });
    if (existingCurso) {
      return res.status(400).json({ error: 'Já existe um curso com este nome' });
    }
    const curso = new Curso(req.body);
    await curso.save();
    res.status(201).json(curso);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/cursos:
 *   get:
 *     summary: Listar todos os cursos
 *     tags: [Curso]
 *     responses:
 *       200:
 *         description: Lista de cursos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Curso'
 */
router.get('/', async (req, res) => {
  try {
    const cursos = await Curso.find().populate('instituicaoId');
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/cursos/{id}:
 *   put:
 *     summary: Atualizar curso
 *     tags: [Curso]
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
 *             $ref: '#/components/schemas/Curso'
 *     responses:
 *       200:
 *         description: Curso atualizado
 */
router.put('/:id', async (req, res) => {
  try {
    const { nome } = req.body;
    const existingCurso = await Curso.findOne({ nome, _id: { $ne: req.params.id } });
    if (existingCurso) {
      return res.status(400).json({ error: 'Já existe um curso com este nome' });
    }
    const curso = await Curso.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!curso) return res.status(404).json({ error: 'Curso não encontrado' });
    res.json(curso);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/cursos/{id}:
 *   delete:
 *     summary: Remover curso
 *     tags: [Curso]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Curso removido
 */
router.delete('/:id', async (req, res) => {
  try {
    const curso = await Curso.findByIdAndDelete(req.params.id);
    if (!curso) return res.status(404).json({ error: 'Curso não encontrado' });
    res.json({ message: 'Curso removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;