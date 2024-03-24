'use strict';
var users = require('../models/user.model');
const bcrypt = require("bcryptjs");
const jsonwt = require("jsonwebtoken")
const key = require("../../../config/dbconfig");

module.exports = (app) => {

    //Login User::::
    app.post('/' + process.env.VERSION + '/loginuser', (req, res) => {
        const mobile = req.body.mobile;
        const password = req.body.password;
        users.findOne({ mobile })
            .then(user => {
                if (!user) {
                    return res.json({ responseCode: 404, responseMessage: "User not found with this contact" });
                }
                bcrypt
                    .compare(password, user.password)
                    .then(isCorrect => {
                        if (isCorrect) {
                            //use payload and create token for user
                            const payload = {
                                id: user._id,
                                mobile: user.mobile
                            };

                            jsonwt.sign(
                                payload,
                                key.secret,
                                { expiresIn: '4h' },
                                (err, token) => {

                                    res.json({
                                        responseCode: 200,
                                        responseMessage: "User Login Successfully",
                                        token: "Bearer " + token
                                    });
                                }
                            );
                        } else {
                            res.json({ responseCode: 400, responseMessage: "Password is not correct" });
                        }
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));


    });

    app.route('/' + process.env.VERSION + '/createuser').post(function (req, res, next) {
        const User = new users(req.body);
        var password = User.password;
        if (password) {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) throw err;
                    User.password = hash;
                    User.save(password);
                })
            })
        }
        User.save((err, userdata) => {
            if (userdata) {
                //     var id =userdata._id;
                //     var mailTemplate1=mailTemplate.template;
                //     var mailBody = mailTemplate1.userRegistrationBody;
                //     var mailBody = mailBody.replace('@USER',userdata.name);
                //     var mailSubject = mailTemplate1.userRegistrationSubject;
                //     mailBody = mailBody.replace('@EMAIL', userdata.email);
                //     var mailOptions = {
                //       from: `${process.env.Email}`,
                //       to: `${userdata.email}`, 
                //       subject: `${mailSubject}`,
                //       html:`${mailBody}`        
                //   };
                //   emailTransporter.transporter.sendMail(mailOptions, function (error, info) {
                //     if (error) {
                //         console.log(error);
                //     } else {
                //         console.log('Email Sent to user successfully');
                //     }
                // }); 
                res.json({
                    responseCode: 200,
                    responseMessage: "User Created Successfully"

                })
            } else {
                return res.json({ responseCode: 400, responseMessage: "Unable To Create User" });
            }
        });

    });


}