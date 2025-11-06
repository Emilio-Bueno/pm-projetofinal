const mongoose = require('mongoose');

/**
 * @typedef {Object} BlocoSchema
 * @property {string} turno - Turno do bloco (obrigatório)
 * @property {string} diaSemana - Dia da semana (obrigatório)
 * @property {string} inicio - Horário de início (obrigatório)
 * @property {string} fim - Horário de fim (obrigatório)
 * @property {number} ordem - Ordem do bloco (obrigatório)
 */
const blocoSchema = new mongoose.Schema({
  turno: {
    type: String,
    required: true
  },
  diaSemana: {
    type: String,
    required: true
  },
  inicio: {
    type: String,
    required: true
  },
  fim: {
    type: String,
    required: true
  },
  ordem: {
    type: Number,
    required: true
  }
}, {
  collection: 'blocos'
});

/**
 * Modelo Mongoose para Bloco
 * @class Bloco
 */
const Bloco = mongoose.model('Bloco', blocoSchema);

module.exports = Bloco;