const Card = require('../models/card');
const validationError = 400;
const searchError = 404;


//получение всех карточек
const getCards = (req, res) => {
  return Card.find({})
  .then((cards) => {
    res.status(200).send(cards)
  })
  .catch((err) => {
    if(err.name === validationError) {
      res.status(400).send({message: 'Ошибка: переданы некорректные данные карточек'});
      return;
    } else {
      res.status(500).send({message: 'произошла ошибка на сервере'});
    }
  })
}

//создание карточки
const createCard = (req, res) => {
  const { name, link } = req.body;
  return Card.create({ name, link })
  .then((card) => {
    return res.status(201).send(card)
  })
  .catch((err) => {
    if(err.name === validationError) {
      res.status(400).send({message: 'Ошибка при создании карточки: переданы некорректные данные'});
      return;
    } else {
      res.status(500).send({message: 'произошла ошибка на сервере'})
    }
  })
}

//удаление карточки
const deleteCard = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndDelete(cardId)
  .then((card) => {
    if (req.user._id === card.owner._id) {
      res.status(200).send(card);
    }
  })
  .catch((err) => {
    if(err.name === searchError) {
      res.status(404).send({message: 'Ошибка при удалении карточки: карточки с переданным идентификатором не существует'});
      return;
    } else {
      res.status(500).send({message: 'произошла ошибка на сервере'})
    }
  })
}

//поставить лайк
const putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
  .then((card) => {
    res.status(200).send(card)
  })
  .catch((err) => {
    if(err.name === validationError) {
      res.status(400).send({message: 'Переданы некорректные данные при постановке лайка'});
      return;
    } else if(err.name === searchError) {
      res.status(404).send({message: 'Ошибка при постановке лайка: карточки с переданным идентификатором не существует'});
      return;
    } else {
      res.status(500).send({message: 'произошла ошибка на сервере'})
    }
  })
}

//убрать лайк
const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true })
  .then((card) => {
    res.status(200).send(card)
  })
  .catch((err) => {
    if(err.name === validationError) {
      res.status(400).send({message: 'Ошибка: переданы некорректные данные при снятии лайка'});
      return;
    } else if(err.name === searchError) {
      res.status(404).send({message: 'Ошибка при снятии лайка: карточки с переданным идентификатором не существует'});
      return;
    } else {
      res.status(500).send({message: 'произошла ошибка на сервере'})
    }
  })
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike
}