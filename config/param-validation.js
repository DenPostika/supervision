import Joi from 'joi';

export default {
  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^\d{3}\d{2}\d{2}\d{3}$/).required(),
      email: Joi.string().regex(/^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/).required(),
      password: Joi.string().required(),
      cardId: Joi.string().required(),
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^\d{3}\d{2}\d{2}\d{3}$/).required(),
      email: Joi.string().regex(/^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/).required(),
      password: Joi.string().required(),
      cardId: Joi.string().required(),
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  }
};
