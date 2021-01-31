const cardsRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  createCard, deleteCard, readCards, addLikeCard, removeLikeCard,
} = require('../controllers/cards');

cardsRouter.get('/cards', readCards);

cardsRouter.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().regex(/https?:\/\/\S+\.\S+/m),
  }),
}), createCard);

cardsRouter.delete('/cards/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
}), deleteCard);

cardsRouter.put('/cards/:_id/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
}), addLikeCard);

cardsRouter.delete('/cards/:_id/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
}), removeLikeCard);

module.exports = cardsRouter;
