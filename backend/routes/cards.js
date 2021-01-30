const cardsRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  createCard, deleteCard, readCards, addLikeCard, removeLikeCard,
} = require('../controllers/cards');

cardsRouter.get('/cards', readCards);

cardsRouter.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().uri(),
  }),
}), createCard);

cardsRouter.delete('/cards/:_id', deleteCard);

cardsRouter.put('/cards/:_id/likes', addLikeCard);

cardsRouter.delete('/cards/:_id/likes', removeLikeCard);

module.exports = cardsRouter;
