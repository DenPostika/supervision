import express from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import store from 'store';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import trackingRoutes from './tracking.route';

const exeption = {
  post: [
    '/api/users',
    '/api/users/admin',
    '/api/tracking'
  ]
};
const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.post('/wait-card-id', (req, res) => {
  store.set('wait-card', true);
  res.send('OK');
});

// mount auth routes at /auth
router.use('/auth', authRoutes);

/** Middlewear for checking accesible */
router
    .use((req, res, next) => {
      if (req.method === 'POST' && exeption.post.indexOf(req.originalUrl) > -1) {
        next();
      } else if (req.headers.token) {
        try {
          jwt.verify(req.headers.token, config.jwtSecret);
          next();
        } catch (err) {
          throw new APIError(`Authentication error. ${err.message}`, httpStatus.UNAUTHORIZED, true);
        }
      } else throw new APIError('Authentication error. Empty token', httpStatus.UNAUTHORIZED, true);
    });


// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /tracking
router.use('/tracking', trackingRoutes);

export default router;
