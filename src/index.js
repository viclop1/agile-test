import app from './app.js';
import {formatDate} from './controllers/utils.js';
import logger from 'loglevel';
import './database.js'

const port = app.settings.port;
const date = formatDate(new Date(), 'dd/mm/yyyy HH:MM:SS');

app.listen(port)

console.log('*'.repeat(15))
console.log(`[Agile-App] Alive on port: ${port}]`)
console.log('*'.repeat(15))
logger.info(`App started at ${date}`);