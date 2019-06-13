var nodemailer = require('nodemailer');

module.exports.sendMail = async function (id, title) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sdd.sdei@gmail.com',
            pass: 'SDEI#2017chdSDD'
        }
    });
    console.log("gdsggheloo");

    const mailOptions = {
        from: 'sdd.sdei@gmail.com', // sender address
        to: id, // list of receivers
        subject: 'Application for Job Profile', // Subject line
        html: '<h3>You have an applicant for - "' + title + '" <a href="http://localhost:4200/provider-login">Show More Details </a></h3>'
    };

    let info = await transporter.sendMail(mailOptions);
    if (info) {
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    }
}