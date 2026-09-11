const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'earnhub07@gmail.com',
        pass: 'bovrqbjettxegorl',
    },
});

transporter.sendMail({
    from: '"EarnHub earnhub07@gmail.com"',
    to: 'test@test.com',
    subject: 'Test',
    text: 'Test',
})
.then(console.log)
.catch(console.error);
