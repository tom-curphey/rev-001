const nodemailer = require('nodemailer');

module.exports = async function sendMail(link, type) {
  console.log('LINK', link);

  try {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let account = {
      user: 'support@reciperevenue.com',
      pass: '727887@support'
    };

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'mail.reciperevenue.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: account.user, // generated ethereal user
        pass: account.pass // generated ethereal password
      }
    });

    const mailContent = `<b>Click one time link to reset your password..</b><br/><br/>${link}`;

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `"Support @ Recipe Revenue" ${account.user}`, // sender address
      to: 'mail@tomcurphey.com', // list of receivers
      subject: 'Reset Password - Recipe Revenue', // Subject line
      // text: 'Hey', // plain text body
      html: mailContent // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log(
      'Preview URL: %s',
      nodemailer.getTestMessageUrl(info)
    );
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  } catch (err) {
    console.log('ERR: ', err);
  }
};
