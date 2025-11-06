const express = require('express');
const { Bloco } = require('../models');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Bloco:
 *       type: object
 *       required:
 *         - turno
 *         - diaSemana
 *         - inicio
 *         - fim
 *         - ordem
 *       properties:
 *         turno:
 *           type: string
 *         diaSemana:
 *           type: string
 *         inicio:
 *           type: string
 *         fim:
 *           type: string
 *         ordem:
 *           type: number
 */

/**
 * @swagger
 * /api/v1/blocos:
 *   post:
 *     summary: Criar novo bloco
 *     tags: [Bloco]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bloco'
 *     responses:
 *       201:
 *         description: Bloco criado com sucesso
 */
router.post('/', async (req, res) => {
  try {
    const bloco = new Bloco(req.body);
    await bloco.save();
    res.status(201).json(bloco);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/blocos:
 *   get:
 *     summary: Listar todos os blocos
 *     tags: [Bloco]
 *     responses:
 *       200:
 *         description: Lista de blocos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bloco'
 */
router.get('/', async (req, res) => {
  try {
    const blocos = await Bloco.find();
    res.json(blocos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/blocos/{id}:
 *   put:
 *     summary: Atualizar bloco
 *     tags: [Bloco]
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
 *             $ref: '#/components/schemas/Bloco'
 *     responses:
 *       200:
 *         description: Bloco atualizado
 */
router.put('/:id', async (req, res) => {
  try {
    const bloco = await Bloco.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bloco) return res.status(404).json({ error: 'Bloco não encontrado' });
    res.json(bloco);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/blocos/{id}:
 *   delete:
 *     summary: Remover bloco
 *     tags: [Bloco]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bloco removido
 */
router.delete('/:id', async (req, res) => {
  try {
    const bloco = await Bloco.findByIdAndDelete(req.params.id);
    if (!bloco) return res.status(404).json({ error: 'Bloco não encontrado' });
    res.json({ message: 'Bloco removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;