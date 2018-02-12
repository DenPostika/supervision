import express from 'express';
import validate from 'express-validation';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import paramValidation from '../../config/param-validation';
import config from '../../config/config';
import trackCtrl from '../controllers/tracking.controller';

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns checkIn data and save it */
router.route('/')
    .post(validate(paramValidation.checkin), trackCtrl.checkIn);

router
/** Middlewear for checkong accesible */
    .use((req, res, next) => {
      if (req.headers.authorization) {
        try {
          const decoded = jwt.verify(req.headers.authorization, config.jwtSecret);
          if (decoded.type !== 'admin') {
            throw new APIError('Permission denied.', httpStatus.FORBIDDEN, true);
          }
          next();
        } catch (err) {
          throw new APIError(`Authentication error. ${err.message}`, httpStatus.UNAUTHORIZED, true);
        }
      } else throw new APIError('Authentication error. Empty token', httpStatus.UNAUTHORIZED, true);
    });

router.route('/')
/** GET /api/tracking - Get list of checkIns */
    .get(trackCtrl.list);

export default router;
