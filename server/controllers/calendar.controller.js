import httpStatus from 'http-status';
import moment from 'moment';
import APIError from '../helpers/APIError';
import User from '../models/user.model';
import Calendar from '../models/calendar.model';

/**
 * Get day
 * @returns {Day}
 */
function get(req, res) {
  return res.json(req.day);
}

/**
 * Create new day
 * @property {string} req.body.cardId - The cardId of user.
 * @property {string} req.body.status - The status of day.
 * @property {date} req.body.date - The date of day formated in yyyy-mm-dd.
 * @returns {Day}
 */
function create(req, res, next) {
  User.get(req.body.userId)
        .then((user) => {
          if (user) {
            const day = new Calendar({
              date: moment(req.body.date).format(),
              status: req.body.status,
              userId: req.body.userId,
            });
            day.save((err, savedDay) => {
              if (err) res.json(err);
              else {
                res.json(savedDay);
              }
            })
              .catch((e) => {
                next(e);
              });
          } else {
            throw new APIError(
                  'Invalid card number',
                  httpStatus.UNAUTHORIZED,
                  true
              );
          }
        })
        .catch((e) => {
          next(e);
        });
}

/**
 * Generate calendar
 * @property {string} req.body.cardId - The cardId of user.
 * @property {string} req.body.status - The status of day.
 * @property {date} req.body.date - The date of day formated in yyyy-mm-dd.
 * @returns {Day}
 */
function generate(req, res, next) {
  User.get(req.body.userId)
        .then((user) => {
          if (user) {
            Calendar.removeDaysByUserId(req.body.userId);
            const date = new Date();
            const year = date.getFullYear();
            date.setDate(1);
            date.setMonth(0);
            while (date.getFullYear() === year) {
              if (date.getDay() === 0 || date.getDay() === 6) {
                const day = new Calendar({
                  date: new Date(date),
                  status: 'weekend',
                  userId: req.body.userId,
                });
                day.save();
              }
              date.setDate(date.getDate() + 1);
            }
            res.send('OK');
          } else {
            throw new APIError(
                    'Invalid card number',
                    httpStatus.UNAUTHORIZED,
                    true
                );
          }
        })
        .catch((e) => {
          next(e);
        });
}
/**
 * Update existing date
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */

function update(req, res, next) {
  Calendar.getDayByDate(moment(req.body.date).format(), req.body.userId)
        .then((dateDay) => {
          if (dateDay) {
            Calendar.findOneAndUpdate({ _id: dateDay.id }, req.body, { upsert: true }, (err, doc) => {
              if (err) return res.send(500, { error: err });
              doc.status = req.body.status;
              return res.json(doc);
            });
          } else {
            throw new APIError(
                    'Invalid card number or date',
                    httpStatus.UNAUTHORIZED,
                    true
                );
          }
        })
        .catch((e) => {
          next(e);
        });
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
        skip = 0,
        userId = 0,
        dateStart = 0,
        dateEnd = Date.parse(new Date()),
        status = 'all'
    } = req.query;
  Calendar.dayList({ skip, userId, dateStart, dateEnd, status })
        .then(days => Promise.all([days, User.list()]))
        .then((results) => {
          const days = results[0];
          const users = results[1];
          const output = [];
          for (const day in days) {
            const uId = days[day].userId;
            const user = userById(users, uId);
            const elem = output.findIndex(elem => elem.userId == uId);
            if (elem < 0) {
              output.push({
                userId: user.id,
                cardId: user.cardId,
                username: user.username,
                data: [{
                  date: days[day].date,
                  status: days[day].status
                }]
              });
            } else {
              output[elem].data.push({ date: days[day].date, status: days[day].status });
            }
          }
          res.json(output);
        })
        .catch(e => next(e));
}

function userById(users, userId) {
  return users.filter(user => user.id == userId)[0];
}


export default { create, list, get, update, generate };
