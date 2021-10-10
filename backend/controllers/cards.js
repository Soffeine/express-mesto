const Card = require('../models/card');

const validationError = 400;
const notFoundError = 404;

// получение всех карточек
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      res.status(500).send({ message: `${err}: произошла ошибка на сервере` });
    });
};

// создание карточки
const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  return Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Ошибка при создании карточки ${validationError}: переданы некорректные данные` });
      } else {
        res.status(500).send({ message: 'произошла ошибка на сервере' });
      }
    });
};

// удаление карточки
const deleteCard = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndDelete(cardId)
    .orFail(() => {
      const error = new Error('Карточки с данным id не существует');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(404).send({ message: `Ошибка ${notFoundError}: такой карточки не существует` });
      } else {
        res.status(500).send({ message: 'произошла ошибка на сервере' });
      }
    });
};

// поставить лайк
const putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error('Карточки с данным id не существует');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Ошибка ${validationError}: Переданы некорректные данные при постановке лайка` });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: `Ошибка ${notFoundError}: такой карточки не существует` });
      } else {
        res.status(500).send({ message: 'произошла ошибка на сервере' });
      }
    });
};

// убрать лайк
const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .orFail(() => {
      const error = new Error('Карточки с данным id не существует');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Ошибка ${validationError}: переданы некорректные данные при снятии лайка` });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: `Ошибка ${notFoundError}: такой карточки не существует` });
      } else {
        res.status(500).send({ message: 'произошла ошибка на сервере' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
