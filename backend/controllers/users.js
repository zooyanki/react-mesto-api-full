const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const Unauthorized = require('../errors/unauthorized')

const User = require('../models/user');

module.exports.readUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err) {
        next(err);
      }
    });
};

module.exports.readUserId = (req, res, next) => {
  User.findById(req.params._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      } else
      {res.send(user)};
    })
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then(() => res.send(true))
    .catch((err) => {
      if (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
          next(new BadRequestError('Такой пользователь уже существует'));
        }
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { $set: { name, about } }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err) {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { $set: { avatar } }, { new: true })
    .then((ava) => res.send(ava))
    .catch((err) => {
      if (err) {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('token', token, { httpOnly: true });
      res.send({ token });
    })
    .catch(() => {
      next(new Unauthorized('Неавторизован'));
    });
};

module.exports.readUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err) {
        next(err);
      }
    });
};
