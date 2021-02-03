const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const badRequestError = require('../errors/badRequestError');
const notFoundError = require('../errors/notFoundError');

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
      if (user) {
        res.send(user);
      } else { 
        throw new notFoundError('Пользователь не найден')
      }
    })
    .catch((err) => {
      if (err) {
        next(err);
      }
    });
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
          next(new badRequestError('Такой пользователь уже существует'));
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

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('token', token, { httpOnly: true });
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
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
