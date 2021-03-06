import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import passwordHash from 'password-hash';
import APIError from '../helpers/APIError';
import User from '../models/user.model';
import config from '../../config/config';

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  const request = req;
  User.get(id)
    .then(user => {
      request.user = user;
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {
  const user = new User({
    username: req.body.username,
    mobileNumber: req.body.mobileNumber,
    email: req.body.email,
    password: passwordHash.generate(req.body.password),
    type: req.body.type,
    cardId: req.body.cardId,
    slackName: req.body.slackName,
  });

  user
    .save((err, savedUser) => {
      if (err) res.json(err);
      else {
        const token = jwt.sign(
          {
            username: savedUser.username,
            userId: savedUser._id,
            type: savedUser.type,
          },
          config.jwtSecret,
          { expiresIn: '1h' },
        );
        res.json({
          savedUser,
          token,
        });
      }
    })
    .catch(e => {
      next(e);
    });
}

/**
 * Create admin
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function createAdmin(req, res, next) {
  if (!User.isAdminExist) {
    const user = new User({
      username: req.body.username,
      mobileNumber: req.body.mobileNumber,
      email: req.body.email,
      password: passwordHash.generate(req.body.password),
      type: 'admin',
      cardId: req.body.cardId,
      slackName: req.body.slackName,
    });

    user
      .save((err, savedUser) => {
        if (err) res.json(err);
        else res.json(savedUser);
      })
      .catch(e => next(e));
  } else
    throw new APIError('Admin already exists', httpStatus.METHOD_FAILURE, true);
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  const user = req.user;
  user.username = req.body.username;
  user.mobileNumber = req.body.mobileNumber;
  user.email = req.body.email;
  user.password = passwordHash.generate(req.body.password);
  user.type = req.body.type;
  user.cardId = req.body.cardId;
  user.slackName = req.body.slackName;

  user
    .save((err, savedUser) => {
      if (err) res.json(err);
      else res.json(savedUser);
    })
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user
    .remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove, createAdmin };
