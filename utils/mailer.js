const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const sendMail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html
        })
    } catch (err) {
        console.error('Error sending email: ', err)
        throw err
    }
}

module.exports = sendMail