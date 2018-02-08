import Promise from 'bluebird';
import mongoose from 'mongoose';
import moment from 'moment';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * Track Schema
 */
const TrackSchema = new mongoose.Schema({
  cardId: {
    type: String,
    required: true
  },
  checkIn: {
    type: Date,
    default: Date.now
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
TrackSchema.method({
});

/**
 * Statics
 */
TrackSchema.statics = {
    /**
     * Get cards be date range
     * @param dateStart date format yyyy-mm-dd
     * @param dateEnd date format yyyy-mm-dd
     * @returns {Promise<Tracking, APIError>}
     */
  getCardsByDateRange({ dateStart = 0, dateEnd = Date.parse(new Date()) } = {}) {
    return this.find(
      {
        created_on:
        {
          $gt: moment(dateStart),
          $lte: moment(dateEnd).day(+1)
        }
      });
  },

    /**
     * Get checkIns by cardId
     * @param {cardId} cardId - The card number.
     * @returns {Promise<Tracking, APIError>}
     */

  getCheckInsByCard(cardId) {
    return this.find({
      cardId
    })
            .exec()
            .then((checkIns) => {
              if (checkIns) {
                return checkIns;
              }
              const err = new APIError('No such card exists!', httpStatus.NOT_FOUND);
              return Promise.reject(err);
            });
  },

    /**
     * List users in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of checkIns to be skipped.
     * @param {number} limit - Limit number of checkIns to be returned.
     * @returns {Promise<Tracking[]>}
     */
  list({ limit = 50, skip = 0, dateStart = 0, dateEnd = Date.parse(new Date() + 1) } = {}) {
    const end = new Date(dateEnd);
    return this.find({
      checkIn:
      {
        $gt: new Date(dateStart),
        $lte: end.setDate(end.getDate() + 1)
      }
    })
            .sort({ createdAt: -1 })
            .skip(+skip)
            .limit(+limit)
            .exec();
  }
};

/**
 * @typedef Tracking
 */
export default mongoose.model('Tracking', TrackSchema);
