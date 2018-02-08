// import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
// import config from '../../config/config';
import Tracking from '../models/tracking.model';
import User from '../models/user.model';

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function checkIn(req, res, next) {
  User.getUserByCard(req.body.cardId)
        .then((user) => {
          console.log(user);
          if (user) {
            const tracking = new Tracking({
              cardId: user.cardId,
            });
            tracking.save();
            res.json(tracking);
          }
          throw new APIError('Invalid card number', httpStatus.UNAUTHORIZED, true);
        })
        .then(user => res.json(user))
        .catch(e => next(e));
}

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0, dateStart = 0, dateEnd = Date.parse(new Date()) } = req.query;
  Tracking.list({ limit, skip, dateStart, dateEnd })
            .then((tracks) => {
              res.json(tracks);
            })
            .catch(e => next(e));
}

export default { checkIn, list };
