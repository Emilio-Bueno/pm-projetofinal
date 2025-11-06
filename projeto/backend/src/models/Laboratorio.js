const mongoose = require('mongoose');

/**
 * @typedef {Object} LaboratorioSchema
 * @property {string} nome - Nome do laboratório (obrigatório, único)
 * @property {number} capacidade - Capacidade do laboratório (obrigatório)
 * @property {string} [local] - Local do laboratório (opcional)
 * @property {string} status - Status do laboratório (obrigatório)
 */
const laboratorioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    unique: true
  },
  capacidade: {
    type: Number,
    required: true
  },
  local: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: true
  }
}, {
  collection: 'laboratorios'
});

/**
 * Modelo Mongoose para Laboratorio
 * @class Laboratorio
 */
const Laboratorio = mongoose.model('Laboratorio', laboratorioSchema);

module.exports = Laboratorio;