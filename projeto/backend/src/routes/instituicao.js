const express = require('express');
const { Instituicao } = require('../models');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Instituicao:
 *       type: object
 *       required:
 *         - nome
 *         - sigla
 *         - status
 *       properties:
 *         nome:
 *           type: string
 *         sigla:
 *           type: string
 *         cnpj:
 *           type: string
 *         endereco:
 *           type: string
 *         status:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/instituicoes:
 *   post:
 *     summary: Criar nova instituição
 *     tags: [Instituição]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Instituicao'
 *     responses:
 *       201:
 *         description: Instituição criada com sucesso
 */
router.post('/', async (req, res) => {
  try {
    const instituicao = new Instituicao(req.body);
    await instituicao.save();
    res.status(201).json(instituicao);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/instituicoes:
 *   get:
 *     summary: Listar todas as instituições
 *     tags: [Instituição]
 *     responses:
 *       200:
 *         description: Lista de instituições
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Instituicao'
 */
router.get('/', async (req, res) => {
  try {
    const instituicoes = await Instituicao.find();
    res.json(instituicoes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/instituicoes/{id}:
 *   put:
 *     summary: Atualizar instituição
 *     tags: [Instituição]
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
 *             $ref: '#/components/schemas/Instituicao'
 *     responses:
 *       200:
 *         description: Instituição atualizada
 */
router.put('/:id', async (req, res) => {
  try {
    const instituicao = await Instituicao.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!instituicao) return res.status(404).json({ error: 'Instituição não encontrada' });
    res.json(instituicao);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/instituicoes/{id}:
 *   delete:
 *     summary: Remover instituição
 *     tags: [Instituição]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Instituição removida
 */
router.delete('/:id', async (req, res) => {
  try {
    const instituicao = await Instituicao.findByIdAndDelete(req.params.id);
    if (!instituicao) return res.status(404).json({ error: 'Instituição não encontrada' });
    res.json({ message: 'Instituição removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;