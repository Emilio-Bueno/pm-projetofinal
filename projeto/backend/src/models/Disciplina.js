const mongoose = require('mongoose');

/**
 * @typedef {Object} DisciplinaSchema
 * @property {number} id - ID auto-incremental da disciplina
 * @property {string} cursoId - ID do curso (obrigatório)
 * @property {string} nome - Nome da disciplina (obrigatório)
 * @property {number} cargaHoraria - Carga horária da disciplina (obrigatório)
 * @property {string} [professorId] - ID do professor (opcional)
 * @property {string} status - Status da disciplina (obrigatório)
 */
const disciplinaSchema = new mongoose.Schema({
  cursoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso',
    required: true
  },
  nome: {
    type: String,
    required: true
  },
  cargaHoraria: {
    type: Number,
    required: true
  },
  professorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor',
    required: false
  },
  status: {
    type: String,
    required: true
  }
}, {
  collection: 'disciplinas'
});



/**
 * Modelo Mongoose para Disciplina
 * @class Disciplina
 */
const Disciplina = mongoose.model('Disciplina', disciplinaSchema);

module.exports = Disciplina;