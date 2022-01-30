import fs from 'fs';
import { parse } from 'csv-parse';
import { isUri } from  'valid-url';

export const formatDate = (date, format) => {
    const map = {
        mm: date.getMonth() + 1,
        dd: date.getDate(),
        yy: date.getFullYear().toString().slice(-2),
        yyyy: date.getFullYear(),
        HH: date.getHours(),
        MM: date.getMinutes(),
        SS: date.getSeconds(),
    }

    return format.replace(/mm|dd|yy|yyyy|HH|MM|SS/gi, matched => map[matched])
}

export const readCSV = async(path) => {
    let csvData = [];
    await new Promise ((resolve) => {
        fs.createReadStream(path)
            .pipe(parse({delimiter: ';'}))
            .on('data', function(csvRow) {
                csvData.push(csvRow);        
            })
            .on('end', () => {
                resolve();
            });
    });

    return csvData;
}

export const isEmail = (email) => {
    return email.toLowerCase()
      .match(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      );    
};

export const isURL = (urlToCheck) => {
    return isUri(urlToCheck);
}

export const isValidCustomerName = (name) => {
    return typeof name === 'string' && name.length > 2 && name.length < 25;
}

export const isValidCustomerSurname = (surname) => {
    return typeof surname === 'string' && surname.length > 2 && surname.length < 40;
}

