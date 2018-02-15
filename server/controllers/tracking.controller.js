import httpStatus from 'http-status';
import SlackBot from 'slackbots';
import APIError from '../helpers/APIError';
import Tracking from '../models/tracking.model';
import User from '../models/user.model';
import config from '../../config/config';

const Bot = new SlackBot({
  token: config.slackToken,
});
/**
 * Returns checkIn data and save it
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */

function checkIn(req, res, next) {
  User.getUserByCard(req.body.cardId)
        .then((user) => {
          if (user) {
            const tracking = new Tracking({
              cardId: user.cardId,
            });
            tracking.save();

            Tracking.getTodayFirstCheckIn()
                .then((record) => {
                  const worktime = new Date();
                  if (!record) {
                    worktime.setHours(worktime.getHours() + 9);

                    Bot.postMessageToUser(user.slackName, `Hi, ${user.username}. Your work day will end at ${worktime.toTimeString()}`, {
                      as_user: true,
                    });
                  } else if (record.checkIn.setHours(worktime.getHours() + 9) <= worktime) {
                    Bot.postMessageToUser(user.slackName, `Hi again. Your work day finished at ${worktime.toTimeString()}`, {
                      as_user: true,
                    });
                  }
                })
                .catch(e => next(e));

            res.json(tracking);
          } else throw new APIError('Invalid card number', httpStatus.UNAUTHORIZED, true);
        })
        .catch(e => next(e));
}

/**
 * Returns tracking list if valid token is provided in header
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
