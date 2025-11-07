const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

/**
 * @typedef {Object} CursoSchema
 * @property {number} id - ID auto-incremental do curso
 * @property {string} instituicaoId - ID da instituição (obrigatório)
 * @property {string} nome - Nome do curso (obrigatório)
 * @property {string[]} turnos - Turnos do curso
 * @property {string} status - Status do curso (obrigatório)
 */
const cursoSchema = new mongoose.Schema({
  instituicaoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instituicao',
    required: true
  },
  nome: {
    type: String,
    required: true
  },
  turnos: [{
    type: String
  }],
  status: {
    type: String,
    required: true
  }
}, {
  collection: 'cursos'
});

cursoSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'curso_seq' });

/**
 * Modelo Mongoose para Curso
 * @class Curso
 */
const Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso;