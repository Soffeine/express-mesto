const User = require('../models/user');
const validationError = 400;
const searchError = 404;

//получение данных о всех пользователях
const getUsers = (req, res) => {
  return User.find({})
    .then((users) => {
      res.status(200).send(users)
    })
    .catch((err) => {
      return res.status(500).send({ message: "Произошла ошибка на сервере" })
    });
}

//получение данных о конкретном пользователе с помощью айди
const getUser = (req, res) => {
  const { _id } = req.params;
  return User.findById(_id)
    .then((user) => {
      return res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === searchError) {
        res.status(404).send({ message: 'Ошибка: пользователя с переданным идентификатором не существует' });
        return;
      } else {
        res.status(500).send({ message: 'произошла ошибка на сервере' })
      }
    })
}

//создание аккаунта
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => {
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if(err.name === validationError) {
        res.status(400).send({message: 'Ошибка: переданы некорректные данные при создании пользователя'});
        return;
      } else {
        res.status(500).send({message: 'произошла ошибка на сервере'})
      }
    })
}

//обновление данных пользователя
const updateProfile = (req, res) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => {
      return res.status(200).send(user)
    })
    .catch((err) => {
      if(err.name === validationError) {
        res.status(400).send({message: 'Ошибка: переданы некорректные данные пользователя'});
        return;
      } else if(err.name === searchError) {
        res.status(404).send({message: 'Ошибка: пользователя с переданным идентификатором не существует'});
        return;
      } else {
        res.status(500).send({message: 'произошла ошибка на сервере'})
      }
    })
}

//обновление аватара
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => {
      return res.status(200).send(user)
    })
    .catch((err) => {
      if(err.name === validationError) {
        res.status(400).send({message: 'Ошибка: переданы некорректные данные пользователя'});
        return;
      } else if(err.name === searchError) {
        res.status(404).send({message: 'Ошибка: пользователя с переданным идентификатором не существует'});
        return;
      } else {
        res.status(500).send({message: 'произошла ошибка на сервере'})
      }
    })
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar
}