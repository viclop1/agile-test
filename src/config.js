import { config } from 'dotenv';
config()

export const appParams = {
  PORT: process.env.PORT || 3000,
};

export const databaseParams = {
  SECRET: process.env.SECRET || 'secret-here',
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27019',
  MONGO_DB: process.env.MONGO_DB || 'agile-test',
};

export const fieldControllers = {
  NAME_REQUIRED: 'Name is required',
  SURNAME_REQUIRED: 'Surname is required',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_UNIQUE: 'This email is already registered',
  EMAIL_FORMAT: 'You should provide a valid email',
  PASSWORD_EMPTY: 'You should provide a password'
};

export const defaultPhotoURL = 'https://fozfilms.com/wp-content/uploads/2017/03/default-avatar.png';

export const roles = ['user', 'admin'];

export const times = {
  JWT_EXPIRE: 86400
}

export const response = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
}

export const authMessages = {
  USER_NOT_FOUND: "User not found",
  INVALID_PASSWORD: 'Invalid password',
  NOT_TOKEN: 'Token not provided',
  NOT_AUTHORIZED: 'Not authorized'
}

export const userMessages = {
  EMAIL_NOT_VALID: 'Email not valid',
  EMPTY_PASSWORD: 'Password is empty'
}

export const commonMessages = {
  NOT_VALID_ID: 'Not a valid id received'
}