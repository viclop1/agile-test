import { Router } from 'express'
import { fieldControllers } from '../config.js'
const router = Router()

import { check } from 'express-validator'

import {login} from './../controllers/auth.js'
import {validateBodyFields } from '../middlewares/validator.js'

router.post(
  '/login',
  check('email', fieldControllers.EMAIL_FORMAT).isEmail(),
  check('password', fieldControllers.PASSWORD_EMPTY).not().isEmpty(),
  validateBodyFields,
  login
)

export default router
