import {databaseParams} from './config.js'
import logger from 'loglevel';
import mongoose from 'mongoose';

mongoose
.connect(databaseParams.MONGO_URL, {
  dbName: databaseParams.MONGO_DB,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
  //family: 4
}).then(logger.info('Mongo Database connected'))
  .catch((err) => {
    logger.error("error connecting db");
    logger.error(err);
  });
