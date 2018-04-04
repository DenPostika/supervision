import Joi from 'joi';

export default {
  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^\d{3}\d{2}\d{2}\d{3}$/).required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      type: Joi.string().regex(/admin|employee/),
      slackName: Joi.string().required(),
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      username: Joi.string(),
      mobileNumber: Joi.string().regex(/^\d{3}\d{2}\d{2}\d{3}$/),
      email: Joi.string().email(),
      cardId: Joi.number(),
      password: Joi.string(),
      type: Joi.string().regex(/admin|employee/),
      slackName: Joi.string(),
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  },

  // POST /api/calendar
  calendar: {
    body: {
      userId: Joi.string().required(),
      date: Joi.date().required()
    }
  },

  // PUT /api/calendar
  calendarUpdate: {
    body: {
      userId: Joi.string().required(),
      date: Joi.date().required(),
      status: Joi.string().required()
    }
  },

  // POST /api/calendar/generate
  calendarGenerate: {
    body: {
      userId: Joi.string().required(),
    }
  },

  // POST /api/tracking/chekin
  checkin: {
    body: {
      cardId: Joi.string().required()
    }
  }
};
