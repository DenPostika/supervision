import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import Tracking from './tracking.model';

/**
 * Day Schema
 */
const DaySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'workday'
  },
  date: {
    type: Date,
    required: true
  }
});

/**
 * Methods
 */
DaySchema.method({});

/**
 * Statics
 */
DaySchema.statics = {
    /**
     * Get user
     * @param {ObjectId} id - The objectId of calendar's day.
     * @returns {Promise<Calendar, APIError>}
     */
  get(id) {
    return this.findById(id)
            .exec()
            .then((day) => {
              if (day) {
                return day;
              }
              const err = new APIError('No such date exists!', httpStatus.NOT_FOUND);
              return Promise.reject(err);
            });
  },

    /**
     * Check if user with card exist
     * @param {string} date - calendar's date of the day.
     * @param {number} cardId - The Id of user card.
     * @returns {Promise<Calendar, APIError>}
     */
  getDayByDate(date, userId) {
    const end = new Date(date);
    return this.findOne({
      date:
      {
        $gte: new Date(date),
        $lt: end.setDate(end.getDate() + 1)
      },
      userId
    })
            .exec()
            .then((day) => {
              if (day) {
                return day;
              }
              const err = new APIError('No such day exists!', httpStatus.NOT_FOUND);
              return Promise.reject(err);
            });
  },
    /**
     * Remove user days
     * @param {number} cardId - The Id of user card.
     * @returns {Promise<Calendar, APIError>}
     */
  removeDaysByUserId(userId) {
    return this.find({
      userId
    })
        .remove()
        .exec();
  },
    /**
     * List users in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of days to be skipped.
     * @param {number} cardId - user's card Id.
     * @param {string} dateStart - date format yyyy-mm-dd
     * @param {string} dateEnd - date format yyyy-mm-dd
     * @param {string} status - status of the day.
     * @returns {Promise<Calendar[]>}
     */
  dayList({ skip = 0, userId = 0, dateStart = 0, dateEnd = Date.parse(new Date()), status = 'all' } = {}) {
    const end = new Date(dateEnd);
    const findObj = {
      date:
      {
        $gte: new Date(dateStart),
        $lt: end.setDate(end.getDate() + 1)
      }
    };
    if (userId && +userId !== 0) {
      findObj.userId = userId;
    }
    if (status !== 'all') {
      findObj.status = status;
    }
    return this.find(findObj)
            .sort({ createdAt: -1 })
            .skip(+skip)
            .exec();
  }
};

/**
 * @typedef User
 */
export default mongoose.model('Calendar', DaySchema);
