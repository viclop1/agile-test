import User from '../models/user.js';
import Role from '../models/role.js';
import logger from 'loglevel';
import { response } from '../config.js';

export const createUser = async (req, res) => {
  try {
    const { email, password, roles } = req.body;

    const newUser = new User({
      email,
      password: await User.encryptPassword(password),
    });

    if (roles) {
      const userRoles = await Role.find({ name: { $in: roles } });
      newUser.roles = userRoles.map(role => role._id);
    } else {
      const role = await Role.findOne({ name: 'user' });
      newUser.roles = [role._id];
    }

    const user = await newUser.save();

    return res.status(response.CREATED).json(user);
  } catch (error) {
    logger.error(error);
    res.status(response.INTERNAL_SERVER_ERROR).json(error);
  }
}

export const getUsers = async (req, res) => {
  try {
    const { page, perPage } = req.query;
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perPage, 10) || 10,
    };

    const users = await User.paginate({}, options);
    res.status(response.OK).json(users);
  } catch (error) {
    logger.error(error);
    res.status(response.INTERNAL_SERVER_ERROR).json(error);
  }
}

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate('roles');

    res.status(response.OK).json(user);
  } catch (error) {
    logger.error(error);
    res.status(response.INTERNAL_SERVER_ERROR).json(error);
  }
}

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      req.body,
      { new: true }
    );

    const userSaved = await updatedUser.save();
    res.status(response.OK).json(userSaved);
  } catch (error) {
    logger.error(error);
    res.status(response.INTERNAL_SERVER_ERROR).json(error);
  }
}

export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;

    const [ user, userRole, adminRole ] = await Promise.all([
      User.findById(userId),
      Role.findOne({ name: 'user' }),
      Role.findOne({ name: 'admin' }),
    ]);

    if (user.roles.includes(userRole._id)) {
      user.roles = [adminRole._id];
    } else {
      user.roles = [userRole._id];
    } 

    const userSaved = await user.save();
    res.status(response.OK).json(userSaved);
  } catch (error) {
    logger.error(error);
    res.status(response.INTERNAL_SERVER_ERROR).json(error);
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.status(response.OK).json({ message: 'User successfully deleted' });
  } catch (error) {
    logger.error(error);
    res.status(response.INTERNAL_SERVER_ERROR).json(error);
  }
}