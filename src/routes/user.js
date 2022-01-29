import { Router } from 'express';
const router = Router();

import { check } from 'express-validator';

import * as userController from './../controllers/user.js';
import {userMessages} from './../config.js';

import {authJWT, checkSignup, validateBodyFields} from './../middlewares/index.js';

router.post(
  '/',
  check('email', userMessages.EMAIL_NOT_VALID).isEmail(),
  check('password', userMessages.EMPTY_PASSWORD).not().isEmpty(),
  authJWT.verifyToken,
  authJWT.isAdmin,
  checkSignup.checkDuplicateEmail,
  checkSignup.checkValidRoles,
  userController.createUser
)

router.get('/', authJWT.verifyToken, authJWT.isAdmin, userController.getUsers);

router.get(
  '/:userId',
  check('userId', 'The id is not correct').isMongoId(),
  authJWT.verifyToken,
  authJWT.isAdmin,
  userController.getUserById
);

router.put(
  '/:userId',
  check('userId', 'The id is not correct').isMongoId(),
  validateBodyFields,
  authJWT.verifyToken,
  authJWT.isAdmin,
  userController.updateUser
);

router.put(
  '/:userId/status',
  check('userId', 'The id is not correct').isMongoId(),
  authJWT.verifyToken,
  authJWT.isAdmin,
  userController.updateUserRole
);

router.delete(
  '/:userId',
  check('userId', 'The id is not correct').isMongoId(),
  authJWT.verifyToken,
  authJWT.isAdmin,
  userController.deleteUser
);

export default router
