import {createTestAccount, createTransport, getTestMessageUrl} from 'nodemailer';

/**
 * 
 * @returns 
 */
const createTestingAccount = async () => {
    return await createTestAccount();
}

/**
 * 
 * @param {*} info 
 */
const logEmailIssues = (info) => {
    console.log("info created and sended");
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", getTestMessageUrl(info));
}

/**
 * 
 * @param {*} to 
 * @param {*} errors 
 * @param {*} totalFields 
 */
export const sendEmail = async (to, errors, totalFields) => {
    const testAccount = await createTestingAccount();

    //port 587 and security false because it's a test account
    let transporter = createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: "CRM Admin 👻",
        to: to,
        subject: 'Customers created report',
        html: errors ? `The system tried to insert some customers by a csv file and the process fail with those errors: \n
            ${errors}` :
            `The system inserted ${totalFields} new customers`,
      });

      logEmailIssues(info);
}