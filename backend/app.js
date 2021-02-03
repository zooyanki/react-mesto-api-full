const { Joi, celebrate } = require('celebrate');
const { errors } = require('celebrate');

const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/user.js');
const cardsRouter = require('./routes/cards.js');

const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/notFoundError');

const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const allowedCors = [
  'https://zooyanki.students.nomoredomains.rocks',
  'http://zooyanki.students.nomoredomains.rocks',
  'https://api.zooyanki.students.nomoredomains.rocks',
  'http://api.zooyanki.students.nomoredomains.rocks',
];

app.use((req, res, next) => {
  const { origin } = req.headers;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, authorization');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS');
  }

  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});

app.use(express.json({ type: '*/*' }));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

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
    avatar: Joi.string().regex(/https?:\/\/\S+\.\S+/m),
    email: Joi.string().required().email(),
    password: Joi.string().min(8),
  }),
}), createUser);

app.use(auth);

app.use('/', auth, usersRouter);

app.use('/', auth, cardsRouter);

app.use('*', () => {
  throw new NotFoundError('Адрес не найден');
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {   //РУКИ ПРОЧЬ ОТ NEXT!!!!!!!!!!!!!!!!!!!!!!!
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT);
