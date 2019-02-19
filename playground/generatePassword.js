const generator = require('generate-password');
const nodemailer = require('nodemailer');
 
const password = generator.generate({
    length: 10,
    numbers: true
});
 
console.log(password);