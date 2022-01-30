import { Router } from 'express'
const router = Router()

import { check } from 'express-validator';

import * as customerController from '../controllers/customer.js'
import { verifyToken } from '../middlewares/authJwt.js'

import {customerMessages} from './../config.js'

router.post(
  '/',
  check('name', 'Password field is empty').not().isEmpty(),
  check('surname', 'Surname field is empty').not().isEmpty(),
  check('photo', 'Photo url is necesary').not().isEmpty(),
  verifyToken,
  customerController.createCustomer
);

router.post(
  '/csv',
  check('fileName', customerMessages.CSV_FILE_NAME_REQUIRED).not().isEmpty(),
  verifyToken,
  customerController.createCustomersByCsv
);

router.get('/',
  verifyToken,
  customerController.getCustomers
);

router.get(
  '/:customerId',
  check('customerId', 'The id is not correct').isMongoId(),
  verifyToken,
  customerController.getCustomerById
);

router.get(
  '/creator/:creatorId',
  check('creatorId', 'The id is not correct').isMongoId(),
  verifyToken,
  customerController.getCustomersByCreator
);

router.get(
  '/updater/:updaterId',
  check('updaterId', 'The id is not correct').isMongoId(),
  verifyToken,
  customerController.getCustomersByUpdater
);

router.put(
  '/:customerId',
  check('customerId', 'The id is not correct').isMongoId(),
  verifyToken,
  customerController.updateCustomer
);

router.delete(
  '/:customerId',
  check('customerId', 'The id is not correct').isMongoId(),
  verifyToken,
  customerController.deleteCustomer
);

export default router;
