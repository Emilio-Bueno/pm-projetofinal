require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const https = require('https');
const fs = require('fs');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PM2025 API',
      version: '1.0.0',
      description: 'API para gerenciamento de instituição'
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Servidor de desenvolvimento'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
const instituicaoRoutes = require('./src/routes/instituicao');
const cursoRoutes = require('./src/routes/curso');
const professorRoutes = require('./src/routes/professor');
app.use('/api/v1/instituicoes', instituicaoRoutes);
app.use('/api/v1/cursos', cursoRoutes);
app.use('/api/v1/professores', professorRoutes);

// MongoDB connection
const mongoUrl = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_INITDB_HOST}:${process.env.MONGO_INITDB_PORT}/${process.env.MONGO_INITDB_DATABASE}?authSource=admin`;

mongoose.connect(mongoUrl)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

const PORT = process.env.PORT || 3000;

// HTTPS support
if (process.env.HTTPS_ENABLED === 'true') {
  const httpsOptions = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH)
  };
  
  const HTTPS_PORT = process.env.HTTPS_PORT || 3443;
  https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
    console.log(`Servidor HTTPS rodando na porta ${HTTPS_PORT}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`Servidor HTTP rodando na porta ${PORT}`);
    console.log(`Documentação Swagger: http://localhost:${PORT}/api-docs`);
  });
}