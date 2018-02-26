import httpStatus from 'http-status';
import store from 'store';
import moment from 'moment';
import io from '../../config/socket.io';
import APIError from '../helpers/APIError';
import Tracking from '../models/tracking.model';
import User from '../models/user.model';
import Bot from '../slack';

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
      .then((user) => {
        if (user) {
          const tracking = new Tracking({
            cardId: user.cardId,
          });
          tracking.save();
          moment.locale('uk');
          Tracking.getTodayCheckIn()
            .then((records) => {
              let worktime = null;
              if (!records.length) {
                worktime = moment();
                worktime.add(9, 'hours');

                Bot.postMessageToUser(
                  user.slackName,
                  `Привет, ${
                    user.username
                    }! Твой рабочий день закончится в ${worktime.format('LT')}`,
                  {
                    as_user: true,
                  }
                );
              } else if (worktime.hours < 9) {
                worktime = countWorkTime(records);
                console.log(records.length);
                if (records.length % 2 !== 0) {
                  // Приход
                  Bot.postMessageToUser(
                    user.slackName,
                    `Ты отработал уже ${worktime.hours} ч ${
                      worktime.minutes
                      } м ты можешь уйти в ${moment()
                      .add(9 - worktime.hours, 'hours')
                      .add(
                        worktime.minutes !== 0 ? 60 - worktime.minutes : 0,
                        'minutes'
                      )
                      .format('LT')}`,
                    {
                      as_user: true,
                    }
                  );
                } else {
                  // Уход
                  Bot.postMessageToUser(
                    user.slackName,
                    `День закончен ты отработал ${worktime.hours} ч ${
                      worktime.minutes
                      } м`,
                    {
                      as_user: true,
                    }
                  );
                }
              }
            })
            .catch(e => next(e));

          res.json(tracking);
        } else {
          throw new APIError(
            'Invalid card number',
            httpStatus.UNAUTHORIZED,
            true
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

function countWorkTime(records) {
  let worktime = 0;

  records.push({
    checkIn: moment().format(),
  });

  for (let i = 0; i < records.length; i += 2) {
    if (records[i + 1]) {
      worktime = moment(records[i + 1].checkIn)
        .diff(
          moment(records[i].checkIn),
          'minutes'
        );
    }
  }

  return {
    hours: Math.round(worktime / 60),
    minutes: worktime % 60,
  };
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
    .then((tracks) => {
      res.json(tracks);
    })
    .catch(e => next(e));
}

export default { checkIn, list };
