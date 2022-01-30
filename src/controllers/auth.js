import User from '../models/user.js'
import logger from 'loglevel';
import jwt from 'jsonwebtoken'
import {databaseParams, response, authMessages, times} from './../config.js'

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const login = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      res.status(response.INTERNAL_SERVER_ERROR).json(error)
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(response.BAD_REQUEST).json({ message: authMessages.USER_NOT_FOUND });
    }

    const matchPassword = await User.comparePassword(
      req.body.password,
      user.password
    );

    if (!matchPassword)
      return res.status(response.UNAUTHORIZED).json({ message: authMessages.INVALID_PASSWORD })

    const token = jwt.sign({ id: user._id }, databaseParams.SECRET, {
      expiresIn: times.JWT_EXPIRE,
    })

    res.status(response.OK).json({ token })
  } catch (error) {
    logger.error(error);
    res.status(response.INTERNAL_SERVER_ERROR).json(error)
  }
}
