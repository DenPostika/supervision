import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import trackCtrl from '../controllers/tracking.controller';

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/tracking - Returns checkIn data and save it */
router.route('/')
    .post(validate(paramValidation.checkin), trackCtrl.checkIn);


router.route('/')
/** GET /api/tracking - Get list of checkIns */
    .get(trackCtrl.list);

export default router;
