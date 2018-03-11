import httpStatus from 'http-status';
import moment from 'moment';
import store from 'store';
import APIError from '../helpers/APIError';
import Tracking from '../models/tracking.model';
import User from '../models/user.model';
import Bot from '../slack';
import io from '../../config/socket.io';
import { countWorkedTime } from '../utils/countWorkedTime';
import { firstComingMessage, comingMessage, leavingMessage } from '../slack/messages';

/**
 * Returns checkIn data and save it
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */

function checkIn(req, res, next) {
  if (!store.get('wait-card')) {
    User.getUserByCard(req.body.cardId)
      .then(user => {
        if (user) {
          const tracking = new Tracking({
            cardId: user.cardId,
          });
          tracking.save();
          moment.locale('uk');

          Tracking.getTodayCheckIn()
            .then(records => {
              let workTime = null;
              if (!records.length) {
                // First coming today
                firstComingMessage(user);
              } else {
                workTime = countWorkedTime(records);
                if (workTime.hours < 9 && records.length % 2) {
                  // Coming
                  comingMessage(user, workTime);
                } else if (workTime.hours > 9) {
                  // Leaving
                  leavingMessage(user, workTime);
                }
              }
            })
            .catch(e => next(e));

          res.json(tracking);
        } else {
          throw new APIError(
            'Invalid card number',
            httpStatus.UNAUTHORIZED,
            true,
          );
        }
      })
      .catch(e => next(e));
  } else {
    io.emit('card-id', req.body.cardId);
    store.set('wait-card', false);
    res.send('OK');
  }
}

/**
 * Returns tracking list if valid token is provided in header
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function list(req, res, next) {
  const {
    limit = 50,
    skip = 0,
    dateStart = 0,
    dateEnd = Date.parse(new Date()),
  } = req.query;
  Tracking.list({ limit, skip, dateStart, dateEnd })
    .then(tracks => {
      res.json(tracks);
    })
    .catch(e => next(e));
}

export default { checkIn, list };
