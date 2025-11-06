const express = require('express');
const { Professor } = require('../models');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Professor:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - status
 *       properties:
 *         nome:
 *           type: string
 *         email:
 *           type: string
 *         telefone:
 *           type: string
 *         status:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/professores:
 *   post:
 *     summary: Criar novo professor
 *     tags: [Professor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Professor'
 *     responses:
 *       201:
 *         description: Professor criado com sucesso
 */
router.post('/', async (req, res) => {
  try {
    const professor = new Professor(req.body);
    await professor.save();
    res.status(201).json(professor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/professores:
 *   get:
 *     summary: Listar todos os professores
 *     tags: [Professor]
 *     responses:
 *       200:
 *         description: Lista de professores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Professor'
 */
router.get('/', async (req, res) => {
  try {
    const professores = await Professor.find();
    res.json(professores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/professores/{id}:
 *   put:
 *     summary: Atualizar professor
 *     tags: [Professor]
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
 *             $ref: '#/components/schemas/Professor'
 *     responses:
 *       200:
 *         description: Professor atualizado
 */
router.put('/:id', async (req, res) => {
  try {
    const professor = await Professor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!professor) return res.status(404).json({ error: 'Professor não encontrado' });
    res.json(professor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/professores/{id}:
 *   delete:
 *     summary: Remover professor
 *     tags: [Professor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Professor removido
 */
router.delete('/:id', async (req, res) => {
  try {
    const professor = await Professor.findByIdAndDelete(req.params.id);
    if (!professor) return res.status(404).json({ error: 'Professor não encontrado' });
    res.json({ message: 'Professor removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;