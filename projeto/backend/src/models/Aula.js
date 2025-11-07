const mongoose = require('mongoose');

const aulaSchema = new mongoose.Schema({
  semestre: {
    type: String,
    required: true
  },
  dataInicio: {
    type: Date,
    required: true
  },
  dataFim: {
    type: Date,
    required: true
  },
  cursoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso',
    required: true
  },
  disciplinaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Disciplina',
    required: true
  },
  professorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor',
    required: true
  },
  laboratorioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Laboratorio',
    required: true
  },
  diaSemana: {
    type: String,
    required: true
  },
  blocos: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bloco',
    required: true
  }
}, {
  collection: 'aulas'
});



const Aula = mongoose.model('Aula', aulaSchema);

module.exports = Aula;