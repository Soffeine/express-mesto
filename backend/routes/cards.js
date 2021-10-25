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

cardRouter.get('/cards', getCards);

cardRouter.post('/cards', newCardValidation, createCard);

cardRouter.delete('/cards/:cardId', cardIdValidation, deleteCard);

cardRouter.put('/cards/:cardId/likes', cardIdValidation, putLike);

cardRouter.delete('/cards/cardId/likes', cardIdValidation, deleteLike);

module.exports = cardRouter;
