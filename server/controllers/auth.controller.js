import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import passwordHash from 'password-hash';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import User from '../models/user.model';

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  User.getUserByLogin(req.body.username)
      .then((user) => {
        if (!user) {
          throw new APIError('Authentication error. User doesn\'t exist', httpStatus.UNAUTHORIZED, true);
        }
        if (passwordHash.verify(req.body.password, user.password)) {
          const token = jwt.sign({
            username: user.username,
            userId: user._id,
            type: user.type
          }, config.jwtSecret, { expiresIn: '1h' });
          return res.json({
            token,
            username: user.username,
          });
        }
        throw new APIError('Authentication error. Wrong password', httpStatus.UNAUTHORIZED, true);
      })
      .then(user => res.json(user))
      .catch(e => next(e));
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

export default { login, getRandomNumber };
