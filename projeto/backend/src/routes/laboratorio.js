const express = require('express');
const { Laboratorio } = require('../models');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Laboratorio:
 *       type: object
 *       required:
 *         - nome
 *         - capacidade
 *         - status
 *       properties:
 *         nome:
 *           type: string
 *         capacidade:
 *           type: number
 *         local:
 *           type: string
 *         status:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/laboratorios:
 *   post:
 *     summary: Criar novo laboratório
 *     tags: [Laboratorio]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Laboratorio'
 *     responses:
 *       201:
 *         description: Laboratório criado com sucesso
 */
router.post('/', async (req, res) => {
  try {
    const laboratorio = new Laboratorio(req.body);
    await laboratorio.save();
    res.status(201).json(laboratorio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/laboratorios:
 *   get:
 *     summary: Listar todos os laboratórios
 *     tags: [Laboratorio]
 *     responses:
 *       200:
 *         description: Lista de laboratórios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Laboratorio'
 */
router.get('/', async (req, res) => {
  try {
    const laboratorios = await Laboratorio.find();
    res.json(laboratorios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/laboratorios/{id}:
 *   put:
 *     summary: Atualizar laboratório
 *     tags: [Laboratorio]
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
 *             $ref: '#/components/schemas/Laboratorio'
 *     responses:
 *       200:
 *         description: Laboratório atualizado
 */
router.put('/:id', async (req, res) => {
  try {
    const laboratorio = await Laboratorio.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!laboratorio) return res.status(404).json({ error: 'Laboratório não encontrado' });
    res.json(laboratorio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/laboratorios/{id}:
 *   delete:
 *     summary: Remover laboratório
 *     tags: [Laboratorio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Laboratório removido
 */
router.delete('/:id', async (req, res) => {
  try {
    const laboratorio = await Laboratorio.findByIdAndDelete(req.params.id);
    if (!laboratorio) return res.status(404).json({ error: 'Laboratório não encontrado' });
    res.json({ message: 'Laboratório removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;