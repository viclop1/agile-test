import { config } from 'dotenv';
config()

export const database = {
  PORT: process.env.PORT || 3000,
  SECRET: process.env.SECRET || 'secret-here',
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost',
  MONGO_DB: process.env.MONGO_DB || 'agile-test',
}
export const fieldControllers = {
  NAME_REQUIRED: 'Name is required',
  SURNAME_REQUIRED: 'Surname is required',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_UNIQUE: 'This email is already registered',
  EMAIL_FORMAT: 'You should provide a valid email',
  PASSWORD_EMPTY: 'You should provide a password'
}

export const defaultPhotoURL = 'https://fozfilms.com/wp-content/uploads/2017/03/default-avatar.png';

export const roles = ['user', 'admin'];