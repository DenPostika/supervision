import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import CalendarCtrl from '../controllers/calendar.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
        /** POST /api/calendar - Returns day data and save it */
      .post(validate(paramValidation.calendar), CalendarCtrl.create)

        /** PUT /api/calendar/ - Update day */
      .put(validate(paramValidation.calendarUpdate), CalendarCtrl.update);

router
    .route('/')
    /** GET /api/calendar - Get list of days */
    .get(CalendarCtrl.list);

export default router;
