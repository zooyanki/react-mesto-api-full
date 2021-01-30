const Cards = require('../models/cards');

module.exports.readCards = (req, res, next) => {
  Cards.find({})
    .then((card) => res.send( card ))
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
    name, link, owner: req.user, likes, createdAt,
  })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err) {
        return next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { owner } = req.body;

  if (owner === req.user._id) {
    Cards.findByIdAndRemove(req.body._id)
      .then((card) => res.send( card ))
      .catch((err) => {
        if (err) {
          return next(err);
        }
      });
  }
};

module.exports.addLikeCard = (req, res, next) => {

    Cards.findByIdAndUpdate(req.body._id, { $addToSet: { likes: req.user } }, { new: true })
      .then((like) => res.send(like))
      .catch((err) => {
        if (err) {
          return next(err);
        }
    });
};

module.exports.removeLikeCard = (req, res, next) => {
  const { likes } = req.body;

  if (likes._id === req.user._id) {
    Cards.findByIdAndRemove(req.body._id, { $pull: { likes: req.user } }, { new: true })
      .then((like) => res.send(like))
      .catch((err) => {
        if (err) {
          return next(err);
        }
    });
  }
};
