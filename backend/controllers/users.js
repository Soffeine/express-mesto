const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validationError = 400;
const notFoundError = 404;

// получение данных о всех пользователях
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка на сервере ${err}` }));
};

// получение данных о конкретном пользователе с помощью айди
const getUser = (req, res) => {
  const { _id } = req.params;
  return User.findById(_id)
    .orFail(() => {
      const error = new Error('Пользователя с данным id не существует');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(404).send({ message: `Ошибка ${notFoundError}: пользователя с переданным идентификатором не существует` });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: `Ошибка ${validationError}: переданы некорректные данные пользователя` });
      } else {
        res.status(500).send({ message: 'произошла ошибка на сервере' });
      }
    });
};

// создание аккаунта
const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash({ password }, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Ошибка ${validationError}: переданы некорректные данные при создании пользователя` });
      } else {
        res.status(500).send({ message: 'произошла ошибка на сервере' });
      }
    });
};

// обновление данных пользователя
const updateProfile = (req, res) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error('Пользователя с данным id не существует');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Ошибка ${validationError}: переданы некорректные данные пользователя` });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: `Ошибка ${notFoundError}: пользователя с переданным идентификатором не существует` });
      } else {
        res.status(500).send({ message: 'произошла ошибка на сервере' });
      }
    });
};

// обновление аватара
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error('Пользователя с данным id не существует');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Ошибка ${validationError}: переданы некорректные данные пользователя` });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: `Ошибка ${notFoundError}: пользователя с переданным идентификатором не существует` });
      } else {
        res.status(500).send({ message: 'произошла ошибка на сервере' });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        Promise.reject(new Error('Неправильные почта или пароль'));
      }
      const token = jwt.sign(
        { _id: User._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
