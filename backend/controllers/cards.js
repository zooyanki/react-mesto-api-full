const Cards = require('../models/cards');

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
  Cards.findByIdAndRemove(req.params._id)
    .then((card) => {
      if (card.owner === req.user._id) {
        res.send(card)
      } else {
        res.status(403).send({message : 'Права на удаление отсутсвуют'})
      }
      if (card) {
        res.send(card)
      } else {
        res.status(404).send({message : 'Объект не найден'})
      }
    })
    .catch((err) => {
      if (err) {
        next(err);
      }
    });
};

module.exports.addLikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(req.params._id, { $addToSet: { likes: req.user } }, { new: true })
    .then((like) => {
      if (like) {
        res.send(like)
      } else {
        res.status(404).send({message : 'Объект не найден'})
      }
    })
    .catch((err) => {
      if (err) {
        next(err);
      }
    });
};

module.exports.removeLikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(req.params._id, { $pull: { likes: req.user._id } }, { new: true })
    .then((like) => {
      if (like) {
        res.send(like)
      } else {
        res.status(404).send({message : 'Объект не найден'})
      }
    })
    .catch((err) => {
      if (err) {
        next(err);
      }
    });
};
