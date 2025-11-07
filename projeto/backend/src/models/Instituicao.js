const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

/**
 * @typedef {Object} InstituicaoSchema
 * @property {number} id - ID auto-incremental da instituição
 * @property {string} nome - Nome da instituição
 * @property {string} sigla - Sigla da instituição
 * @property {string} [cnpj] - CNPJ da instituição (opcional)
 * @property {string} [endereco] - Endereço da instituição (opcional)
 * @property {string} status - Status da instituição
 */
const instituicaoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  sigla: {
    type: String,
    required: true
  },
  cnpj: {
    type: String,
    required: false
  },
  endereco: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: true
  }
}, {
  collection: 'instituicoes'
});

instituicaoSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'instituicao_seq' });

/**
 * Modelo Mongoose para Instituição
 * @class Instituicao
 */
const Instituicao = mongoose.model('Instituicao', instituicaoSchema);

module.exports = Instituicao;