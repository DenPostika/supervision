import express from 'express';
import validate from 'express-validation';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import paramValidation from '../../config/param-validation';
import userCtrl from '../controllers/user.controller';
import config from '../../config/config';

const router = express.Router(); // eslint-disable-line new-cap
router
    /** Middlewear for checkong accesible */
    .use((req, res, next) => {
      if (req.headers.authorization) {
        try {
          jwt.verify(req.headers.authorization, config.jwtSecret);
          next();
        } catch (err) {
          throw new APIError(`Authentication error. ${err.message}`, httpStatus.UNAUTHORIZED, true);
        }
      } else throw new APIError('Authentication error. Empty token', httpStatus.UNAUTHORIZED, true);
    });
router.route('/')
  /** GET /api/users - Get list of users */
  .get(userCtrl.list)

  /** POST /api/users - Create new user */
  .post(validate(paramValidation.createUser), userCtrl.create);

router.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(userCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(validate(paramValidation.updateUser), userCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(userCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

export default router;
