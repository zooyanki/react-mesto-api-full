const usersRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  readUserId, readUsers, updateUser, updateAvatar, readUser,
} = require('../controllers/users');

usersRouter.get('/users', readUsers);

usersRouter.get('/users/me', readUser);

usersRouter.get('/users/:_id', readUserId);

usersRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(40),
    about: Joi.string().min(2).max(200),
  }),
}), updateUser);

usersRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri(),
  }),
}), updateAvatar);

module.exports = usersRouter;
