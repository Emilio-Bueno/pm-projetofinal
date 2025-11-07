const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

/**
 * @typedef {Object} ProfessorSchema
 * @property {number} id - ID auto-incremental do professor
 * @property {string} nome - Nome do professor (obrigatório)
 * @property {string} email - Email do professor (obrigatório, único)
 * @property {string} [telefone] - Telefone do professor (opcional)
 * @property {string} status - Status do professor (obrigatório)
 */
const professorSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  telefone: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: true
  }
}, {
  collection: 'professores'
});

professorSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'professor_seq' });

/**
 * Modelo Mongoose para Professor
 * @class Professor
 */
const Professor = mongoose.model('Professor', professorSchema);

module.exports = Professor;