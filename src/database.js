import config from './config'
import logger from 'loglevel';
import mongoose from 'mongoose'

mongoose
  .connect(config.MONGO_URL, {
    dbName: config.MONGO_DB,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(logger.info('Mongo Database connected \n'))
  .catch((err) => logger.error(err))
