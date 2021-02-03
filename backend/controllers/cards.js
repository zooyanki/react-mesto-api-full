const Cards = require('../models/cards');
const AccessError = require('../errors/accessError');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');

module.exports.readCards = (req, res, next) => {
  Cards.find({})
    .then((card) => res.send(card))
    .catch((err) => {
      if (err) {
        next(err);
      }
    });
};

module.exports.createCard = (req, res, next) => {
  const {
    name, link, likes, createdAt,
  } = req.body;

  Cards.create({
    name, link, owner: req.user, likes, createdAt,
  })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err) {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Cards.findById(req.params._id)
    .then((card) => {
      if (card) {
        if (String(card.owner) === req.user._id) {
          Cards.findByIdAndRemove(req.params._id)
            .then((delCard) => res.send(delCard));
        } else {
          next(new AccessError('У вас нет прав для удаления'));
        }
      } else {
        next(new NotFoundError('Карточка не найдена'));
      }
    })
    .catch((err) => {
      if (err) {
        next(err);
      }
    });
};

module.exports.addLikeCard = (req, res, next) => {
  Cards.findById(req.params._id)
    .then((card) => {
      if (card) {
        if (!card.likes.includes(req.user._id)) {
          Cards.findByIdAndUpdate(req.params._id, { $addToSet: { likes: req.user } }, { new: true })
            .then((like) => res.send(like));
        } else {
          next(new BadRequestError('Лайк уже стоит'));
        }
      } else {
        next(new NotFoundError('Карточка не найдена'));
      }
    })
    .catch((err) => {
      if (err) {
        next(err);
      }
    });
};

module.exports.removeLikeCard = (req, res, next) => {
  Cards.findById(req.params._id)
    .then((card) => {
      if (card) {
        if (card.likes.includes(req.user._id)) {
          Cards.findByIdAndUpdate(req.params._id, { $pull: { likes: req.user._id } }, { new: true })
            .then((like) => res.send(like));
        } else {
          next(new BadRequestError('Лайка в этой карточке нет'));
        }
      } else {
        next(new NotFoundError('Карточка не найдена'));
      }
    })
    .catch((err) => {
      if (err) {
        next(err);
      }
    });
};
