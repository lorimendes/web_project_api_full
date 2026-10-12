require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { authenticateToken } = require('./middlewares/auth');
const {
  createUserValidator,
  loginValidator,
} = require('./middlewares/userValidator');

const { createUser, login } = require('./controllers/users');

const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');

const { PORT = 3000 } = process.env;
const app = express();

mongoose
  .connect('mongodb://localhost:27017/aroundb')
  .then(() => {
    console.log('Conectado ao banco de dados.');
  })
  .catch((err) => {
    console.error(`Erro ao conectar com o banco de dados: ${err}`);
  });

const handleRouteNotFound = (req, res) => {
  res.status(404).send({ message: 'A solicitação não foi encontrada' });
};

const handleError = (err, req, res, _next) => {
  if (err.name === 'CastError') {
    return res.status(400).send({ message: 'ID inválido' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).send({ message: 'Dados incompletos ou inválidos' });
  }
  if (err.name === 'AuthenticationError') {
    return res.status(401).send({ message: 'Email e/ou senha incorretos' });
  }
  if (err.name === 'InvalidToken') {
    return res.status(401).send({ message: 'Token inválido ou expirado' });
  }
  if (err.name === 'AuthorizationError') {
    return res.status(403).send({ message: 'Usuário não autorizado' });
  }
  if (err.name === 'DocumentNotFoundError') {
    return res.status(404).send({ message: 'ID não encontrado' });
  }
  if (err.code === 11000) {
    return res.status(409).send({ message: 'Esse e-mail já está cadastrado' });
  }
  console.error(err);
  return res.status(500).send({ message: 'Ocorreu um erro no servidor' });
};

app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('O servidor travará agora');
  }, 0);
}); // apagar após a revisão
app.use('/signup', createUserValidator, createUser);
app.use('/signin', loginValidator, login);
app.use(authenticateToken);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use(errorLogger);
app.use(handleRouteNotFound);
app.use(errors());
app.use(handleError);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {});
}

module.exports = app;
