const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

/* Model Imports */
const accountModel = require('../models/accounts.model');
const otpModel = require('../models/otp.model');

/* Service Imports */
const sendMail = require('../services/Node Mailer/nodemailer');

/* Function Imports */
const generateOTP = require('../functions/generateOTP');

const accountCtrl = {

    /* POST */
    postRegister: async (req, res) => {
        try {
            /* Account already exists in MongoDB Collection */
            const existingAccount = await accountModel.findOne({ email: req.body.email });
            if (existingAccount) {
                return res.status(409).json({
                    success: false,
                    message: 'Account already exists'
                });
            };

            /* Password Enryption */
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
            const data = { ...req.body, password: hashedPassword, last_login_at: new Date().toLocaleString() };

            accountModel.create(data, (err, result) => {
                if (!err) {
                    res.status(201).json({
                        success: true,
                        data: result
                    });
                } else {
                    /* Mongoose Model Validation Error */
                    if (err.name === 'ValidationError') {
                        res.status(400).json({
                            success: false,
                            message: err.message
                        });
                    } else {
                        res.status(500).json({
                            success: false,
                            message: `Internal Server Error: ${err.message}`
                        });
                    }
                }
            });
        }
        catch (err) {
            res.status(500).json({
                success: false,
                message: `Internal Server Error: ${err.message}`
            });
        }
    },


    postLogin: async (req, res) => {
        try {
            const account = await accountModel.findOne({ email: req.body.account });
            /* Account does not exist */
            if (!account) {
                res.status(404).json({
                    success: false,
                    message: 'Account does not exist'
                });
            }
            /* Account exists */
            else {
                /* Check Password */
                // bcrypt.compare(Plaintext Password, Hashed Password, Callback)
                bcrypt.compare(req.body.password, account.password, (_, success) => {
                    /* Correct Password */
                    if (success) {
                        /* JWTs*/
                        const accessToken = jwt.sign(
                            { username: account.username, email: account.email },
                            process.env.JWT_ACCESS_TOKEN_SECRET,
                            { expiresIn: '5m' }
                        );

                        const responseData = { ...account._doc, accessToken: accessToken };
                        delete responseData['password'];

                        account.lastLoginAt = new Date().toLocaleString();
                        account.save();

                        res.status(200).json({
                            success: true,
                            message: responseData
                        });
                    }
                    /* Incorrect Password */
                    else {
                        res.status(401).json({
                            success: false,
                            message: 'Incorrect Password'
                        });
                    }
                })
            }
        }
        catch (err) {
            res.status(500).json({
                success: false,
                message: `Internal Server Error: ${err.message}`
            });
        }
    },

    postResetPasswordCheckEmail: async (req, res) => {
        /* Verify Recaptcha */
        const recaptchaToken = req.body.token;

        const result = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`);

        /* Verification Success */
        if (result.status === 200 && result.data.success) {
            const account = await accountModel.findOne({ email: req.body.email });
            if (account) {
                res.status(200).json({
                    success: true,
                    data: account
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Account does not exist'
                });
            }
        }
        /* Verification Failed */
        else {
            res.status(403).json({
                success: false,
                message: 'Recaptcha Verification Failed'
            });
        }
    },

    postResetPasswordVerifyOTP: async (req, res) => {
        const account = await otpModel.findOne({ accountId: req.params.id });
        if (account) {
            if (account.otp === req.body.otp) {
                const token = jwt.sign(
                    { accountId: account.accountId, otp: account.otp },
                    process.env.JWT_ACCESS_TOKEN_SECRET,
                    { expiresIn: '5m' }
                )
                res.status(200).json({
                    success: true,
                    data: {
                        accountId: account.accountId,
                        token: token
                    }
                })
            } else {
                res.status(403).json({
                    success: false,
                    message: 'OTP Verification Failed'
                })
            }
        } else {
            res.status(404).json({
                success: false,
                message: 'OTP does not exist'
            })
        }
    },

    /* PATCH */
    patchResetPasswordReset: async (req, res) => {
        const account = await accountModel.findById(req.params.id);
        if (account) {
            try {
                const isVerified = jwt.verify(req.body.token, process.env.JWT_ACCESS_TOKEN_SECRET);
                if (isVerified) {
                    /* Password Enryption */
                    const saltRounds = 10;
                    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
                    accountModel.findOneAndUpdate(
                        { _id: req.params.id },
                        { password: hashedPassword },
                        { new: true },
                        (err, result) => {
                            if (!err) {
                                res.status(200).json({
                                    success: true,
                                    data: result
                                })
                            } else {
                                res.status(500).json({
                                    success: false,
                                    message: err.message
                                })
                            }
                        }
                    )
                } else {
                    console.log('Not Verified');
                }
            }
            /* JWT Token Expired */
            catch (err) {
                if (err.name === 'TokenExpiredError') {
                    res.status(401).json({
                        success: false,
                        message: 'JWT Token Expired'
                    })
                }
            }
        } else {
            res.status(404).json({
                success: false,
                message: 'Account does not exist'
            });
        }
    },

    /* GET */
    getResetPasswordSendEmail: async (req, res) => {
        const account = await accountModel.findOne({ _id: req.params.id });
        if (account) {
            const otp = generateOTP();
            const data = {
                accountId: req.params.id,
                otp: otp
            };

            otpModel.findOneAndUpdate(
                { accountId: req.params.id },
                data,
                { new: true, upsert: true },
                (err, _) => {
                    if (!err) {
                        const mail = sendMail(account.email, 'Reset Password OTP', otp);
                        mail
                            .then(result => {
                                res.status(200).json({
                                    success: true,
                                    data: result
                                })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    success: false,
                                    message: err.message
                                })
                            });
                    } else {
                        res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }
                }
            );
        } else {
            res.status(404).json({
                success: false,
                messa: 'Account does not exist'
            });
        }
    },
};

module.exports = accountCtrl;