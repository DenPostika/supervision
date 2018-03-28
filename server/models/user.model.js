import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import Bot from '../slack/index';
import Tracking from './tracking.model';

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    match: [
      /^\d{3}\d{2}\d{2}\d{3}$/,
      'The value of path {PATH} ({VALUE}) is not a valid mobile number.',
    ],
  },
  email: {
    type: String,
    required: true,
    match: [
      /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      'Please fill a valid email address',
    ],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  type: {
    type: String,
    default: 'employee',
  },
  cardId: {
    type: String,
    required: false,
  },
  slackName: {
    type: String,
    required: true,
  },
  atWork: {
    type: Boolean,
    required: false,
    default: false,
  },
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
UserSchema.path('slackName').validate(value => {
  const users = Bot.getUsers()._value.members;
  if (users) {
    for (let i = 0; i < users.length; i += 1) {
      if (users[i].name === value) {
        return true;
      }
    }
    return false;
  }
  return false;
}, 'Slack name does not exist!');

UserSchema.path('username').validate((value, done) => {
  mongoose
    .model('User', UserSchema)
    .count({ username: value })
    .then((count, err) => {
      if (err) {
        return done(err);
      }
      return done(!count);
    });
}, 'Username already exist!');

UserSchema.path('slackName').validate(value => {
  const users = Bot.getUsers()._value.members;
  if (users) {
    for (let i = 0; i < users.length; i += 1) {
      if (users[i].name === value) {
        return true;
      }
    }
    return false;
  }
  return false;
}, "Slack name doesn't exist!");

UserSchema.path('username').validate((value, done) => {
  mongoose
    .model('User', UserSchema)
    .count({ username: value })
    .then((count, err) => {
      if (err) {
        return done(err);
      }
      return done(!count);
    });
}, 'Username already exist!');

UserSchema.path('email').validate((value, done) => {
  mongoose
    .model('User', UserSchema)
    .count({ email: value })
    .then((count, err) => {
      if (err) {
        return done(err);
      }
      return done(!count);
    });
}, 'Email already registred!');

/**
 * Methods
 */
UserSchema.method({});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then(user => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },
  /**
   * Get user by username
   * @param {username} username - The login of user.
   * @returns {Promise<User, APIError>}
   */
  getUserByLogin(username) {
    return this.find({
      username,
    })
      .select('+password')
      .exec()
      .then(user => {
        if (user) {
          return user[0];
        }
        const err = new APIError('No such login exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },
  /**
   * Check for admin exist
   * @param {username} username - The login of user.
   * @returns {Promise<User, APIError>}
   */
  isAdminExist() {
    return this.find({
      type: 'admin',
    })
      .exec()
      .then(user => {
        if (user) {
          return user[0];
        }
        const err = new APIError('No such login exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },
  /**
   * Check if user with card exist
   * @param {cardId} cardid - The Id of user card.
   * @returns {Promise<User, APIError>}
   */
  getUserByCard(cardId) {
    return this.find({
      cardId,
    })
      .exec()
      .then(user => {
        if (user) {
          return user[0];
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },
  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find({}, '_id username cardId type email mobileNumber')
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec()
      .then(users => {
        const cardsIDs = users.map(user => {
          return user.cardId;
        });
        const now = new Date();
        const startOfToday = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );

        return Promise.all([
          users,
          Tracking.find({
            cardId: { $in: cardsIDs },
            checkIn: { $gte: new Date(startOfToday.setHours(0, 0, 0, 0)) },
          }).exec(),
        ]);
      })
      .then(results => {
        const users = results[0];
        const records = results[1];

        users.forEach(user => {
          const userRecords = records.filter(record => {
            return record.cardId === user.cardId;
          });

          user['atWork'] = !!(userRecords.length > 0 && userRecords.length % 2);
        });

        return users;
      });
  },
};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
