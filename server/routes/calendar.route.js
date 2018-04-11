import express from 'express';
import validate from 'express-validation';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import paramValidation from '../../config/param-validation';
import CalendarCtrl from '../controllers/calendar.controller';
import config from '../../config/config';


const router = express.Router(); // eslint-disable-line new-cap

router
/** Middleware for checking if this admin */
    .use((req, res, next) => {
      const decoded = jwt.verify(req.headers.token, config.jwtSecret);
      if (decoded.type === 'admin') {
        next();
      } else throw new APIError('Permission denied.', httpStatus.FORBIDDEN, true);
    });

router.route('/')
        /** POST /api/calendar - Returns day data and save it */
      .post(validate(paramValidation.calendar), CalendarCtrl.create)

        /** PUT /api/calendar/ - Update day */
      .put(validate(paramValidation.calendarUpdate), CalendarCtrl.update);

router
    .route('/')
    /** GET /api/calendar - Get list of days */
    .get(CalendarCtrl.list);

router.route('/generate')
/** POST /api/calendar - Returns day data and save it */
    .post(validate(paramValidation.calendarGenerate), CalendarCtrl.generate);

export default router;
