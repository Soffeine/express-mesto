const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const signupValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    avatar: Joi.string().custom((link) => {
      if (!validator.isURL(link, { require_protocol: true })) {
        throw new Error('здесь должна быть ссылка');
      }
      return link;
    }).default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const userIdValidation = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex(),
  }),
});

const updateUserInfoValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const updateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom((link) => {
      if (!validator.isURL(link, { require_protocol: true })) {
        throw new Error('здесь должна быть ссылка');
      }
      return link;
    }),
  }),
});

const newCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().custom((link) => {
      if (!validator.isURL(link, { require_protocol: true })) {
        throw new Error('здесь должна быть ссылка');
      }
      return link;
    }),
  }),
});

const cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
});

module.exports = {
  loginValidation,
  signupValidation,
  userIdValidation,
  updateUserInfoValidation,
  updateAvatarValidation,
  newCardValidation,
  cardIdValidation,
};
