const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ValidationError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');

// получение данных о всех пользователях
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

// получение данных о конкретном пользователе с помощью айди
const getUser = (req, res, next) => {
  const { _id } = req.params;
  return User.findById(_id)
    .orFail(() => new NotFoundError('Такой карточки не существует'))
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        next(new NotFoundError('Такого пользователя не существует'));
      } else if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    })
    .catch(next);
};

// создание аккаунта
const createUser = (req, res, next) => {
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
        next(new ValidationError('переданы некорректные данные при создании пользователя'));
      } else if (err.statusCode === 409) {
        next(new ConflictError('Пользователь с такой почтой уже существует'));
      } else {
        next(err);
      }
    })
    .catch(next);
};

// обновление данных пользователя
const updateProfile = (req, res, next) => {
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
        next(new ValidationError('переданы некорректные данные при создании пользователя'));
      } else if (err.statusCode === 404) {
        next(new NotFoundError('Такого пользователя не существует'));
      } else {
        next(err);
      }
    })
    .catch(next);
};

// обновление аватара
const updateAvatar = (req, res, next) => {
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
        next(new ValidationError('переданы некорректные данные при создании пользователя'));
      } else if (err.statusCode === 404) {
        next(new NotFoundError('Такого пользователя не существует'));
      } else {
        next(err);
      }
    })
    .catch(next);
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
