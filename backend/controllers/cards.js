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
    Cards.findByIdAndRemove(req.params._id)
      .then((card) => res.send( card ))
      .catch((err) => {
        if (err) {
          return next(err);
        }
      });
  }
};

module.exports.addLikeCard = (req, res, next) => {

    Cards.findByIdAndUpdate(req.params._id, { $addToSet: { likes: req.user } }, { new: true })
      .then((like) => res.send(like))
      .catch((err) => {
        if (err) {
          return next(err);
        }
    });
};

module.exports.removeLikeCard = (req, res, next) => {
  const { likeOwnerId } = req.body;

  if (likeOwnerId === req.user._id) {
    Cards.findByIdAndRemove(req.params._id, { $pull: { likes: req.user } })
      .then((like) => res.send(like))
      .catch((err) => {
        if (err) {
          return next(err);
        }
    });
  }
};
