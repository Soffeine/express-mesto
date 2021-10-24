const express = require('express');

const PORT = 3000;
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.use((req, res) => {
  res.status(404).send({ message: 'Такого запроса не существует' });
});

app.use(errors());

app.use((err, req, res, next) => {
  const status = err.statusCode;
  const { message } = err;

  res.status(status).send({
    message: status === 500
      ? 'Произошла ошибка на сервере'
      : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log('it works!!!');
});
