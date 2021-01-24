const cardsRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  createCard, deleteCard, readCards, addLikeCard, removeLikeCard,
} = require('../controllers/cards');

cardsRouter.get('/cards', readCards);

cardsRouter.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.link(),
  }),
}), createCard);

cardsRouter.delete('/cards/:cardId', deleteCard);

cardsRouter.put('/cards/:cardId/likes', addLikeCard);

cardsRouter.delete('/cards/:cardId/likes', removeLikeCard);

module.exports = cardsRouter;
