const router = require('express').Router();
const {newPasswordView,newPassword,verifyMail,loginViewForm,login, registerViewForm,logout, forgetPasswordViewForm,register,forgetPassword} = require('../controllers/auth')
const isAuth = require('../middleware/isAuth');

// validator
const validator= require('../middleware/validation');

router.get('/login',isAuth.oturumYok,loginViewForm)
router.post('/login',[isAuth.oturumYok,validator.validateLogin()],login)
router.get('/register',isAuth.oturumYok,registerViewForm)
router.post('/register',[isAuth.oturumYok,validator.validateNewUser()],register)
router.get('/forget-password',isAuth.oturumYok,forgetPasswordViewForm)
router.get('/new-password',isAuth.oturumYok,newPasswordView)
router.post('/new-password',[isAuth.oturumYok,validator.validateForgetPassword()],newPassword)
router.post('/forget-password',isAuth.oturumYok,forgetPassword)
router.get('/verify',verifyMail)
router.get('/logout',isAuth.oturum,logout);

module.exports = router