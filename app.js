const express = require('express');

const PORT = 3000;
const cors = require('cors');

const allowedCors = [
  'http://localhost:3000',
  'https://localhost:3000',
  'https://mesto.soffeine.nomoredomains.xyz',
  'http://mesto.soffeine.nomoredomains.xyz/',
  'http://api.mesto/soffeine.nomoredomains.rocks',
  'https://api.mesto/soffeine.nomoredomains.rocks',
];

const allowedMethods = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'];

const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { loginValidation, signupValidation } = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const NotFoundError = require('./errors/not-found-error');

app.use(cors({
  credentials: true,
  origin: allowedCors,
  methods: allowedMethods,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signup', signupValidation, createUser);
app.post('/signin', loginValidation, login);

app.use(auth);

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.use((req, res, next) => {
  next(new NotFoundError('Такого запроса не существует'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log('it works!!!');
});
