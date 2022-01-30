import Customer from '../models/customer.js';
import User from '../models/user.js';
import logger from 'loglevel';
import { readCSV, isEmail, isURL, isValidCustomerName, isValidCustomerSurname } from './utils.js';
import { response } from './../config.js';

export const createCustomer = async (req, res) => {
  try {
    const { name, surname, url } = req.body;

    const newCustomer = new Customer({ name, surname, url });
    newCustomer.createdBy = req.userId;

    const customerSaved = await newCustomer.save();

    res.status(response.CREATED).json(customerSaved);
  } catch (error) {
    logger.error(error);
    res.status(response.INTERNAL_SERVER_ERROR).json(error);
  }
}

export const getCustomers = async (req, res) => {
  try {
    const { page, perPage } = req.query;
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perPage, 10) || 10,
    };

    const customers = await Customer.paginate({}, options);

    res.status(response.OK).json(customers);
  } catch (error) {
    logger.error(error);
    res.status(response.INTERNAL_SERVER_ERROR).json(error);
  }
}

export const getCustomerById = async (req, res) => {
  try {
    const { customerId } = req.params;

    const customer = await Customer.findById(customerId)
      .populate('createdBy')
      .populate('updatedBy')

    res.status(response.OK).json(customer);
  } catch (error) {
    logger.error(error);
    res.status(response.INTERNAL_SERVER_ERROR).json(error);
  }
}

export const getCustomersByCreator = async (req, res) => {
  try {
    const { creatorId } = req.params;

    const { page, perPage } = req.query;
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perPage, 10) || 10,
    };

    const customers = await Customer.paginate({ createdBy: creatorId }, options);

    res.status(response.OK).json(customers);
  } catch (error) {
    logger.error(error);
    res.status(response.INTERNAL_SERVER_ERROR).json(error);
  }
}

export const getCustomersByUpdater = async (req, res) => {
  try {
    const { updaterId } = req.params;

    const { page, perPage } = req.query;
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perPage, 10) || 10,
    };

    const customers = await Customer.paginate({ updatedBy: updaterId }, options);

    res.status(response.OK).json(customers);
  } catch (error) {
    logger.error(error);
    res.status(response.INTERNAL_SERVER_ERROR).json(error);
  }
}

export const updateCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      req.body,
      { new: true }
    );

    updatedCustomer.updatedBy = req.userId;

    const customerSaved = await updatedCustomer.save();

    res.status(response.OK).json(customerSaved);
  } catch (error) {
    logger.error(error);
    res.status(response.INTERNAL_SERVER_ERROR).json(error);
  }
}

export const deleteCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    await Customer.findByIdAndDelete(customerId);

    res.status(response.OK).json({ message: 'User successfully deleted' });
  } catch (error) {
    logger.error(error);
    res.status(response.INTERNAL_SERVER_ERROR).json(error);
  }
}

export const createCustomersByCsv = async (req, res) => {
  try {
    const csv = await readCSV(`src/csvTest/${req.body.fileName}`);

    const errors = checkCsvIsCorrect(csv);
    
    if (!errors) {
      //send ok email and create
      res.status(response.OK).json({ message: 'Customers successfully created' });
    } else {
      //send email with errors
      res.status(response.BAD_REQUEST).json("errors");
    }
  } catch (error) {
    logger.error(error);
    res.status(response.INTERNAL_SERVER_ERROR).json(error);
  }
}

const checkCsvIsCorrect = (csv) => {
  let errors = '';
  let rowNumber = 1;
  let emails = [];

  for (const csvRow of csv) {
    if (csvRow.length > 4) {
      errors += `The csv contains more fields per row than required. You've passed ${csvRow.length} fields and you should pass 4 -> Email;Name;Surname;URL fields`;
      break;
    } else if (csvRow.length < 4) {
      errors += `The csv contains less fields per row than required. You've passed ${csvRow.length} fields and you should pass 4 -> Email;Name;Surname;URL fields`;
      break;
    } else {
      //column number is correct.
      errors = checkFieldsFromCsv(csvRow, errors, emails, rowNumber);
      errors = checkRepeatedEmails(emails, errors);
    }
    rowNumber++;
  }

  return errors;
}

const checkFieldsFromCsv = (row, errors, emails, rowNumber) => {
  if (!isEmail(row[0])) {
    errors += `First cell in row [${rowNumber}] is not a valid email \n`;
  } else {
    if (!emails.includes(row[0])) {
      emails.push(row[0]);
    } else {
      errors += `Email ${row[0]} is duplicated in the csv file \n`;
    }
  }

  if (!row[1] || !isValidCustomerName(row[1])) {
    errors += `Second cell in row [${rowNumber}] is not a valid name. The length should be between 2 and 25 \n`;
  }

  if (!row[2] || !isValidCustomerSurname(row[2])) {
    errors += `Third cell in row [${rowNumber}] is not a valid surname. The length should be between 2 and 40 \n`;
  }

  if (!row[3] || !isURL(row[3])) {
    errors += `Fourth cell in row [${rowNumber}] is not a valid URL. \n`;
  }
  return errors;
}

const checkRepeatedEmails = async(emails, errors) => {
  const repeatedUsers = await User.find({email: {$in: emails}});

  if (repeatedUsers && repeatedUsers.length) {
    errors += `The following emails are repeated in our database: ${repeatedUsers}`;
  }

  return errors;
};