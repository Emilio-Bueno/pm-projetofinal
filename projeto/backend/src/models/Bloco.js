const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

/**
 * @typedef {Object} BlocoSchema
 * @property {number} id - ID auto-incremental do bloco
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

blocoSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'bloco_seq' });

/**
 * Modelo Mongoose para Bloco
 * @class Bloco
 */
const Bloco = mongoose.model('Bloco', blocoSchema);

module.exports = Bloco;