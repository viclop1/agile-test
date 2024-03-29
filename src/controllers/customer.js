import Customer from '../models/customer.js';
import User from '../models/user.js';
import logger from 'loglevel';
import { readCSV, isEmail, isURL, isValidCustomerName, isValidCustomerSurname } from './../utils.js';
import { response } from './../config.js';
import {sendEmail} from '../emails.js';

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
export const createCustomersByCsv = async (req, res) => {
  try {
    const csv = await readCSV(`src/csvTest/${req.body.fileName}`);

    const errors, emails = checkCsvIsCorrect(csv, req.userId);
    const admin = UserController.getAdminUser();
    if (!errors) {
      //send ok email and create
      await sendEmail(admin.email, null, emails.length);
      res.status(response.OK).json({ message: 'Customers successfully created' });
    } else {
      await sendEmail(admin.email, errors, null);
      res.status(response.BAD_REQUEST).json({ message: errors });
    }
  } catch (error) {
    logger.error(error);
    res.status(response.INTERNAL_SERVER_ERROR).json(error);
  }
}

/**
 * 
 * @param {*} csv 
 * @param {*} createdBy 
 * @returns 
 */
const checkCsvIsCorrect = (csv, createdBy) => {
  let errors = '';
  let rowNumber = 1;
  let emails = [];

  if (csv && csv.length)  {
    if (csv[0].length > 4) {
      errors += `The csv contains more fields per row than required. You've passed ${csv[0].length} fields and you should pass 4 -> Email;Name;Surname;URL fields`;
    } else if (csv[0].length < 4) {
      errors += `The csv contains less fields per row than required. You've passed ${csv[0].length} fields and you should pass 4 -> Email;Name;Surname;URL fields`;
    }
  }

  if (!errors) {
    for (const csvRow of csv) {
      //column number is correct.
      errors = checkFieldsFromCsv(csvRow, errors, emails, rowNumber);
      errors = checkRepeatedEmails(emails, errors);
      rowNumber++;
    }
  }

  if (!errors) {
    for (const csvRow of csv) {
      const newCustomer = new Customer(
        csvRow[0],
        csvRow[1],
        csvRow[2],
        csvRow[3],
      );

      newCustomer.createdBy = createdBy;

      await newCustomer.save();
    }
  }

  return errors, emails;
}

/**
 * 
 * @param {*} row 
 * @param {*} errors 
 * @param {*} emails 
 * @param {*} rowNumber 
 * @returns 
 */
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

/**
 * 
 * @param {*} emails 
 * @param {*} errors 
 * @returns 
 */
const checkRepeatedEmails = async(emails, errors) => {
  const repeatedUsers = await User.find({email: {$in: emails}});

  if (repeatedUsers && repeatedUsers.length) {
    errors += `The following emails are repeated in our database: ${repeatedUsers}`;
  }

  return errors;
};