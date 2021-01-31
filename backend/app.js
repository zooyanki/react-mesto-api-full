const { Joi, celebrate } = require('celebrate');
const { errors } = require('celebrate');

const express = require('express');
const mongoose = require('mongoose');
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


const allowedCors = [
  'http://zooyanki.students.nomoredomains.rocks',
  'http://api.zooyanki.students.nomoredomains.rocks'
];

app.use(function(req, res, next) {

  const { origin } = req.headers; // Записываем в переменную origin соответствующий заголовок

  if (allowedCors.includes(origin)) { // Проверяем, что значение origin есть среди разрешённых доменов
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, authorization');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS');
  }

  if (req.method === "OPTIONS") {
    res.send(200);
  } else {
    next()
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

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}

app.get('*', () => {
  throw new NotFoundError();
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).send({ message: 'Переданы некорректные данные ' });
  }
  if (err.name === 'CastError') {
    return res.status(404).send({ message: 'Запрашиваемый объект не найден' });
  }
  if (err.name === 'NotFoundError') {
    return res.status(404).send({message: 'Запрашиваемый ресурс не найден'});
  }
  return res.status(500).send({ message: `'Ошибка': ${err}` });
});

app.listen(PORT);
