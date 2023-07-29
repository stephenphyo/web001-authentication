const router = require('express').Router();

/* Controllers Imports */
const accountCtrl = require('../controllers/accounts.controller');

/* POST */
router.post('/login', accountCtrl.postLogin);
router.post('/register', accountCtrl.postRegister);
router.post('/resetpassword', accountCtrl.postResetPasswordCheckEmail);
router.post('/resetpassword/:id/otp', accountCtrl.postResetPasswordVerifyOTP);

/* PATCH */
router.patch('/resetpassword/:id/reset', accountCtrl.patchResetPasswordReset);

/* GET */
router.get('/resetpassword/:id', accountCtrl.getResetPasswordSendEmail);

module.exports = router;