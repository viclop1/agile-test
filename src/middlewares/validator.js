import {validationResult} from 'express-validator';
import { response } from '../config';

export const validateBodyFields = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(response.BAD_REQUEST).json(errors);
  }

  next();
}
