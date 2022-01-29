import jwt from 'jsonwebtoken';
import {databaseParams, response, authMessages} from '../config.js';
import logger from 'loglevel';

import User from './../models/user.js';

export const verifyToken = async (req, res, next) => {
  const token = req.headers['token'];
  if (!token) {
    return res.status(response.FORBIDDEN).json({ message: authMessages.NOT_TOKEN });
  }

  try {
    const verified = jwt.verify(token, databaseParams.SECRET);
    req.userId = verified.id;

    const user = await User.findById(req.userId).populate('roles');

    if (!user) {
      return res.status(response.NOT_FOUND).json({ message: authMessages.USER_NOT_FOUND });
    }
    res.locals.user = user;
    next();
  } catch (error) {
    logger.error(error);
    return res.status(response.UNAUTHORIZED).json({ message: authMessages.NOT_AUTHORIZED });
  }
}

export const isAdmin = async (req, res, next) => {
  try {
    let isAdmin = false;
    const user = res.locals.user;

    if (user && user.roles) {
      isAdmin = user.roles.filter(r => r.name === 'admin');

      if (isAdmin) {
        next();
        return;
      }
    }
  
    return res.status(response.FORBIDDEN).json({ message: 'Require admin role' });
  } catch (error) {
    return res.status(response.INTERNAL_SERVER_ERROR).send({ message: error });
  }
}
