import User from '../models/user.js'
import { ROLES } from '../models/role.js'
import { response, commonMessages } from './../config.js';

export const isEmailDuplicated = async (req, res, next) => {
  try {
    const email = await User.findOne({ email: req.body.email });
    if (email) {
      return res.status(response.BAD_REQUEST).json({ message: commonMessages.EMAIL_ALREADY_REGISTERED });
    }

    next();
  } catch (error) {
    res.status(response.INTERNAL_SERVER_ERROR).json({ message: error });
  }
}

export const checkValidRoles = (req, res, next) => {
  if (req.body.roles) {
    const invalidRole = req.body.roles.filter(role => !ROLES.includes(role));
    
    if (invalidRole.length > 0) {
      return res.status(response.BAD_REQUEST).json({ message: commonMessages.INVALID_ROLE });
    }
  }

  next();
}
