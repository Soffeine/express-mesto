const cardRouter = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');

const {
  newCardValidation,
  cardIdValidation,
} = require('../middlewares/validation');

cardRouter.get('/', getCards);

cardRouter.post('/', newCardValidation, createCard);

cardRouter.delete('/:cardId', cardIdValidation, deleteCard);

cardRouter.put('/likes/:cardId', cardIdValidation, putLike);

cardRouter.delete('/likes/:cardId', cardIdValidation, deleteLike);

module.exports = cardRouter;
