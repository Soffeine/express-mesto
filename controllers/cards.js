const Card = require('../models/card');

const ValidationError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

// получение всех карточек
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      next(err);
    })
    .catch(next);
};

// создание карточки
const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  return Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    })
    .catch(next);
};

// удаление карточки
const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findById(cardId)
    .orFail(() => new NotFoundError('Такой карточки не существует'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        next(new ForbiddenError('Нельзя удалить чужую карточку'));
      } else {
        Card.deleteOne(card)
          .then(() => {
            res.send({ data: card });
          });
      }
    })
    .catch(next);
};

// поставить лайк
const putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Такой карточки не существует'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    })
    .catch(next);
};

// убрать лайк
const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .orFail(() => new NotFoundError('Такой карточки не существует'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
