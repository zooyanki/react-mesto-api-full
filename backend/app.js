const { Joi, celebrate } = require('celebrate');
const { errors } = require('celebrate');
const cors = require('cors');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const usersRouter = require('./routes/user.js');
const cardsRouter = require('./routes/cards.js');

const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://zooyanki.students.nomoredomains.rocks');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, OPTION, HEAD, PUT, PATCH, POST, DELETE');

  next();
});

app.use(express.json({ type: '*/*' }));

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(40),
    about: Joi.string().min(2).max(200),
    avatar: Joi.link(),
    email: Joi.string().required().email(),
    password: Joi.string().min(8),
  }),
}), createUser);

app.use(auth);

app.use('/', auth, usersRouter);

app.use('/', auth, cardsRouter);

app.get('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    res.status(400).send({ message: 'Переданы некорректные данные ' });
  }
  if (err.name === 'CastError') {
    res.status(404).send({ message: 'Запрашиваемый объект не найден' });
  }
  res.status(500).send({ message: `'Ошибка': ${err}` });
});

app.listen(PORT);
