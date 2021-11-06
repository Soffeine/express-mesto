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

cardRouter.put('/:cardId/likes', cardIdValidation, putLike);

cardRouter.delete('/:cardId/likes', cardIdValidation, deleteLike);

module.exports = cardRouter;
