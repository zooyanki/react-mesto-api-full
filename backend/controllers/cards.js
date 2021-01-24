const Cards = require('../models/cards');

module.exports.readCards = (req, res, next) => {
  Cards.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
};

module.exports.createCard = (req, res, next) => {
  const {
    name, link, owner, likes, createdAt,
  } = req.body;

  Cards.create({
    name, link, owner: req.user._id, likes, createdAt,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { owner } = req.body;

  if (owner === req.user._id) {
    Cards.findByIdAndRemove(req.params._id)
      .then((card) => res.send({ data: card }))
      .catch((err) => {
        if (err) {
          return next(err);
        }
      });
  }
};

module.exports.addLikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((like) => res.send({ data: like }))
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
};

module.exports.removeLikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((like) => res.send({ data: like }))
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
};
