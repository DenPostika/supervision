import express from 'express';
import validate from 'express-validation';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import paramValidation from '../../config/param-validation';
import userCtrl from '../controllers/user.controller';
import config from '../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/users/admin - Create new user */
router.route('/admin')
    .post(validate(paramValidation.createUser), userCtrl.createAdmin);

router.route('/')
/** POST /api/users - Create new user */
    .post(validate(paramValidation.createUser), userCtrl.create);

router.route('/')
  /** GET /api/users - Get list of users */
  .get(userCtrl.list);

router.route('/:userId')
/** GET /api/users/:userId - Get user */
    .get(userCtrl.get);


/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

/* TODO: create role-permission collection*/
router
/** Middlewear for checking if this admin */
    .use((req, res, next) => {
      const decoded = jwt.verify(req.headers.token, config.jwtSecret);
      if (decoded.type === 'admin' || decoded.username === req.body.username) {
        next();
      } else throw new APIError('Permission denied.', httpStatus.FORBIDDEN, true);
    });

router.route('/:userId')
    /** PUT /api/users/:username - Update user */
    .put(validate(paramValidation.updateUser), userCtrl.update)

    /** DELETE /api/users/:userId - Delete user */
    .delete(userCtrl.remove);

export default router;
