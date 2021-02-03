const usersRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  readUserId, readUsers, updateUser, updateAvatar, readUser,
} = require('../controllers/users');

usersRouter.get('/users', readUsers);

usersRouter.get('/users/me', readUser);

usersRouter.get('/users/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
}), readUserId);

usersRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(40),
    about: Joi.string().required().min(2).max(200),
  }),
}), updateUser);

usersRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().required().keys({
    avatar: Joi.string().required().regex(/https?:\/\/\S+\.\S+/m),
  }),
}), updateAvatar);

module.exports = usersRouter;
